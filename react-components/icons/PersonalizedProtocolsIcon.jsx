/**
 * Personalized Protocols Icon
 * 
 * Concept: Adaptive orbit nodes drifting around dashed rings with a central
 * indigo core. Represents individual neurological variability — nodes shift
 * position suggesting recalibration and adaptive tuning.
 * 
 * Animation: 4 orbit nodes slowly drift to new positions on an 8s loop,
 * outer ring subtly rotates with a breathing opacity pulse.
 */
import { useId } from 'react';

export default function PersonalizedProtocolsIcon({ className = '', size = 140 }) {
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

            {/* Outer orbit ring */}
            <circle
                className="animate-orbit-ring"
                cx="32" cy="32" r="20"
                fill="none" stroke="currentColor"
                strokeWidth="0.8" strokeDasharray="6 4" opacity="0.3"
            />

            {/* Inner ring */}
            <circle cx="32" cy="32" r="10" fill="none" stroke="currentColor"
                strokeWidth="0.7" strokeDasharray="3 3" opacity="0.2" />

            {/* Center node */}
            <circle cx="32" cy="32" r="3.5" fill="#6366F1" opacity="0.9" filter={`url(#${filterId})`} />
            <circle cx="32" cy="32" r="1.5" fill="white" opacity="1" />

            {/* Adaptive orbit nodes */}
            <circle className="animate-orbit-n1" cx="20" cy="16" r="3" fill="none" stroke="#6366F1"
                strokeWidth="1.2" opacity="0.7" filter={`url(#${filterId})`} />
            <circle className="animate-orbit-n1" cx="20" cy="16" r="1.2" fill="white" opacity="0.8" />

            <circle className="animate-orbit-n2" cx="44" cy="16" r="3" fill="none" stroke="currentColor"
                strokeWidth="1" opacity="0.6" />
            <circle className="animate-orbit-n2" cx="44" cy="16" r="1.2" fill="white" opacity="0.7" />

            <circle className="animate-orbit-n3" cx="20" cy="48" r="3" fill="none" stroke="currentColor"
                strokeWidth="1" opacity="0.6" />
            <circle className="animate-orbit-n3" cx="20" cy="48" r="1.2" fill="white" opacity="0.7" />

            <circle className="animate-orbit-n4" cx="44" cy="48" r="3" fill="none" stroke="#6366F1"
                strokeWidth="1.2" opacity="0.7" filter={`url(#${filterId})`} />
            <circle className="animate-orbit-n4" cx="44" cy="48" r="1.2" fill="white" opacity="0.8" />

            {/* Connecting lines from nodes to center */}
            <line x1="20" y1="16" x2="32" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
            <line x1="44" y1="16" x2="32" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
            <line x1="20" y1="48" x2="32" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
            <line x1="44" y1="48" x2="32" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        </svg>
    );
}
