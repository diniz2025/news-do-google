
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { STARTER_SOURCES, EMPTY_PIPELINE } from "./constants";
import type { Source, Pipeline, NewsItem, TestResult, AppState } from "./types";
import { parseFeed, dedupeByLinkOrTitle } from './services/feedService';
import { summarizeNewsItems, translateNewsItems } from "./services/geminiService";
import Header from "./components/Header";
import ActionBar from "./components/ActionBar";
import SourcesTab from "./components/SourcesTab";
import PipelineTab from "./components/PipelineTab";
import ScheduleTab from "./components/ScheduleTab";
import RoutesTab from "./components/RoutesTab";
import WebhooksTab from "./components/WebhooksTab";
import KeysTab from "./components/KeysTab";
import LogsTab from "./components/LogsTab";
import ResultsTab from "./components/ResultsTab";
import Footer from "./components/Footer";

const TABS = {
  sources: "🌐 Fontes",
  pipelines: "⚙️ Pipelines",
  schedule: "🕒 Agendamentos",
  routes: "⚡ Roteamento",
  webhooks: "🪝 Webhooks",
  keys: "🔑 Chaves/API",
  logs: "📋 Logs",
  results: "📰 Resultados",
};

type TabKey = keyof typeof TABS;

const INTERNATIONAL_SOURCE_IDS = ['bbc', 'guardian', 'reuters_world', 'ap_top', 'hn'];

function runSelfTests(): TestResult[] {
    const results: TestResult[] = [];
    results.push({
      name: "sources-have-required-fields",
      ok: STARTER_SOURCES.every(
        (s) => typeof s.id === "string" && typeof s.name === "string" && typeof s.url === "string" && typeof s.enabled === "boolean" && typeof s.type === "string"
      ),
    });
    const sch = EMPTY_PIPELINE.schedule;
    results.push({ name: "schedule-hour-valid", ok: sch.hour >= 0 && sch.hour <= 23 });
    results.push({ name: "schedule-minute-valid", ok: sch.minute >= 0 && sch.minute <= 59 });
    const ids = new Set(EMPTY_PIPELINE.steps.map((s) => s.id));
    results.push({ name: "steps-unique", ok: ids.size === EMPTY_PIPELINE.steps.length });
    return results;
}

export default function App() {
  const [sources, setSources] = useState<Source[]>(STARTER_SOURCES);
  const [pipeline, setPipeline] = useState<Pipeline>(EMPTY_PIPELINE);
  const [zapi, setZapi] = useState({ appId: "1000001874", apiKey: "pGMDIQ3MDD1cQUQOEAmK7mRy21DEFGCs", phone: "+55 11 99410-4891", enabled: true });
  const [email, setEmail] = useState({ to: "dcgseguros@gmail.com", from: "news@dcgseguros.com.br", subject: "DCG News Feed – 08h", enabled: true });
  const [drive, setDrive] = useState({ folder: "DCG/NewsFeed/diario", enabled: true });
  
  const [appState, setAppState] = useState<AppState>({
    status: "idle",
    log: [],
    tests: [],
    results: [],
    corsProxy: "https://api.allorigins.win/raw?url=",
    onlyEnabledSources: true,
    activeTab: 'results',
  });

  const testsOk = useMemo(() => appState.tests.length > 0 && appState.tests.every((t) => t.ok), [appState.tests]);

  useEffect(() => {
    setAppState(s => ({ ...s, tests: runSelfTests() }));
  }, []);
  
  const addLog = useCallback((message: string) => {
    setAppState(s => ({...s, log: [...s.log, `[${new Date().toLocaleString()}] ${message}`]}));
  }, []);

  const runNow = useCallback(async () => {
    setAppState(s => ({ ...s, status: 'running' }));
    addLog("Execução manual iniciada");

    try {
      const activeSources = (appState.onlyEnabledSources ? sources.filter((s) => s.enabled) : sources).filter((s) => s.url);
      addLog(`Buscando de ${activeSources.length} fontes...`);

      const fetchPromises = activeSources.map(async (src) => {
        try {
          const res = await fetch(`${appState.corsProxy}${encodeURIComponent(src.url)}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const xml = await res.text();
          const items = parseFeed(xml, src);
          addLog(`✓ ${src.name}: ${items.length} itens`);
          return items;
        } catch (e: any) {
          addLog(`✗ ${src.name}: ${e?.message || String(e)}`);
          return [];
        }
      });

      const allItems = (await Promise.all(fetchPromises)).flat();
      let processedItems = dedupeByLinkOrTitle(allItems);
      addLog(`Encontrados ${processedItems.length} itens únicos (antes da tradução).`);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const itemsToTranslate = processedItems.filter(it => INTERNATIONAL_SOURCE_IDS.includes(it.sourceId));
      if (itemsToTranslate.length > 0) {
        addLog(`Iniciando tradução de ${itemsToTranslate.length} itens de fontes internacionais...`);
        try {
          const translatedItems = await translateNewsItems(itemsToTranslate, ai);
          const itemsToKeep = processedItems.filter(it => !INTERNATIONAL_SOURCE_IDS.includes(it.sourceId));
          processedItems = [...itemsToKeep, ...translatedItems];
          addLog('Tradução concluída.');
        } catch (error) {
          console.error("Gemini translation failed:", error);
          addLog(`✗ Erro na tradução com IA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      processedItems = processedItems
        .sort((a, b) => (b.date || 0) - (a.date || 0))
        .slice(0, 200);
      
      addLog(`Processando ${processedItems.length} itens únicos.`);

      const summarizeStep = pipeline.steps.find(s => s.id === 'summarize-ai');
      if (summarizeStep?.enabled) {
        addLog('Iniciando sumarização com IA (Gemini)...');
        try {
            processedItems = await summarizeNewsItems(processedItems, pipeline.summaryPrompt, ai);
            addLog('Sumarização com IA concluída.');
        } catch (error) {
            console.error("Gemini summarization failed:", error);
            addLog(`✗ Erro na sumarização com IA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      setAppState(s => ({ ...s, results: processedItems }));
      addLog(`✔️ Concluído. Total: ${processedItems.length} notícias processadas.`);
    } catch (error) {
        console.error("Pipeline execution failed:", error);
        addLog(`❌ Erro geral na execução: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setAppState(s => ({ ...s, status: 'idle' }));
    }
  }, [appState.onlyEnabledSources, appState.corsProxy, sources, addLog, pipeline.steps, pipeline.summaryPrompt]);

  const toggleSource = (id: string) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };
  
  const setSchedule = <K extends keyof Pipeline["schedule"]>(key: K, value: Pipeline["schedule"][K]) => {
    setPipeline((p) => ({ ...p, schedule: { ...p.schedule, [key]: value } }));
  };

  const renderTabContent = () => {
    switch (appState.activeTab) {
      case 'sources':
        return <SourcesTab sources={sources} toggleSource={toggleSource} />;
      case 'pipelines':
        return <PipelineTab pipeline={pipeline} setPipeline={setPipeline} />;
      case 'schedule':
        return <ScheduleTab schedule={pipeline.schedule} setSchedule={setSchedule} />;
      case 'routes':
        return <RoutesTab drive={drive} setDrive={setDrive} email={email} setEmail={setEmail} zapi={zapi} setZapi={setZapi} />;
      case 'webhooks':
        return <WebhooksTab />;
      case 'keys':
        return <KeysTab />;
      case 'logs':
        return <LogsTab log={appState.log} />;
      case 'results':
        return <ResultsTab results={appState.results} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-white to-slate-50 text-slate-900 font-sans">
      <Header testsOk={testsOk} />
      <ActionBar
        corsProxy={appState.corsProxy}
        setCorsProxy={(value) => setAppState(s => ({ ...s, corsProxy: value }))}
        onlyEnabled={appState.onlyEnabledSources}
        setOnlyEnabled={(value) => setAppState(s => ({ ...s, onlyEnabledSources: value }))}
        onRunNow={runNow}
        isRunning={appState.status === 'running'}
      />

      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {(Object.keys(TABS) as TabKey[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setAppState(s => ({...s, activeTab: tabKey}))}
              className={`${
                appState.activeTab === tabKey
                  ? 'border-slate-800 text-slate-900 font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
            >
              {TABS[tabKey]}
            </button>
          ))}
        </nav>
      </div>
      
      <main className="mt-4">
        {renderTabContent()}
      </main>

      <Footer />
    </div>
  );
}
