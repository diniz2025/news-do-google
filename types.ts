
export type Source = {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  type: string;
};

export type PipelineStep = {
  id: string;
  label: string;
  enabled: boolean;
};

export type Pipeline = {
  name: string;
  schedule: {
    freq: "HOURLY" | "DAILY" | "WEEKLY";
    hour: number;
    minute: number;
  };
  steps: PipelineStep[];
  summaryPrompt: string;
};

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  description?: string;
  date?: number; // epoch ms
  sourceId: string;
  sourceName: string;
  tags: string[];
  bullets?: string[];
};

export type TestResult = {
  name: string;
  ok: boolean;
  message?: string;
};

export type AppState = {
  status: 'idle' | 'running';
  log: string[];
  tests: TestResult[];
  results: NewsItem[];
  corsProxy: string;
  onlyEnabledSources: boolean;
  activeTab: string;
};
