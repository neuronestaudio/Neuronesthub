/**
 * Evidence-Based Design Icon
 * 
 * Concept: A waveform stabilizing on a calibration grid, with a
 * verification checkmark that briefly reveals — representing peer-reviewed
 * research, measurement, and protocol validation.
 * 
 * Animation: The waveform subtly dampens over time, and an indigo
 * verification check draws itself in, then fades — implying measurement
 * and confidence.
 */
import { useId } from 'react';

export default function EvidenceBasedIcon({ className = '', size = 140 }) {
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

            {/* Calibration grid — horizontal lines */}
            <line className="animate-grid-reveal" x1="8" y1="52" x2="56" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
            <line className="animate-grid-reveal" x1="8" y1="42" x2="56" y2="42" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
            <line className="animate-grid-reveal" x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
            <line className="animate-grid-reveal" x1="8" y1="22" x2="56" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
            <line className="animate-grid-reveal" x1="8" y1="12" x2="56" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />

            {/* Vertical axis */}
            <line x1="8" y1="12" x2="8" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />

            {/* Waveform that stabilizes */}
            <path
                className="animate-wave-stabilize"
                d="M8,32 Q16,20 24,32 T40,32 T56,32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
            />

            {/* Verification check — draws in and fades */}
            <path
                className="animate-check-draw"
                d="M44,18 L48,24 L56,12"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0"
                strokeDasharray="16"
                filter={`url(#${filterId})`}
            />
        </svg>
    );
}
