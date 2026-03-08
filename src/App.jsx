import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Stars } from '@react-three/drei';
import BreathingOrb from './BreathingOrb';
import EntryUI from './EntryUI';
import ParticleTransition from './ParticleTransition';
import LoadingUI from './LoadingUI';
import MainExperience from './MainExperience';
import LandingPage from './LandingPage';

// Background stars component for the campaign tree view
function BackgroundStars() {
    return (
        <>
            <Stars radius={150} depth={100} count={5000} factor={4} saturation={0} fade speed={0.3} />
            <ambientLight intensity={0.2} />
            <pointLight position={[-10, 10, 10]} intensity={1} color="#7c3aed" />
            <pointLight position={[10, -10, -10]} intensity={0.5} color="#00d4ff" />
        </>
    );
}

export default function App() {
    const [appState, setAppState] = useState('LANDING');
    const [isListening, setIsListening] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [userPrompt, setUserPrompt] = useState('');

    const handleEnterApp = () => {
        setAppState('ENTRY');
    };

    const handlePromptSubmit = (prompt) => {
        setUserPrompt(prompt);
        setAppState('GENERATING');
    };

    const handleLoadingComplete = () => {
        setAppState('EXPERIENCE');
    };

    const handleNodeSelect = (node) => {
        setSelectedNode(node);
        setAppState('GENERATING_ASSET');
    };

    const handleAssetLoadingComplete = () => {
        setAppState('ASSET_VIEW');
    };

    const handleBackToTree = () => {
        setAppState('EXPERIENCE');
        setSelectedNode(null);
    };

    return (
        <div style={{ 
            width: '100vw', 
            height: '100vh', 
            background: 'linear-gradient(180deg, #030014 0%, #0f0728 50%, #030014 100%)', 
            overflow: 'hidden' 
        }}>
            {/* Three.js Canvas for backgrounds */}
            <Canvas 
                camera={{ position: [0, 0, 5], fov: 45 }} 
                dpr={[1, 2]}
            >
                {appState === 'LANDING' && <BackgroundStars />}
                {appState === 'ENTRY' && <BreathingOrb isListening={isListening} />}
                {appState === 'GENERATING' && <ParticleTransition onComplete={handleLoadingComplete} />}
                {appState === 'GENERATING_ASSET' && <ParticleTransition onComplete={handleAssetLoadingComplete} />}
                {appState === 'ASSET_VIEW' && <BackgroundStars />}
                
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
                                Loading experience...
                            </div>
                        </Html>
                    }>
                        <MainExperience onNodeSelect={handleNodeSelect} />
                    </Suspense>
                )}
            </Canvas>

            {/* Asset View */}
            {appState === 'ASSET_VIEW' && selectedNode && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                    fontFamily: '"Space Grotesk", sans-serif'
                }}>
                    {/* Header */}
                    <div style={{
                        position: 'absolute',
                        top: '24px',
                        left: '32px',
                        right: '32px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <button
                            onClick={handleBackToTree}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(124, 58, 237, 0.1)',
                                border: '1px solid rgba(124, 58, 237, 0.3)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                color: '#a8a4b8',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontFamily: '"Space Grotesk", sans-serif',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back to Experience
                        </button>
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            padding: '8px 16px',
                            background: selectedNode.type === 'video' ? 'rgba(251, 191, 36, 0.1)' : selectedNode.type === 'audio' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(0, 212, 255, 0.1)',
                            borderRadius: '20px',
                            border: `1px solid ${selectedNode.type === 'video' ? 'rgba(251, 191, 36, 0.3)' : selectedNode.type === 'audio' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(0, 212, 255, 0.3)'}`
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: selectedNode.type === 'video' ? '#fbbf24' : selectedNode.type === 'audio' ? '#a855f7' : '#00d4ff',
                                boxShadow: `0 0 8px ${selectedNode.type === 'video' ? '#fbbf24' : selectedNode.type === 'audio' ? '#a855f7' : '#00d4ff'}`
                            }} />
                            <span style={{
                                color: selectedNode.type === 'video' ? '#fbbf24' : selectedNode.type === 'audio' ? '#a855f7' : '#00d4ff',
                                fontSize: '11px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                {selectedNode.type}
                            </span>
                        </div>
                    </div>

                    {/* Asset Preview */}
                    <div style={{
                        width: '80%',
                        maxWidth: selectedNode.type === 'audio' ? '500px' : '800px',
                        aspectRatio: selectedNode.type === 'audio' ? '1/1' : '16/9',
                        background: 'rgba(15, 7, 40, 0.8)',
                        border: `1px solid ${selectedNode.type === 'video' ? 'rgba(251, 191, 36, 0.3)' : selectedNode.type === 'audio' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(0, 212, 255, 0.3)'}`,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '32px',
                        boxShadow: `0 0 60px ${selectedNode.type === 'video' ? 'rgba(251, 191, 36, 0.1)' : selectedNode.type === 'audio' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(0, 212, 255, 0.1)'}`
                    }}>
                        <div style={{ textAlign: 'center', color: '#6b6880' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: `${selectedNode.type === 'video' ? '#fbbf24' : selectedNode.type === 'audio' ? '#a855f7' : '#00d4ff'}15`,
                                border: `1px solid ${selectedNode.type === 'video' ? '#fbbf24' : selectedNode.type === 'audio' ? '#a855f7' : '#00d4ff'}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                color: selectedNode.type === 'video' ? '#fbbf24' : selectedNode.type === 'audio' ? '#a855f7' : '#00d4ff',
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    {selectedNode.type === 'video' ? (
                                        <>
                                            <polygon points="23 7 16 12 23 17 23 7" />
                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                        </>
                                    ) : selectedNode.type === 'image' ? (
                                        <>
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </>
                                    ) : (
                                        <>
                                            <path d="M9 18V5l12-2v13" />
                                            <circle cx="6" cy="18" r="3" />
                                            <circle cx="18" cy="16" r="3" />
                                        </>
                                    )}
                                </svg>
                            </div>
                            <p style={{ fontSize: '14px', color: '#a8a4b8' }}>
                                AI-Generated {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} Preview
                            </p>
                        </div>
                    </div>

                    {/* Asset Info */}
                    <div style={{ textAlign: 'center', maxWidth: '500px', padding: '0 20px' }}>
                        <h1 style={{
                            color: '#e8e6f0',
                            fontSize: 'clamp(24px, 4vw, 32px)',
                            fontWeight: '300',
                            margin: '0 0 8px 0',
                            letterSpacing: '-1px'
                        }}>
                            {selectedNode.name}
                        </h1>
                        <p style={{
                            color: '#6b6880',
                            fontSize: '14px',
                            margin: '0 0 8px 0',
                            lineHeight: 1.5
                        }}>
                            {selectedNode.description}
                        </p>
                        <p style={{
                            color: '#4a4660',
                            fontSize: '12px',
                            margin: '0 0 32px 0',
                        }}>
                            Generated for "{userPrompt}"
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                style={{
                                    padding: '12px 24px',
                                    background: `linear-gradient(135deg, ${selectedNode.type === 'video' ? '#fbbf24' : selectedNode.type === 'audio' ? '#a855f7' : '#00d4ff'} 0%, #7c3aed 100%)`,
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    fontFamily: '"Space Grotesk", sans-serif'
                                }}
                            >
                                {selectedNode.type === 'audio' ? 'Play Audio' : selectedNode.type === 'video' ? 'Play Video' : 'View Full Size'}
                            </button>
                            <button
                                style={{
                                    padding: '12px 24px',
                                    background: 'transparent',
                                    border: '1px solid rgba(124, 58, 237, 0.5)',
                                    borderRadius: '8px',
                                    color: '#a8a4b8',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    fontFamily: '"Space Grotesk", sans-serif'
                                }}
                            >
                                Regenerate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Landing Page */}
            {appState === 'LANDING' && <LandingPage onEnter={handleEnterApp} />}

            {/* Entry UI */}
            {appState === 'ENTRY' && (
                <EntryUI 
                    onSubmit={handlePromptSubmit} 
                    isListening={isListening} 
                    setIsListening={setIsListening} 
                />
            )}
            
            {/* Loading UI */}
            {(appState === 'GENERATING' || appState === 'GENERATING_ASSET') && <LoadingUI />}
        </div>
    );
}
