/**
 * FeatureSection — The Science of Auditory Neuromodulation
 * 
 * A dark, premium feature section displaying 4 technology blocks
 * in a side-by-side layout (text left, icon right) with strong
 * spacing and editorial typography.
 */
import {
    NeuralEntrainmentIcon,
    DeliveryMethodsIcon,
    EvidenceBasedIcon,
    PersonalizedProtocolsIcon,
} from './icons';

const features = [
    {
        num: '01',
        title: 'Neural Entrainment',
        description:
            'The brain synchronizes its electrical activity to rhythmic auditory stimuli. NeuroNest targets specific brainwave frequencies (delta for sleep, beta for focus, alpha for calm) using precisely calibrated audio patterns.',
        Icon: NeuralEntrainmentIcon,
    },
    {
        num: '02',
        title: 'Delivery Methods',
        description:
            'We engineer four primary modalities — binaural beats, isochronic tones, amplitude-modulated noise, and frequency-following response (FFR) stimuli — each optimized for different neurological targets.',
        Icon: DeliveryMethodsIcon,
    },
    {
        num: '03',
        title: 'Evidence-Based Design',
        description:
            'Every NeuroNest protocol is grounded in peer-reviewed neuroscience. Our research database spans 30+ papers covering ASSR, FFR, psychoacoustics, and clinical applications of auditory stimulation.',
        Icon: EvidenceBasedIcon,
    },
    {
        num: '04',
        title: 'Personalized Protocols',
        description:
            "Individual neurological responses vary. NeuroNest's approach adapts stimulation parameters — frequency, modulation depth, session duration — based on use case and emerging efficacy data.",
        Icon: PersonalizedProtocolsIcon,
    },
];

export default function FeatureSection() {
    return (
        <section className="bg-black text-white py-32 px-6 md:px-12 lg:px-20">
            <div className="max-w-[1200px] mx-auto">
                {/* Section header */}
                <span className="block font-mono text-xs tracking-[0.3em] uppercase text-indigo-400 mb-4">
                    Technology
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight max-w-[700px] mb-20">
                    The Science of Auditory Neuromodulation
                </h2>

                {/* Feature blocks */}
                <div className="space-y-28">
                    {features.map(({ num, title, description, Icon }) => (
                        <div
                            key={num}
                            className="group flex flex-col-reverse md:flex-row items-center gap-6 md:gap-16"
                        >
                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <span className="block font-mono text-xs tracking-widest text-indigo-400 mb-3">
                                    {num}
                                </span>
                                <h3 className="text-xl md:text-2xl font-medium mb-4 tracking-tight">
                                    {title}
                                </h3>
                                <p className="text-gray-400 text-base md:text-[17px] leading-relaxed max-w-[600px]">
                                    {description}
                                </p>
                            </div>

                            {/* Icon */}
                            <div className="flex-shrink-0 opacity-85 transition-opacity duration-400 group-hover:opacity-100">
                                <Icon size={140} className="text-white/80" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
