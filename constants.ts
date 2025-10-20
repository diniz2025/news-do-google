
import type { Source, Pipeline } from './types';

export const STARTER_SOURCES: Source[] = [
  { id: "abrange", name: "ABRANGE", url: "https://www.abrange.org.br/feed/", enabled: true, type: "rss/http" },
  { id: "cnseg", name: "CNseg", url: "https://www.cnseg.org.br/noticias/_jcr_content.feed", enabled: true, type: "rss/http" },
  { id: "sincorsp", name: "Sincor-SP", url: "https://www.sincor.org.br/feed/", enabled: true, type: "rss/http" },
  { id: "fenacor", name: "Fenacor", url: "https://www.fenacor.org.br/index.php/noticias?format=feed&type=rss", enabled: true, type: "rss/http" },
  { id: "ens", name: "ENS (Funenseg)", url: "https://www.ens.edu.br/noticias/rss", enabled: true, type: "rss/http" },
  { id: "ans", name: "ANS", url: "https://www.gov.br/ans/pt-br/assuntos/noticias/RSS", enabled: true, type: "rss/http" },
  { id: "susep", name: "SUSEP", url: "https://www.gov.br/susep/pt-br/assuntos/noticias/RSS", enabled: true, type: "rss/http" },
  { id: "fhoresp", name: "FHORESP", url: "https://www.fhoresp.com.br/feed/", enabled: true, type: "rss/http" },
  { id: "sinhores", name: "SinHoRes Osasco", url: "https://sinhoresosasco.com.br/feed/", enabled: true, type: "rss/http" },
  { id: "bbc", name: "BBC World", url: "http://feeds.bbci.co.uk/news/world/rss.xml", enabled: true, type: "rss/http" },
  { id: "guardian", name: "The Guardian – World", url: "https://www.theguardian.com/world/rss", enabled: true, type: "rss/http" },
  { id: "reuters_world", name: "Reuters – World News", url: "https://feeds.reuters.com/reuters/worldNews", enabled: true, type: "rss/http" },
  { id: "ap_top", name: "AP – Top Stories", url: "https://apnews.com/hub/ap-top-news?utm_source=rss", enabled: false, type: "rss/http" },
  { id: "hn", name: "Hacker News (front)", url: "https://hnrss.org/frontpage", enabled: false, type: "rss/http" },
];

export const EMPTY_PIPELINE: Pipeline = {
  name: "Pipeline Diário 08:00",
  schedule: { freq: "DAILY", hour: 8, minute: 0 },
  summaryPrompt: "Resuma a seguinte notícia em 3 a 5 bullet points concisos. Foque no impacto para o mercado de seguros, corretores e planos de saúde. Mantenha um tom profissional e direto.",
  steps: [
    { id: "fetch", label: "Coletar Fontes (HTTP/RSS)", enabled: true },
    { id: "dedupe", label: "Deduplicar (URL/Título)", enabled: true },
    { id: "classify", label: "Classificar (Seguros/Planos/Insurtech/IA/HORECA/Reguladores)", enabled: true },
    { id: "summarize", label: "Resumir (primeiras linhas/descrição)", enabled: true },
    { id: "summarize-ai", label: "Sumarizar com IA (Gemini)", enabled: false },
    { id: "route", label: "Roteamento: Painel + E-mail + WhatsApp (Z-API)", enabled: true },
  ],
};
