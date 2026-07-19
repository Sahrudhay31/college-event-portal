'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// A single abstract geometric shape with rotation logic
function FloatingShape({ position, color, geometryType }: { position: [number, number, number], color: string, geometryType: 'icosahedron' | 'torus' | 'octahedron' }) {
    const meshRef = useRef<THREE.Mesh>(null);
    
    // Rotate slowly
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    // Pick geometry based on type
    const geometry = useMemo(() => {
        switch (geometryType) {
            case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
            case 'torus': return <torusKnotGeometry args={[0.8, 0.25, 100, 16]} />;
            case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
        }
    }, [geometryType]);

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2} position={position}>
            <mesh ref={meshRef}>
                {geometry}
                <meshStandardMaterial 
                    color={color} 
                    roughness={0.1}
                    metalness={0.8}
                    envMapIntensity={1.5}
                />
            </mesh>
        </Float>
    );
}

// Group that reacts to mouse movement
function InteractiveScene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Smoothly interpolate group rotation towards mouse position
        const targetX = (state.pointer.x * Math.PI) / 10;
        const targetY = (state.pointer.y * Math.PI) / 10;
        
        groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    });

    return (
        <group ref={groupRef}>
            <FloatingShape position={[-3, 1, -2]} color="#4F46E5" geometryType="icosahedron" />
            <FloatingShape position={[3, -1, -3]} color="#9333EA" geometryType="torus" />
            <FloatingShape position={[0, 2, -5]} color="#2563EB" geometryType="octahedron" />
            <FloatingShape position={[-4, -2, -6]} color="#06B6D4" geometryType="icosahedron" />
            <FloatingShape position={[4, 2, -4]} color="#EC4899" geometryType="octahedron" />
        </group>
    );
}

export default function InteractiveBackground() {
    return (
        <div className="fixed inset-0 w-full h-full -z-10 bg-slate-950">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <color attach="background" args={['#020617']} />
                
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#4F46E5" />
                
                {/* Scene */}
                <InteractiveScene />
                
                {/* Environment & Effects */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="city" />
                <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} />
            </Canvas>
        </div>
    );
}
