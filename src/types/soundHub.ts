export type Protocol = { 
  id: string; 
  label: string; 
  title: string; 
  body: string; 
  ctaLabel: string; 
};

export type Metric = { 
  id: string; 
  label: string; 
  value: string; 
  unit?: string; 
  state?: 'optimal'|'syncing'|'warn'; 
  highlighted?: boolean; 
};

export type Category = { 
  slug: string; 
  name: string; 
  modality: 'focus'|'sleep'|'reset'|'noise'|'recovery'; 
  trackCount: number; 
  durationMin: number; 
  evidenceLevel: 1|2|3; 
};

export type LogEntry = { 
  timestamp: string; 
  event: string; 
  source: string; 
};
