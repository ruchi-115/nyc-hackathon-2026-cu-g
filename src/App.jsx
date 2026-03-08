import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Stars } from '@react-three/drei';
import BreathingOrb from './BreathingOrb';
import EntryUI from './EntryUI';
import ParticleTransition from './ParticleTransition';
import LoadingUI from './LoadingUI';
import CampaignTree from './CampaignTree';

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
    const [appState, setAppState] = useState('ENTRY');
    const [isListening, setIsListening] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [userPrompt, setUserPrompt] = useState('');

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
                style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1
                }}
            >
                {appState === 'ENTRY' && <BreathingOrb isListening={isListening} />}
                {appState === 'GENERATING' && <ParticleTransition onComplete={handleLoadingComplete} />}
                {appState === 'GENERATING_ASSET' && <ParticleTransition onComplete={handleAssetLoadingComplete} />}
                {(appState === 'EXPERIENCE' || appState === 'ASSET_VIEW') && <BackgroundStars />}
            </Canvas>

            {/* Campaign Tree Overlay */}
            {appState === 'EXPERIENCE' && (
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <CampaignTree 
                        userPrompt={userPrompt} 
                        onNodeSelect={handleNodeSelect}
                    />
                </div>
            )}

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
                            Back to Tree
                        </button>
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            padding: '8px 16px',
                            background: selectedNode.assetType === 'video' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(0, 212, 255, 0.1)',
                            borderRadius: '20px',
                            border: `1px solid ${selectedNode.assetType === 'video' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(0, 212, 255, 0.3)'}`
                        }}>
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: selectedNode.assetType === 'video' ? '#fbbf24' : '#00d4ff',
                                boxShadow: `0 0 8px ${selectedNode.assetType === 'video' ? '#fbbf24' : '#00d4ff'}`
                            }} />
                            <span style={{
                                color: selectedNode.assetType === 'video' ? '#fbbf24' : '#00d4ff',
                                fontSize: '11px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                {selectedNode.assetType || selectedNode.type}
                            </span>
                        </div>
                    </div>

                    {/* Asset Preview */}
                    <div style={{
                        width: '80%',
                        maxWidth: '800px',
                        aspectRatio: '16/9',
                        background: 'rgba(15, 7, 40, 0.8)',
                        border: `1px solid ${selectedNode.assetType === 'video' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '32px',
                        boxShadow: `0 0 60px ${selectedNode.assetType === 'video' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(124, 58, 237, 0.1)'}`
                    }}>
                        <div style={{ textAlign: 'center', color: '#6b6880' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                {selectedNode.assetType === 'video' ? (
                                    <>
                                        <polygon points="23 7 16 12 23 17 23 7" />
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                    </>
                                ) : selectedNode.assetType === 'image' ? (
                                    <>
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </>
                                ) : (
                                    <>
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </>
                                )}
                            </svg>
                            <p style={{ marginTop: '16px', fontSize: '14px' }}>
                                AI-Generated {selectedNode.assetType || 'Asset'} Preview
                            </p>
                        </div>
                    </div>

                    {/* Asset Info */}
                    <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                        <h1 style={{
                            color: '#e8e6f0',
                            fontSize: '32px',
                            fontWeight: '300',
                            margin: '0 0 12px 0',
                            letterSpacing: '-1px'
                        }}>
                            {selectedNode.name}
                        </h1>
                        <p style={{
                            color: '#6b6880',
                            fontSize: '14px',
                            margin: '0 0 32px 0',
                            lineHeight: 1.6
                        }}>
                            Generated for the "{userPrompt}" campaign
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center'
                        }}>
                            <button
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    fontFamily: '"Space Grotesk", sans-serif'
                                }}
                            >
                                Download Asset
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
