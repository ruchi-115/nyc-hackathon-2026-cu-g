import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Orbiting rings component for cosmic effect
function CosmicRings({ isListening }) {
    const ringsRef = useRef();
    
    useFrame(({ clock }) => {
        if (ringsRef.current) {
            ringsRef.current.rotation.x = clock.getElapsedTime() * 0.2;
            ringsRef.current.rotation.z = clock.getElapsedTime() * 0.15;
            const targetScale = isListening ? 0 : 1;
            ringsRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <group ref={ringsRef}>
            {/* Inner ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.2, 0.01, 16, 100]} />
                <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
            </mesh>
            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
                <torusGeometry args={[1.5, 0.008, 16, 100]} />
                <meshBasicMaterial color="#7c3aed" transparent opacity={0.4} />
            </mesh>
            {/* Third ring */}
            <mesh rotation={[Math.PI / 3, -0.2, 0.5]}>
                <torusGeometry args={[1.8, 0.005, 16, 100]} />
                <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
            </mesh>
        </group>
    );
}

// Floating particles around the orb
function OrbParticles({ isListening }) {
    const particlesRef = useRef();
    const count = 200;
    
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const radius = 2 + Math.random() * 1.5;
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame(({ clock }) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
            const targetScale = isListening ? 0 : 1;
            particlesRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#00d4ff"
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function BreathingOrb({ isListening }) {
    const sphereRef = useRef();
    const glowRef = useRef();

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (sphereRef.current) {
            sphereRef.current.rotation.y = elapsedTime * 0.15;
            sphereRef.current.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

            const targetScale = isListening ? 0 : 1;
            sphereRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
        if (glowRef.current) {
            const targetScale = isListening ? 0 : 1.2;
            glowRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <group>
            {/* Deep space background stars */}
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
            
            {/* Ambient cosmic lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[2, 5, 2]} intensity={1.5} color="#e8e6f0" />
            <pointLight position={[-3, -2, 2]} intensity={3} color="#7c3aed" />
            <pointLight position={[3, 2, -2]} intensity={2} color="#00d4ff" />

            {/* Outer glow sphere */}
            <Sphere ref={glowRef} args={[1, 32, 32]} position={[0, 0, 0]}>
                <meshBasicMaterial 
                    color="#7c3aed" 
                    transparent 
                    opacity={0.1} 
                />
            </Sphere>

            {/* Main cosmic orb - styled as a miniature neutron star */}
            <Sphere ref={sphereRef} args={[0.8, 128, 128]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                    color="#1a0a3e"
                    emissive="#00d4ff"
                    emissiveIntensity={0.4}
                    roughness={0.3}
                    metalness={0.8}
                    distort={0.25}
                    speed={1.2}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </Sphere>

            {/* Cosmic rings */}
            <CosmicRings isListening={isListening} />
            
            {/* Floating particles */}
            <OrbParticles isListening={isListening} />
        </group>
    );
}
