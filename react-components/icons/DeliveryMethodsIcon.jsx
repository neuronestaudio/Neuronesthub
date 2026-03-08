/**
 * Delivery Methods Icon
 * 
 * Concept: Four signal paths converging from corner nodes to a central
 * indigo hub. Represents the 4 primary delivery modalities (binaural beats,
 * isochronic tones, amplitude-modulated noise, FFR stimuli) all feeding
 * into a unified neurological target.
 * 
 * Animation: Dashed signal lines flow toward center with staggered timing,
 * central hub pulses with a restrained glow.
 */
import { useId } from 'react';

export default function DeliveryMethodsIcon({ className = '', size = 140 }) {
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
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* 4 signal paths converging to center hub */}
            <line className="animate-signal-flow delay-0" x1="8" y1="12" x2="28" y2="28"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 3" opacity="0.5" />
            <line className="animate-signal-flow delay-800" x1="56" y1="12" x2="36" y2="28"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 3" opacity="0.5" />
            <line className="animate-signal-flow delay-1600" x1="8" y1="52" x2="28" y2="36"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 3" opacity="0.5" />
            <line className="animate-signal-flow delay-2400" x1="56" y1="52" x2="36" y2="36"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 3" opacity="0.5" />

            {/* Origin nodes */}
            <circle cx="8" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="56" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="8" cy="52" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="56" cy="52" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />

            {/* Central hub */}
            <circle className="animate-hub-glow" cx="32" cy="32" r="6" fill="none" stroke="#6366F1"
                strokeWidth="1.5" opacity="0.8" filter={`url(#${filterId})`} />
            <circle cx="32" cy="32" r="2.5" fill="#6366F1" opacity="1" filter={`url(#${filterId})`} />
        </svg>
    );
}
