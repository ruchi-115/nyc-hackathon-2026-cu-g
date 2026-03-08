import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';

// Generate mock campaign data based on the user's prompt
const generateCampaignData = (prompt) => ({
    id: 'root',
    name: prompt || 'Your Campaign',
    type: 'root',
    children: [
        {
            id: 'branch-a',
            name: 'Cyberpunk Edge',
            type: 'branch',
            description: 'Bold, neon-soaked visuals with a tech-forward narrative',
            children: [
                { id: 'leaf-a1', name: 'Voiceover Script', type: 'leaf', assetType: 'script', status: 'ready' },
                { id: 'leaf-a2', name: 'Hero Visual', type: 'leaf', assetType: 'image', status: 'ready' },
                { id: 'leaf-a3', name: 'Background Loop', type: 'leaf', assetType: 'video', status: 'ready' }
            ]
        },
        {
            id: 'branch-b',
            name: 'Eco-Minimalist',
            type: 'branch',
            description: 'Clean, sustainable aesthetics with earthy tones',
            children: [
                { id: 'leaf-b1', name: 'Brand Manifesto', type: 'leaf', assetType: 'script', status: 'ready' },
                { id: 'leaf-b2', name: 'Product Shot', type: 'leaf', assetType: 'image', status: 'ready' },
                { id: 'leaf-b3', name: 'Nature Backdrop', type: 'leaf', assetType: 'video', status: 'ready' }
            ]
        },
        {
            id: 'branch-c',
            name: 'High-Fashion Street',
            type: 'branch',
            description: 'Urban luxury with street culture influences',
            children: [
                { id: 'leaf-c1', name: 'Tagline Copy', type: 'leaf', assetType: 'script', status: 'ready' },
                { id: 'leaf-c2', name: 'Lifestyle Image', type: 'leaf', assetType: 'image', status: 'ready' },
                { id: 'leaf-c3', name: 'City Montage', type: 'leaf', assetType: 'video', status: 'ready' }
            ]
        }
    ]
});

// Asset type icons
const AssetIcon = ({ type, size = 16 }) => {
    switch (type) {
        case 'script':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            );
        case 'image':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            );
        case 'video':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
            );
        default:
            return null;
    }
};

// Node detail panel
const NodeDetailPanel = ({ node, onClose, onExplore }) => {
    if (!node) return null;

    const getNodeColor = () => {
        if (node.type === 'root') return '#00d4ff';
        if (node.type === 'branch') return '#7c3aed';
        if (node.assetType === 'video') return '#fbbf24';
        if (node.assetType === 'image') return '#00d4ff';
        return '#a8a4b8';
    };

    return (
        <div style={{
            position: 'absolute',
            right: '32px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '320px',
            background: 'rgba(15, 7, 40, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${getNodeColor()}40`,
            borderRadius: '16px',
            padding: '24px',
            color: '#e8e6f0',
            fontFamily: '"Space Grotesk", sans-serif',
            boxShadow: `0 0 40px ${getNodeColor()}20`,
            zIndex: 100
        }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#6b6880',
                    cursor: 'pointer',
                    padding: '4px'
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `${getNodeColor()}20`,
                    border: `1px solid ${getNodeColor()}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getNodeColor()
                }}>
                    {node.assetType ? <AssetIcon type={node.assetType} size={18} /> : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="3" />
                            <line x1="12" y1="3" x2="12" y2="9" />
                            <line x1="12" y1="15" x2="12" y2="21" />
                        </svg>
                    )}
                </div>
                <div>
                    <span style={{
                        fontSize: '10px',
                        letterSpacing: '1.5px',
                        color: getNodeColor(),
                        textTransform: 'uppercase'
                    }}>
                        {node.type === 'root' ? 'Campaign Root' : node.type === 'branch' ? 'Creative Direction' : node.assetType}
                    </span>
                    <h3 style={{
                        margin: '4px 0 0 0',
                        fontSize: '18px',
                        fontWeight: '400'
                    }}>
                        {node.name}
                    </h3>
                </div>
            </div>

            {node.description && (
                <p style={{
                    color: '#a8a4b8',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    margin: '0 0 20px 0'
                }}>
                    {node.description}
                </p>
            )}

            {node.type === 'leaf' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: 'rgba(0, 212, 255, 0.1)',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#00d4ff',
                        boxShadow: '0 0 8px #00d4ff'
                    }} />
                    <span style={{ fontSize: '12px', color: '#00d4ff' }}>
                        Asset Ready
                    </span>
                </div>
            )}

            <button
                onClick={() => onExplore(node)}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: `linear-gradient(135deg, ${getNodeColor()} 0%, ${node.type === 'branch' ? '#00d4ff' : '#7c3aed'} 100%)`,
                    border: 'none',
                    borderRadius: '8px',
                    color: node.type === 'leaf' && node.assetType === 'video' ? '#030014' : '#fff',
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    fontFamily: '"Space Grotesk", sans-serif',
                    transition: 'all 0.3s ease'
                }}
            >
                {node.type === 'root' ? 'VIEW BRANCHES' : node.type === 'branch' ? 'EXPLORE DIRECTION' : 'OPEN ASSET'}
            </button>
        </div>
    );
};

export default function CampaignTree({ userPrompt, onNodeSelect }) {
    const svgRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedNode, setSelectedNode] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);

    // Handle resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // D3 Tree visualization
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;

        const data = generateCampaignData(userPrompt);
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = dimensions.width;
        const height = dimensions.height;
        const margin = { top: 80, right: 200, bottom: 80, left: 200 };

        // Create hierarchy
        const root = d3.hierarchy(data);
        
        // Tree layout - radial style for more visual interest
        const treeLayout = d3.tree()
            .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
            .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

        treeLayout(root);

        // Create main group with centering
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Gradient definitions
        const defs = svg.append('defs');
        
        const linkGradient = defs.append('linearGradient')
            .attr('id', 'link-gradient')
            .attr('gradientUnits', 'userSpaceOnUse');
        linkGradient.append('stop').attr('offset', '0%').attr('stop-color', '#7c3aed');
        linkGradient.append('stop').attr('offset', '100%').attr('stop-color', '#00d4ff');

        // Glow filter
        const glow = defs.append('filter')
            .attr('id', 'glow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');
        glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
        const glowMerge = glow.append('feMerge');
        glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
        glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Draw links with animated paths
        const links = g.selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x))
            .attr('fill', 'none')
            .attr('stroke', 'url(#link-gradient)')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.5)
            .attr('stroke-dasharray', function() { return this.getTotalLength(); })
            .attr('stroke-dashoffset', function() { return this.getTotalLength(); });

        // Animate links
        links.transition()
            .duration(1500)
            .ease(d3.easeCubicOut)
            .attr('stroke-dashoffset', 0);

        // Draw nodes
        const nodes = g.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y}, ${d.x})`)
            .style('cursor', 'pointer')
            .style('opacity', 0);

        // Animate nodes appearance
        nodes.transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .style('opacity', 1);

        // Node circles
        nodes.append('circle')
            .attr('r', d => {
                if (d.data.type === 'root') return 30;
                if (d.data.type === 'branch') return 20;
                return 12;
            })
            .attr('fill', d => {
                if (d.data.type === 'root') return '#0f0728';
                if (d.data.type === 'branch') return '#1a0a3e';
                return '#0f0728';
            })
            .attr('stroke', d => {
                if (d.data.type === 'root') return '#00d4ff';
                if (d.data.type === 'branch') return '#7c3aed';
                if (d.data.assetType === 'video') return '#fbbf24';
                if (d.data.assetType === 'image') return '#00d4ff';
                return '#a8a4b8';
            })
            .attr('stroke-width', 2)
            .attr('filter', 'url(#glow)');

        // Inner glow circles
        nodes.filter(d => d.data.type !== 'leaf')
            .append('circle')
            .attr('r', d => d.data.type === 'root' ? 20 : 12)
            .attr('fill', d => d.data.type === 'root' ? '#00d4ff' : '#7c3aed')
            .attr('opacity', 0.2);

        // Pulse animation for root
        nodes.filter(d => d.data.type === 'root')
            .append('circle')
            .attr('r', 30)
            .attr('fill', 'none')
            .attr('stroke', '#00d4ff')
            .attr('stroke-width', 1)
            .attr('opacity', 0)
            .each(function() {
                const pulse = d3.select(this);
                function repeat() {
                    pulse
                        .attr('r', 30)
                        .attr('opacity', 0.8)
                        .transition()
                        .duration(2000)
                        .ease(d3.easeLinear)
                        .attr('r', 50)
                        .attr('opacity', 0)
                        .on('end', repeat);
                }
                repeat();
            });

        // Node labels
        nodes.append('text')
            .attr('dy', d => {
                if (d.data.type === 'root') return 50;
                if (d.data.type === 'branch') return 35;
                return 25;
            })
            .attr('text-anchor', 'middle')
            .attr('fill', '#e8e6f0')
            .attr('font-family', '"Space Grotesk", sans-serif')
            .attr('font-size', d => {
                if (d.data.type === 'root') return '14px';
                if (d.data.type === 'branch') return '12px';
                return '10px';
            })
            .attr('font-weight', d => d.data.type === 'root' ? '500' : '400')
            .text(d => d.data.name);

        // Type labels for branches
        nodes.filter(d => d.data.type === 'branch')
            .append('text')
            .attr('dy', -30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#7c3aed')
            .attr('font-family', '"Space Grotesk", sans-serif')
            .attr('font-size', '9px')
            .attr('letter-spacing', '1px')
            .text('DIRECTION');

        // Asset type indicators for leaves
        nodes.filter(d => d.data.type === 'leaf')
            .append('text')
            .attr('dy', -20)
            .attr('text-anchor', 'middle')
            .attr('fill', d => {
                if (d.data.assetType === 'video') return '#fbbf24';
                if (d.data.assetType === 'image') return '#00d4ff';
                return '#a8a4b8';
            })
            .attr('font-family', '"Space Grotesk", sans-serif')
            .attr('font-size', '8px')
            .attr('letter-spacing', '1px')
            .attr('text-transform', 'uppercase')
            .text(d => d.data.assetType?.toUpperCase());

        // Interaction handlers
        nodes
            .on('mouseenter', function(event, d) {
                setHoveredNode(d.data);
                d3.select(this).select('circle')
                    .transition()
                    .duration(200)
                    .attr('r', d.data.type === 'root' ? 35 : d.data.type === 'branch' ? 24 : 15)
                    .attr('stroke-width', 3);
            })
            .on('mouseleave', function(event, d) {
                setHoveredNode(null);
                d3.select(this).select('circle')
                    .transition()
                    .duration(200)
                    .attr('r', d.data.type === 'root' ? 30 : d.data.type === 'branch' ? 20 : 12)
                    .attr('stroke-width', 2);
            })
            .on('click', function(event, d) {
                setSelectedNode(d.data);
            });

    }, [dimensions, userPrompt]);

    const handleExplore = useCallback((node) => {
        if (onNodeSelect) {
            onNodeSelect(node);
        }
    }, [onNodeSelect]);

    return (
        <div 
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'transparent',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <div style={{
                position: 'absolute',
                top: '24px',
                left: '32px',
                right: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 50,
                pointerEvents: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
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
                        fontFamily: '"Space Grotesk", sans-serif',
                        textTransform: 'uppercase'
                    }}>
                        Campaign Tree
                    </span>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    padding: '8px 16px',
                    background: 'rgba(0, 212, 255, 0.1)',
                    borderRadius: '20px',
                    border: '1px solid rgba(0, 212, 255, 0.3)'
                }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#00d4ff',
                        boxShadow: '0 0 8px #00d4ff'
                    }} />
                    <span style={{
                        color: '#00d4ff',
                        fontSize: '11px',
                        letterSpacing: '1px',
                        fontFamily: '"Space Grotesk", sans-serif'
                    }}>
                        3 DIRECTIONS GENERATED
                    </span>
                </div>
            </div>

            {/* Campaign title */}
            <div style={{
                position: 'absolute',
                bottom: '32px',
                left: '32px',
                zIndex: 50
            }}>
                <span style={{
                    color: '#6b6880',
                    fontSize: '11px',
                    letterSpacing: '2px',
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: 'uppercase'
                }}>
                    ROOT CONCEPT
                </span>
                <h2 style={{
                    color: '#e8e6f0',
                    fontSize: '24px',
                    fontWeight: '300',
                    margin: '8px 0 0 0',
                    fontFamily: '"Space Grotesk", sans-serif',
                    maxWidth: '400px'
                }}>
                    {userPrompt || 'Your Campaign'}
                </h2>
            </div>

            {/* Instructions */}
            <div style={{
                position: 'absolute',
                bottom: '32px',
                right: selectedNode ? '380px' : '32px',
                transition: 'right 0.3s ease',
                zIndex: 50,
                textAlign: 'right'
            }}>
                <p style={{
                    color: '#6b6880',
                    fontSize: '12px',
                    margin: 0,
                    fontFamily: '"Space Grotesk", sans-serif'
                }}>
                    Click any node to explore
                </p>
            </div>

            {/* SVG Canvas */}
            <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            />

            {/* Node Detail Panel */}
            <NodeDetailPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onExplore={handleExplore}
            />
        </div>
    );
}
