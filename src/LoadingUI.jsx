import { useState, useEffect } from 'react';

export default function LoadingUI() {
    const phases = [
        { text: "Initializing Gedanken Engine", icon: "engine" },
        { text: "Analyzing Creative Brief", icon: "database" },
        { text: "Generating Veo Backgrounds", icon: "video" },
        { text: "Rendering Visual Assets", icon: "image" },
        { text: "Building Campaign Tree", icon: "wave" }
    ];

    const [phaseIndex, setPhaseIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhaseIndex((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
        }, 1200);
        return () => clearInterval(interval);
    }, [phases.length]);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + Math.random() * 3, 100));
        }, 100);
        return () => clearInterval(progressInterval);
    }, []);

    const renderIcon = (type) => {
        switch(type) {
            case 'engine':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                );
            case 'database':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                );
            case 'video':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                );
            case 'image':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                );
            case 'wave':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 12c.6-.6 1.2-1.2 2-1.2s1.4.6 2 1.2c.6.6 1.2 1.2 2 1.2s1.4-.6 2-1.2c.6-.6 1.2-1.2 2-1.2s1.4.6 2 1.2c.6.6 1.2 1.2 2 1.2s1.4-.6 2-1.2c.6-.6 1.2-1.2 2-1.2s1.4.6 2 1.2" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            zIndex: 10, pointerEvents: 'none', fontFamily: '"Space Grotesk", sans-serif',
            gap: '32px'
        }}>
            {/* Current Phase */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                color: '#00d4ff',
                animation: 'pulse 1.5s infinite'
            }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {renderIcon(phases[phaseIndex].icon)}
                </div>
                <span style={{ fontSize: '20px', fontWeight: '300', letterSpacing: '1px' }}>
                    {phases[phaseIndex].text}
                </span>
            </div>

            {/* Progress Bar */}
            <div style={{
                width: 'min(80%, 400px)',
                height: '2px',
                background: 'rgba(124, 58, 237, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #00d4ff 0%, #7c3aed 100%)',
                    borderRadius: '2px',
                    transition: 'width 0.3s ease-out',
                    boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
                }} />
            </div>

            {/* Phase Indicators */}
            <div style={{
                display: 'flex', gap: '8px', alignItems: 'center'
            }}>
                {phases.map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: idx === phaseIndex ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: idx <= phaseIndex 
                                ? 'linear-gradient(90deg, #00d4ff 0%, #7c3aed 100%)'
                                : 'rgba(107, 104, 128, 0.3)',
                            transition: 'all 0.3s ease',
                            boxShadow: idx === phaseIndex ? '0 0 10px rgba(0, 212, 255, 0.5)' : 'none'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
