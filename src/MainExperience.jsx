import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Html, Text, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Placeholder images for generated content - these would come from AI
const generatedContent = {
    images: [
        { id: 1, title: 'Event Horizon Visualization', desc: 'The boundary where light cannot escape', type: 'image' },
        { id: 2, title: 'Spacetime Curvature', desc: 'Mass bending the fabric of reality', type: 'image' },
        { id: 3, title: 'Hawking Radiation', desc: 'Particles escaping the void', type: 'image' },
    ],
    video: { id: 4, title: 'Gravitational Lensing', desc: 'Light bending around massive objects', type: 'video' }
};

// Cosmic dust particles that float around the scene
function CosmicDust({ count = 500 }) {
    const points = useRef();
    
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
        return pos;
    }, [count]);

    useFrame(({ clock }) => {
        if (points.current) {
            points.current.rotation.y = clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.08} color="#7c3aed" transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
        </points>
    );
}

// Holographic frame around content displays
function HolographicFrame({ width, height, color = '#00d4ff' }) {
    return (
        <group>
            {/* Corner accents */}
            {[[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([x, y], i) => (
                <mesh key={i} position={[x * width / 2 * 0.95, y * height / 2 * 0.95, 0.01]}>
                    <planeGeometry args={[0.3, 0.3]} />
                    <meshBasicMaterial color={color} transparent opacity={0.8} />
                </mesh>
            ))}
            {/* Frame lines */}
            <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
                <lineBasicMaterial color={color} transparent opacity={0.4} />
            </lineSegments>
        </group>
    );
}

// 3D Display Panel for images
function ImageDisplayPanel({ data, position, rotation = [0, 0, 0], onSelect }) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();
    const glowRef = useRef();

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5 + data.id) * 0.15;
        }
        if (glowRef.current) {
            glowRef.current.material.opacity = hovered ? 0.3 : 0.1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
                <group
                    ref={meshRef}
                    onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                    onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
                    onClick={(e) => { e.stopPropagation(); onSelect(data.id); }}
                >
                    {/* Glow backdrop */}
                    <mesh ref={glowRef} position={[0, 0, -0.1]}>
                        <planeGeometry args={[7, 5]} />
                        <meshBasicMaterial color="#7c3aed" transparent opacity={0.1} />
                    </mesh>

                    {/* Main display surface - cosmic visualization placeholder */}
                    <mesh>
                        <planeGeometry args={[6, 4]} />
                        <meshStandardMaterial
                            color={hovered ? '#1a0a3e' : '#0f0728'}
                            emissive={hovered ? '#00d4ff' : '#7c3aed'}
                            emissiveIntensity={hovered ? 0.3 : 0.1}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* Holographic frame */}
                    <HolographicFrame width={6.2} height={4.2} color={hovered ? '#00d4ff' : '#7c3aed'} />

                    {/* Content type indicator */}
                    <mesh position={[-2.5, 1.6, 0.02]}>
                        <planeGeometry args={[0.8, 0.3]} />
                        <meshBasicMaterial color={data.type === 'video' ? '#fbbf24' : '#00d4ff'} />
                    </mesh>
                    <Text position={[-2.5, 1.6, 0.03]} fontSize={0.12} color="#030014" anchorX="center">
                        {data.type === 'video' ? 'VEO' : 'NANO'}
                    </Text>

                    {/* Scan lines effect */}
                    {[...Array(8)].map((_, i) => (
                        <mesh key={i} position={[0, -1.8 + i * 0.5, 0.01]}>
                            <planeGeometry args={[5.8, 0.01]} />
                            <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
                        </mesh>
                    ))}

                    {/* Node indicator */}
                    <Text position={[0, -2.5, 0]} fontSize={0.2} color={hovered ? '#00d4ff' : '#6b6880'} letterSpacing={0.15}>
                        {hovered ? 'INITIALIZE DEEP DIVE' : `ARTIFACT 0${data.id}`}
                    </Text>
                </group>
            </Float>

            {/* Info panel */}
            <Html position={[4.5, 0, 0]} transform distanceFactor={10}>
                <div style={{
                    background: hovered ? 'rgba(15, 7, 40, 0.95)' : 'rgba(3, 0, 20, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${hovered ? '#00d4ff' : 'rgba(124, 58, 237, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '24px',
                    width: '280px',
                    color: '#e8e6f0',
                    fontFamily: '"Space Grotesk", sans-serif',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    boxShadow: hovered ? '0 0 30px rgba(0, 212, 255, 0.2)' : 'none'
                }}
                onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
                onClick={() => onSelect(data.id)}
                >
                    <div style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderBottom: '1px solid rgba(124, 58, 237, 0.3)', 
                        paddingBottom: '12px', marginBottom: '16px' 
                    }}>
                        <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#6b6880', textTransform: 'uppercase' }}>
                            {data.type === 'video' ? 'Video Generation' : 'Image Generation'}
                        </span>
                        <span style={{ 
                            fontSize: '10px', letterSpacing: '2px', 
                            color: '#00d4ff',
                            display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                            <span style={{ 
                                width: '6px', height: '6px', borderRadius: '50%', 
                                background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' 
                            }} />
                            READY
                        </span>
                    </div>
                    <h3 style={{ 
                        fontSize: '18px', fontWeight: '400', color: '#e8e6f0', 
                        margin: '0 0 8px 0', letterSpacing: '-0.5px' 
                    }}>
                        {data.title}
                    </h3>
                    <p style={{ 
                        fontSize: '13px', color: '#a8a4b8', margin: 0, lineHeight: 1.5 
                    }}>
                        {data.desc}
                    </p>
                </div>
            </Html>
        </group>
    );
}

// Video display panel (larger, central focus)
function VideoDisplayPanel({ data, position, onSelect }) {
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef();
    const ringRef = useRef();

    useFrame(({ clock }) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <group position={position}>
            <group
                ref={groupRef}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
                onClick={(e) => { e.stopPropagation(); onSelect(data.id); }}
            >
                {/* Rotating ring */}
                <mesh ref={ringRef} position={[0, 0, -0.2]}>
                    <torusGeometry args={[5, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#00d4ff" transparent opacity={hovered ? 0.6 : 0.3} />
                </mesh>

                {/* Video display */}
                <mesh>
                    <planeGeometry args={[8, 4.5]} />
                    <meshStandardMaterial
                        color="#0f0728"
                        emissive={hovered ? '#fbbf24' : '#7c3aed'}
                        emissiveIntensity={hovered ? 0.4 : 0.15}
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>

                {/* Play button overlay */}
                <mesh position={[0, 0, 0.05]}>
                    <circleGeometry args={[0.8, 32]} />
                    <meshBasicMaterial color={hovered ? '#fbbf24' : '#00d4ff'} transparent opacity={hovered ? 0.9 : 0.6} />
                </mesh>
                <mesh position={[0.15, 0, 0.06]}>
                    <coneGeometry args={[0.4, 0.6, 3]} rotation={[0, 0, -Math.PI / 2]} />
                    <meshBasicMaterial color="#030014" />
                </mesh>

                <HolographicFrame width={8.3} height={4.8} color={hovered ? '#fbbf24' : '#00d4ff'} />

                {/* VEO badge */}
                <mesh position={[-3.5, 1.9, 0.02]}>
                    <planeGeometry args={[1, 0.35]} />
                    <meshBasicMaterial color="#fbbf24" />
                </mesh>
                <Text position={[-3.5, 1.9, 0.03]} fontSize={0.15} color="#030014" anchorX="center">
                    VEO VIDEO
                </Text>

                <Text position={[0, -3, 0]} fontSize={0.25} color={hovered ? '#fbbf24' : '#6b6880'} letterSpacing={0.1}>
                    {hovered ? 'PLAY VISUALIZATION' : 'PRIMARY SIMULATION'}
                </Text>
            </group>

            {/* Info card */}
            <Html position={[0, -4.5, 0]} transform distanceFactor={10}>
                <div style={{
                    background: 'rgba(15, 7, 40, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${hovered ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '20px 32px',
                    textAlign: 'center',
                    color: '#e8e6f0',
                    fontFamily: '"Space Grotesk", sans-serif',
                    transition: 'all 0.4s ease'
                }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '400', margin: '0 0 8px 0' }}>{data.title}</h3>
                    <p style={{ fontSize: '13px', color: '#a8a4b8', margin: 0 }}>{data.desc}</p>
                </div>
            </Html>
        </group>
    );
}

// Nebula background effect
function NebulaBackground() {
    const meshRef = useRef();

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.z = clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -100]}>
            <sphereGeometry args={[80, 32, 32]} />
            <MeshDistortMaterial
                color="#1a0a3e"
                emissive="#0f0728"
                emissiveIntensity={0.5}
                distort={0.2}
                speed={0.5}
                transparent
                opacity={0.3}
                side={THREE.BackSide}
            />
        </mesh>
    );
}

// Main scroll scene
function ScrollScene({ onNodeSelect }) {
    const scroll = useScroll();
    const { camera } = useThree();

    useFrame((state) => {
        const currentZ = THREE.MathUtils.lerp(15, -160, scroll.offset);
        state.camera.position.z = currentZ;
        state.camera.position.y = Math.sin(scroll.offset * Math.PI) * 2;
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 1, 0.05);
        state.camera.lookAt(0, 0, currentZ - 40);
    });

    return (
        <group>
            {/* Deep space background */}
            <Stars radius={150} depth={100} count={8000} factor={4} saturation={0.2} fade speed={0.3} />
            <CosmicDust count={800} />
            <NebulaBackground />

            {/* Cosmic fog */}
            <fog attach="fog" args={['#030014', 30, 100]} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} color="#e8e6f0" />
            <pointLight position={[-15, 5, -30]} intensity={3} color="#7c3aed" />
            <pointLight position={[15, -5, -60]} intensity={2} color="#00d4ff" />
            <pointLight position={[0, 0, -100]} intensity={4} color="#fbbf24" />

            {/* Welcome zone */}
            <group position={[0, 0, 0]}>
                <Text position={[0, 2, 0]} fontSize={0.8} color="#e8e6f0" letterSpacing={0.05} textAlign="center">
                    GEDANKEN ENGINE
                </Text>
                <Text position={[0, 1, 0]} fontSize={0.25} color="#6b6880" letterSpacing={0.2}>
                    SCROLL TO EXPLORE THE COSMOS
                </Text>
                <mesh position={[0, -0.5, 0]}>
                    <planeGeometry args={[4, 0.003]} />
                    <meshBasicMaterial color="#7c3aed" transparent opacity={0.5} />
                </mesh>
            </group>

            {/* Image displays in staggered positions */}
            <ImageDisplayPanel 
                data={generatedContent.images[0]} 
                position={[-6, 0, -25]} 
                rotation={[0, 0.2, 0]}
                onSelect={onNodeSelect} 
            />
            <ImageDisplayPanel 
                data={generatedContent.images[1]} 
                position={[6, 1, -55]} 
                rotation={[0, -0.2, 0]}
                onSelect={onNodeSelect} 
            />
            <ImageDisplayPanel 
                data={generatedContent.images[2]} 
                position={[-5, -0.5, -85]} 
                rotation={[0, 0.15, 0]}
                onSelect={onNodeSelect} 
            />

            {/* Main video display */}
            <VideoDisplayPanel 
                data={generatedContent.video} 
                position={[0, 0, -120]} 
                onSelect={onNodeSelect} 
            />

            {/* End zone */}
            <group position={[0, 0, -150]}>
                <Text position={[0, 0, 0]} fontSize={0.5} color="#00d4ff" letterSpacing={0.1}>
                    EXPLORE DEEPER
                </Text>
                <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#7c3aed" transparent opacity={0.5} />
                </mesh>
            </group>
        </group>
    );
}

export default function MainExperience({ onNodeSelect }) {
    return (
        <ScrollControls pages={6} damping={0.15}>
            <ScrollScene onNodeSelect={onNodeSelect} />
        </ScrollControls>
    );
}
