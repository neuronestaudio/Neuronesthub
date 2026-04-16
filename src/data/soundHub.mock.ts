import { Category, LogEntry, Metric, Protocol } from '../types/soundHub';

export const MOCK_PROTOCOL: Protocol = {
  id: 'neuronest-radio',
  label: '▸ PRE-REGISTRATION',
  title: 'NEURONEST RADIO',
  body: '- Coming soon to app store and google playstore',
  ctaLabel: 'PRE-REGISTER NOW'
};

export const MOCK_METRICS: Metric[] = [
  { id: 'm-1', label: 'SIGNAL STABILITY', value: '99.8', unit: '%', state: 'optimal', highlighted: true },
  { id: 'm-2', label: 'ACTIVE PROTOCOLS', value: '14', state: 'syncing' },
  { id: 'm-3', label: 'RUNTIME', value: '284', unit: 'h', state: 'optimal' },
  // 4th is the CTA diagnostic block - handled via custom component instead of direct map usually, but defined here just in case.
];

export const MOCK_CATEGORIES: Category[] = [
  { slug: 'focus-state', name: 'Focus', modality: 'focus', trackCount: 14, durationMin: 92, evidenceLevel: 2 },
  { slug: 'deep-work', name: 'Deep Work', modality: 'focus', trackCount: 8, durationMin: 120, evidenceLevel: 3 },
  { slug: 'parasympathetic-reset', name: 'Parasympathetic Reset', modality: 'reset', trackCount: 5, durationMin: 45, evidenceLevel: 1 },
  { slug: 'sleep-descent', name: 'Sleep Descent', modality: 'sleep', trackCount: 12, durationMin: 180, evidenceLevel: 2 },
  { slug: 'white-noise', name: 'White Noise', modality: 'noise', trackCount: 3, durationMin: 600, evidenceLevel: 3 },
  { slug: 'brown-noise', name: 'Brown Noise', modality: 'noise', trackCount: 3, durationMin: 600, evidenceLevel: 3 },
  { slug: 'ocean-drift', name: 'Ocean Drift', modality: 'recovery', trackCount: 7, durationMin: 140, evidenceLevel: 1 },
  { slug: 'cognitive-recovery', name: 'Cognitive Recovery', modality: 'recovery', trackCount: 9, durationMin: 110, evidenceLevel: 2 },
];

export const MOCK_LOGS: LogEntry[] = [
  { timestamp: '14:02:11', event: 'SYS_SYNC_OK', source: 'Node-1A' },
  { timestamp: '14:01:45', event: 'USER_AUTH_ACCEPTED', source: 'Auth-K' },
  { timestamp: '13:58:22', event: 'PROTOCOL_INIT_ALPHA', source: 'Engine' },
  { timestamp: '13:55:04', event: 'CACHE_CLEAR_EXEC', source: 'System' },
  { timestamp: '13:50:31', event: 'LATENCY_CHECK_2MS', source: 'Network' },
  { timestamp: '13:42:19', event: 'DIAGNOSTIC_PASS', source: 'System' },
];

export const UPLOADED_TRACKS = [
  { id: '6vez9LT68SQ', title: 'NeuroNest Upload - Track 1', category: 'calm', thumb: 'https://img.youtube.com/vi/6vez9LT68SQ/maxresdefault.jpg' },
  { id: 'GNVdfQyKsWk', title: 'NeuroNest Upload - Track 2', category: 'calm', thumb: 'https://img.youtube.com/vi/GNVdfQyKsWk/maxresdefault.jpg' },
  { id: 'nEDq7MMmxSk', title: 'NeuroNest Upload - Track 3', category: 'calm', thumb: 'https://img.youtube.com/vi/nEDq7MMmxSk/maxresdefault.jpg' },
  { id: '5-Uj9lU3-2Q', title: 'NeuroNest Upload - Track 4', category: 'calm', thumb: 'https://img.youtube.com/vi/5-Uj9lU3-2Q/maxresdefault.jpg' },
  { id: 'xDTYFBMJdXs', title: 'NeuroNest Upload - Track 5', category: 'calm', thumb: 'https://img.youtube.com/vi/xDTYFBMJdXs/maxresdefault.jpg' },
  { id: 'iU630JQqIKA', title: 'NeuroNest Upload - Track 6', category: 'calm', thumb: 'https://img.youtube.com/vi/iU630JQqIKA/maxresdefault.jpg' },
  { id: 'FNDaPf6qUEA', title: 'NeuroNest Upload - Track 7', category: 'calm', thumb: 'https://img.youtube.com/vi/FNDaPf6qUEA/maxresdefault.jpg' },
  { id: 'wLw7ylH9p88', title: 'NeuroNest Upload - Track 8', category: 'calm', thumb: 'https://img.youtube.com/vi/wLw7ylH9p88/maxresdefault.jpg' },
  { id: 'Iv1MeWyYGIQ', title: 'NeuroNest Upload - Track 9', category: 'calm', thumb: 'https://img.youtube.com/vi/Iv1MeWyYGIQ/maxresdefault.jpg' },
];
