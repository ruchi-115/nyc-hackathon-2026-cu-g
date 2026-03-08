import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import BreathingOrb from './BreathingOrb';
import EntryUI from './EntryUI';
import ParticleTransition from './ParticleTransition';
import LoadingUI from './LoadingUI';
import MainExperience from './MainExperience';

// Content titles for the deep dive worlds
const contentTitles = {
    1: { title: 'Event Horizon', subtitle: 'The point of no return' },
    2: { title: 'Spacetime Fabric', subtitle: 'Where mass meets geometry' },
    3: { title: 'Quantum Void', subtitle: 'Particles at the edge of existence' },
    4: { title: 'Gravitational Lens', subtitle: 'Light bending through cosmos' }
};

export default function App() {
    const [appState, setAppState] = useState('ENTRY');
    const [isListening, setIsListening] = useState(false);
    const [selectedWorld, setSelectedWorld] = useState(null);
    const [userPrompt, setUserPrompt] = useState('');

    const handlePromptSubmit = (prompt) => {
        setUserPrompt(prompt);
        setAppState('GENERATING');
    };

    const handleLoadingComplete = () => {
        setAppState('EXPERIENCE');
    };

    const handleNodeClick = (nodeId) => {
        setSelectedWorld(nodeId);
        setAppState('GENERATING_WORLD');
    };

    const handleWorldLoadingComplete = () => {
        setAppState('EXPLORE_WORLD');
    };

    const handleBackToExperience = () => {
        setAppState('EXPERIENCE');
        setSelectedWorld(null);
    };

    return (
        <div style={{ 
            width: '100vw', 
            height: '100vh', 
            background: 'linear-gradient(180deg, #030014 0%, #0f0728 50%, #030014 100%)', 
            overflow: 'hidden' 
        }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
                {appState === 'ENTRY' && <BreathingOrb isListening={isListening} />}

                {appState === 'GENERATING' && <ParticleTransition onComplete={handleLoadingComplete} />}

                {appState === 'EXPERIENCE' && (
                    <Suspense fallback={
                        <Html center>
                            <div style={{ 
                                color: '#e8e6f0', 
                                fontFamily: '"Space Grotesk", sans-serif',
                                display: 'flex', alignItems: 'center', gap: '12px'
                            }}>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: '#00d4ff', animation: 'pulse 1s infinite'
                                }} />
                                Initializing cosmic environment...
                            </div>
                        </Html>
                    }>
                        <MainExperience onNodeSelect={handleNodeClick} />
                    </Suspense>
                )}

                {appState === 'GENERATING_WORLD' && <ParticleTransition onComplete={handleWorldLoadingComplete} />}

                {appState === 'EXPLORE_WORLD' && (
                    <Html center>
                        <div style={{ 
                            textAlign: 'center', 
                            color: '#e8e6f0', 
                            fontFamily: '"Space Grotesk", sans-serif',
                            maxWidth: '600px',
                            padding: '40px'
                        }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(0, 212, 255, 0.1)',
                                border: '1px solid rgba(0, 212, 255, 0.3)',
                                borderRadius: '20px',
                                padding: '6px 16px',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: '#00d4ff', boxShadow: '0 0 8px #00d4ff'
                                }} />
                                <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#00d4ff' }}>
                                    DEEP DIVE ACTIVE
                                </span>
                            </div>
                            
                            <h1 style={{ 
                                fontSize: '56px', 
                                fontWeight: '300', 
                                margin: '0 0 12px 0',
                                letterSpacing: '-2px',
                                background: 'linear-gradient(135deg, #e8e6f0 0%, #00d4ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {contentTitles[selectedWorld]?.title || `Artifact 0${selectedWorld}`}
                            </h1>
                            
                            <p style={{ 
                                color: '#a8a4b8', 
                                fontSize: '18px',
                                margin: '0 0 32px 0',
                                lineHeight: 1.6
                            }}>
                                {contentTitles[selectedWorld]?.subtitle || 'Exploring the unknown'}
                            </p>

                            <div style={{
                                display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'
                            }}>
                                <div style={{
                                    background: 'rgba(124, 58, 237, 0.15)',
                                    border: '1px solid rgba(124, 58, 237, 0.3)',
                                    borderRadius: '12px',
                                    padding: '16px 24px',
                                    textAlign: 'left'
                                }}>
                                    <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#6b6880' }}>TEMPLATE</span>
                                    <p style={{ margin: '4px 0 0 0', color: '#e8e6f0', fontSize: '14px' }}>Analogy Mode</p>
                                </div>
                                <div style={{
                                    background: 'rgba(0, 212, 255, 0.15)',
                                    border: '1px solid rgba(0, 212, 255, 0.3)',
                                    borderRadius: '12px',
                                    padding: '16px 24px',
                                    textAlign: 'left'
                                }}>
                                    <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#6b6880' }}>AI NARRATOR</span>
                                    <p style={{ margin: '4px 0 0 0', color: '#e8e6f0', fontSize: '14px' }}>Gemini Live</p>
                                </div>
                            </div>

                            <button
                                onClick={handleBackToExperience}
                                style={{
                                    marginTop: '40px',
                                    background: 'transparent',
                                    border: '1px solid rgba(124, 58, 237, 0.5)',
                                    borderRadius: '30px',
                                    padding: '12px 32px',
                                    color: '#a8a4b8',
                                    fontSize: '13px',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontFamily: '"Space Grotesk", sans-serif'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = '#7c3aed';
                                    e.target.style.color = '#e8e6f0';
                                    e.target.style.background = 'rgba(124, 58, 237, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                                    e.target.style.color = '#a8a4b8';
                                    e.target.style.background = 'transparent';
                                }}
                            >
                                Return to Observatory
                            </button>
                        </div>
                    </Html>
                )}
            </Canvas>

            {appState === 'ENTRY' && (
                <EntryUI 
                    onSubmit={handlePromptSubmit} 
                    isListening={isListening} 
                    setIsListening={setIsListening} 
                />
            )}
            
            {(appState === 'GENERATING' || appState === 'GENERATING_WORLD') && <LoadingUI />}
        </div>
    );
}
