import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleTransition({ onComplete }) {
    const pointsRef = useRef();
    const secondaryPointsRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    // Primary cosmic particles - cyan/white
    const glowTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const context = canvas.getContext('2d');

        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.15, 'rgba(0, 212, 255, 0.9)');
        gradient.addColorStop(0.4, 'rgba(124, 58, 237, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }, []);

    // Secondary purple particles
    const purpleGlowTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const context = canvas.getContext('2d');

        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(124, 58, 237, 1)');
        gradient.addColorStop(0.3, 'rgba(124, 58, 237, 0.6)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }, []);

    const particleCount = 25000;
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const radius = Math.random() * 0.15;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }
        return positions;
    }, []);

    const secondaryCount = 8000;
    const secondaryPositions = useMemo(() => {
        const positions = new Float32Array(secondaryCount * 3);
        for (let i = 0; i < secondaryCount; i++) {
            const radius = Math.random() * 0.25;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }
        return positions;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.6;
            pointsRef.current.rotation.z = time * 0.25;
            const scale = 1 + Math.pow(time * 2.2, 3);
            pointsRef.current.scale.set(scale, scale, scale);
        }
        if (secondaryPointsRef.current) {
            secondaryPointsRef.current.rotation.y = -time * 0.4;
            secondaryPointsRef.current.rotation.x = time * 0.15;
            const scale = 1 + Math.pow(time * 2.0, 3);
            secondaryPointsRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group>
            {/* Primary particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particlesPosition.length / 3}
                        array={particlesPosition}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.18}
                    map={glowTexture}
                    transparent={true}
                    opacity={1}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation={true}
                />
            </points>

            {/* Secondary purple particles */}
            <points ref={secondaryPointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={secondaryPositions.length / 3}
                        array={secondaryPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.25}
                    map={purpleGlowTexture}
                    transparent={true}
                    opacity={0.8}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation={true}
                />
            </points>
        </group>
    );
}
