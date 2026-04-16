import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    id: 'focus',
    title: 'FOCUS CORE',
    desc: 'Minimise cognitive competition. Maximise sustained attention.',
    modules: [
      {
        name: 'Low-Key Ambient',
        mechanics: 'Minimises predictive error in left temporal regions; significantly reduces language network competition.',
        positioning: 'Work that deserves a clear head.',
        evidence: 'Strong'
      },
      {
        name: 'Minimal Electronic',
        mechanics: 'Steady periodicity entrains motor areas. Predictability lowers novelty-driven attention capture.',
        positioning: 'Precision sound for structured thinking.',
        evidence: 'Strong'
      },
      {
        name: 'Stochastic Masking (Brown/Pink Noise)',
        mechanics: 'Broadband sound layers elevate the auditory noise floor, perceptually flattening environmental interruptions before they breach focus.',
        positioning: 'Less interruption. Less fragmentation.',
        evidence: 'Strong'
      },
      {
        name: 'Soft Techno Pulse',
        mechanics: 'Sensorimotor coupling via auditory-motor loops acts as an external pacing scaffold for output-driven, repetitive action.',
        positioning: 'Rhythm for getting through it.',
        evidence: 'Moderate'
      },
      {
        name: 'Neo-Classical Minimalism',
        mechanics: 'Sparse harmonic movement lightly engages the Default Mode Network (DMN) without limbic overactivation.',
        positioning: 'For thinking slowly, and thinking well.',
        evidence: 'Moderate'
      }
    ]
  },
  {
    id: 'relax',
    title: 'EMOTIONAL RESET & RESTORATION',
    desc: 'Vagal pathway activation. Safety signalling.',
    modules: [
      {
        name: 'Nature Soundscapes',
        mechanics: 'Activates parasympathetic rest-and-digest states; leverages evolutionary biophilic safety signalling to pull the brain off high-alert.',
        positioning: 'Restoration your nervous system already knows how to use.',
        evidence: 'Strong'
      },
      {
        name: 'Ambient Drone',
        mechanics: 'Low change-rates suspend auditory novelty detection in the superior temporal cortex, permitting rapid cognitive down-regulation.',
        positioning: 'Stillness you can lean into.',
        evidence: 'Moderate'
      },
      {
        name: 'Slow Piano & Modern Classical',
        mechanics: 'Engages limbic circuitry using low-intensity affective stimuli, supporting emotional digestion over pure blank down-regulation.',
        positioning: 'The emotional exhale.',
        evidence: 'Strong'
      }
    ]
  },
  {
    id: 'sleep',
    title: 'SLEEP ARCHITECTURE',
    desc: 'Acoustic thalamo-cortical coupling designed for heavy nights.',
    modules: [
      {
        name: 'Pink Noise Regulators',
        mechanics: 'Matches the 1/f spectral curve of natural sound distributions. Amplifies slow-wave amplitude and memory consolidation during NREM sleep.',
        positioning: 'Soft-spectrum masking, grounded in sleep science.',
        evidence: 'Strong'
      },
      {
        name: 'Heavy Brown Noise',
        mechanics: 'Energy drops violently to the low end (1/f²). Reduces high-frequency arousal and blankets deep situational disruptions like traffic.',
        positioning: 'Deeper, darker, for heavier nights.',
        evidence: 'Moderate'
      }
    ]
  },
  {
    id: 'neuro',
    title: 'NEURO-CURIOUS & STIMULATION',
    desc: 'Experimental auditory manipulation and edge-case protocols.',
    modules: [
      {
        name: 'Psychoacoustic Illusions',
        mechanics: 'Exploits auditory cortex construction mechanisms (e.g. Shepard Tones). Reveals how the brain mathematically hallucinates acoustic space.',
        positioning: 'Hear your brain interpret the world.',
        evidence: 'Strong'
      },
      {
        name: 'Binaural & Isochronic Pulses',
        mechanics: 'Frequency-following response via brainstem entrainment. Aims to actively push EEG rhythms through differential frequency injection.',
        positioning: 'Curious listening at the edge of neuroscience.',
        evidence: 'Emerging/Mixed'
      },
      {
        name: 'ADHD-Oriented Stimulation',
        mechanics: 'Applies the "optimal stimulation" model, injecting calibrated dopaminergic reward prediction errors to keep under-aroused minds locked in.',
        positioning: 'Built for restless attention.',
        evidence: 'Emerging'
      }
    ]
  }
];

export default function TheoryView() {
  const getEvidenceColor = (evidence: string) => {
    if (evidence.includes('Strong')) return 'text-[#2e8b57] border-[#2e8b57] bg-[#2e8b57]/10';
    if (evidence.includes('Moderate')) return 'text-[#d2691e] border-[#d2691e] bg-[#d2691e]/10';
    if (evidence.includes('Emerging') || evidence.includes('Mixed')) return 'text-[#8a2be2] border-[#8a2be2] bg-[#8a2be2]/10';
    return 'text-ash border-ash bg-panel';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10"
    >
      <header className="flex flex-col border-b border-border-hairline pb-6">
         <div className="inline-block bg-accent-signal text-obsidian font-mono text-[10px] uppercase px-[10px] py-[6px] w-fit mb-4">
           THEORY ENGINE
         </div>
         <h1 className="font-display text-[44px] leading-none uppercase">Acoustic Mechanisms</h1>
         <p className="font-sans text-[15px] text-ash max-w-[600px] mt-4 leading-relaxed">
           Our proprietary category framework bridges peer-reviewed chronobiology and world-class sound design. This is the physiological blueprint for how your auditory cortex is being hacked for peak performance, restoration, and profound sleep.
         </p>
      </header>

      <div className="flex flex-col gap-16 pb-12">
        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className="flex flex-col gap-6">
            <div className="border-l-2 border-accent-signal pl-4">
              <h2 className="font-mono text-[12px] uppercase text-accent-signal tracking-brand">{cat.title}</h2>
              <p className="font-sans text-[16px] text-bone mt-1">{cat.desc}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.modules.map((mod, midx) => (
                <div key={midx} className="bg-panel border border-border-hairline p-5 flex flex-col justify-between hover:border-accent-signal/40 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-display text-[18px] uppercase font-bold text-bone">{mod.name}</h3>
                      <span className={`font-mono text-[9px] uppercase px-2 py-1 rounded-sm border ${getEvidenceColor(mod.evidence)}`}>
                        {mod.evidence}
                      </span>
                    </div>
                    <p className="font-mono text-[12px] text-ash tracking-tight leading-relaxed font-semibold">
                      {mod.mechanics}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border-hairline/50">
                    <span className="block font-mono text-[9px] text-ash uppercase mb-1">Positioning Directive</span>
                    <p className="font-sans text-[14px] text-bone italic clash-display">"{mod.positioning}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
