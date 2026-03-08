/**
 * Neural Entrainment Icon
 * 
 * Concept: An anatomical brain outline with staggered neural pulse nodes
 * firing across cortical regions. Represents the brain synchronizing its
 * electrical activity to rhythmic auditory stimuli.
 * 
 * Animation: Indigo pulse nodes fade in/out sequentially across the brain,
 * suggesting phase-locking and neural synchronization.
 */
import { useId } from 'react';

export default function NeuralEntrainmentIcon({ className = '', size = 140 }) {
  const filterId = useId();

  return (
    <svg
      className={`${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Brain outline — left hemisphere */}
      <path
        className="animate-brain-glow"
        d="M32,8 C26,8 21,10 18,14 C15,18 14,23 14,28 C14,33 15,37 18,40 C20,42 22,44 24,46 C25,48 26,50 27,52 L32,52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Brain outline — right hemisphere */}
      <path
        className="animate-brain-glow"
        d="M32,8 C38,8 43,10 46,14 C49,18 50,23 50,28 C50,33 49,37 46,40 C44,42 42,44 40,46 C39,48 38,50 37,52 L32,52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Central fissure */}
      <line x1="32" y1="8" x2="32" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

      {/* Cortical folds — left */}
      <path d="M20,18 Q24,16 28,20" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />
      <path d="M16,28 Q22,25 26,30" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <path d="M18,36 Q23,34 27,38" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />

      {/* Cortical folds — right */}
      <path d="M44,18 Q40,16 36,20" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />
      <path d="M48,28 Q42,25 38,30" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <path d="M46,36 Q41,34 37,38" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />

      {/* Neural pulse nodes — staggered animation */}
      <circle className="animate-brain-pulse delay-0" cx="24" cy="22" r="2" fill="#6366F1" opacity="0" filter={`url(#${filterId})`} />
      <circle className="animate-brain-pulse delay-1500" cx="40" cy="26" r="1.8" fill="#6366F1" opacity="0" filter={`url(#${filterId})`} />
      <circle className="animate-brain-pulse delay-3000" cx="28" cy="34" r="1.5" fill="#6366F1" opacity="0" filter={`url(#${filterId})`} />
      <circle className="animate-brain-pulse delay-4500" cx="38" cy="38" r="1.5" fill="#6366F1" opacity="0" filter={`url(#${filterId})`} />

      {/* Brainstem */}
      <path d="M30,52 Q32,56 34,52" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
