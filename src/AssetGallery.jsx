import { useState } from 'react';

// Asset data structure - 3 images, 3 audio, 1 video
const generateAssets = (prompt) => [
    { id: 1, type: 'image', name: 'Visual Concept A', description: 'Primary illustration generated from your prompt' },
    { id: 2, type: 'image', name: 'Visual Concept B', description: 'Alternative perspective visualization' },
    { id: 3, type: 'image', name: 'Visual Concept C', description: 'Abstract representation of the concept' },
    { id: 4, type: 'audio', name: 'Narration Track', description: 'AI-generated voice explaining the concept' },
    { id: 5, type: 'audio', name: 'Ambient Soundscape', description: 'Atmospheric audio backdrop' },
    { id: 6, type: 'audio', name: 'Musical Score', description: 'Generative music composition' },
    { id: 7, type: 'video', name: 'Cinematic Visualization', description: 'Full motion video bringing the concept to life' },
];

// Icon components
const ImageIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const AudioIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
    </svg>
);

const VideoIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);

const PlayIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

// Asset card component
function AssetCard({ asset, onClick, isLarge = false }) {
    const [isHovered, setIsHovered] = useState(false);

    const getTypeColor = () => {
        switch (asset.type) {
            case 'image': return '#00d4ff';
            case 'audio': return '#a855f7';
            case 'video': return '#fbbf24';
            default: return '#6b6880';
        }
    };

    const getIcon = () => {
        switch (asset.type) {
            case 'image': return <ImageIcon size={isLarge ? 32 : 20} />;
            case 'audio': return <AudioIcon size={isLarge ? 32 : 20} />;
            case 'video': return <VideoIcon size={isLarge ? 32 : 20} />;
            default: return null;
        }
    };

    const color = getTypeColor();

    return (
        <div
            onClick={() => onClick(asset)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                background: isHovered ? 'rgba(15, 7, 40, 0.95)' : 'rgba(15, 7, 40, 0.7)',
                border: `1px solid ${isHovered ? color : 'rgba(124, 58, 237, 0.2)'}`,
                borderRadius: '16px',
                padding: isLarge ? '32px' : '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                minHeight: isLarge ? '240px' : '160px',
                boxShadow: isHovered ? `0 0 40px ${color}20` : 'none',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            }}
        >
            {/* Type badge */}
            <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: `${color}15`,
                border: `1px solid ${color}30`,
                borderRadius: '12px',
            }}>
                <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                }} />
                <span style={{
                    fontSize: '10px',
                    letterSpacing: '1px',
                    color: color,
                    textTransform: 'uppercase',
                    fontWeight: '500',
                }}>
                    {asset.type}
                </span>
            </div>

            {/* Icon container */}
            <div style={{
                width: isLarge ? '80px' : '56px',
                height: isLarge ? '80px' : '56px',
                borderRadius: '50%',
                background: `${color}10`,
                border: `1px solid ${color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}>
                {asset.type === 'video' && isHovered ? (
                    <PlayIcon size={isLarge ? 28 : 20} />
                ) : (
                    getIcon()
                )}
            </div>

            {/* Asset name */}
            <div style={{ textAlign: 'center' }}>
                <h3 style={{
                    color: '#e8e6f0',
                    fontSize: isLarge ? '16px' : '13px',
                    fontWeight: '400',
                    margin: 0,
                    letterSpacing: '-0.3px',
                }}>
                    {asset.name}
                </h3>
                {isLarge && (
                    <p style={{
                        color: '#6b6880',
                        fontSize: '12px',
                        margin: '8px 0 0 0',
                        lineHeight: 1.4,
                    }}>
                        {asset.description}
                    </p>
                )}
            </div>

            {/* Hover indicator */}
            {isHovered && (
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    color: color,
                    fontSize: '10px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                }}>
                    View
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>
            )}
        </div>
    );
}

export default function AssetGallery({ userPrompt, onAssetSelect }) {
    const assets = generateAssets(userPrompt);
    const images = assets.filter(a => a.type === 'image');
    const audios = assets.filter(a => a.type === 'audio');
    const video = assets.find(a => a.type === 'video');

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'auto',
            fontFamily: '"Space Grotesk", sans-serif',
        }}>
            {/* Header */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(180deg, rgba(3, 0, 20, 0.95) 0%, rgba(3, 0, 20, 0) 100%)',
                zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <line x1="12" y1="3" x2="12" y2="9" />
                            <line x1="12" y1="15" x2="12" y2="21" />
                            <line x1="3" y1="12" x2="9" y2="12" />
                            <line x1="15" y1="12" x2="21" y2="12" />
                        </svg>
                    </div>
                    <span style={{
                        color: '#e8e6f0',
                        fontSize: '14px',
                        fontWeight: '500',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                    }}>
                        Gedanken Engine
                    </span>
                </div>
                <div style={{
                    padding: '8px 16px',
                    background: 'rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#00d4ff',
                        boxShadow: '0 0 8px #00d4ff',
                    }} />
                    <span style={{ color: '#00d4ff', fontSize: '11px', letterSpacing: '1px' }}>
                        7 ASSETS READY
                    </span>
                </div>
            </div>

            {/* Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '100px 32px 60px',
            }}>
                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <p style={{
                        color: '#7c3aed',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        margin: '0 0 12px 0',
                    }}>
                        Generated Experience
                    </p>
                    <h1 style={{
                        color: '#e8e6f0',
                        fontSize: 'clamp(24px, 4vw, 36px)',
                        fontWeight: '300',
                        margin: '0 0 8px 0',
                        letterSpacing: '-1px',
                    }}>
                        {userPrompt || 'Your Concept'}
                    </h1>
                    <p style={{
                        color: '#6b6880',
                        fontSize: '14px',
                        margin: 0,
                    }}>
                        Click any asset to explore in detail
                    </p>
                </div>

                {/* Video - Featured */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                    }}>
                        <div style={{
                            width: '4px',
                            height: '16px',
                            background: '#fbbf24',
                            borderRadius: '2px',
                        }} />
                        <span style={{
                            color: '#a8a4b8',
                            fontSize: '12px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}>
                            Featured Video
                        </span>
                    </div>
                    <AssetCard asset={video} onClick={onAssetSelect} isLarge={true} />
                </div>

                {/* Images Grid */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                    }}>
                        <div style={{
                            width: '4px',
                            height: '16px',
                            background: '#00d4ff',
                            borderRadius: '2px',
                        }} />
                        <span style={{
                            color: '#a8a4b8',
                            fontSize: '12px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}>
                            Visual Concepts
                        </span>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px',
                    }}>
                        {images.map(asset => (
                            <AssetCard key={asset.id} asset={asset} onClick={onAssetSelect} />
                        ))}
                    </div>
                </div>

                {/* Audio Grid */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                    }}>
                        <div style={{
                            width: '4px',
                            height: '16px',
                            background: '#a855f7',
                            borderRadius: '2px',
                        }} />
                        <span style={{
                            color: '#a8a4b8',
                            fontSize: '12px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}>
                            Audio Tracks
                        </span>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px',
                    }}>
                        {audios.map(asset => (
                            <AssetCard key={asset.id} asset={asset} onClick={onAssetSelect} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
