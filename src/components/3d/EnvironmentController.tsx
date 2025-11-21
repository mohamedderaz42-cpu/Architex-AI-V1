// @ts-nocheck
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';

interface EnvironmentControllerProps {
    isNightMode: boolean;
}

export const EnvironmentController: React.FC<EnvironmentControllerProps> = ({ isNightMode }) => {
    const sunRef = useRef<THREE.DirectionalLight>(null);

    // Subtle animation for lights if needed
    useFrame((state) => {
        if (sunRef.current) {
            // Simulate slight sun movement or intensity fluctuation
            const time = state.clock.getElapsedTime();
            sunRef.current.position.x = 10 + Math.sin(time * 0.1);
        }
    });

    return (
        <group>
            {isNightMode ? (
                // --- NIGHT MODE ---
                <>
                    <ambientLight intensity={0.1} color="#1e1b4b" /> {/* Deep Blue/Purple Ambient */}
                    
                    {/* Moon Light */}
                    <directionalLight 
                        position={[-5, 10, -5]} 
                        intensity={0.5} 
                        color="#a5f3fc" 
                        castShadow 
                    />

                    {/* City Glow / Rim Light */}
                    <pointLight position={[10, 5, 10]} intensity={1.5} color="#c084fc" distance={20} />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Environment preset="city" background={false} />
                    <fog attach="fog" args={['#0f172a', 5, 30]} />
                </>
            ) : (
                // --- DAY MODE ---
                <>
                    <ambientLight intensity={0.6} color="#fff7ed" /> {/* Warm Ambient */}
                    
                    {/* Sun Light */}
                    <directionalLight 
                        ref={sunRef}
                        position={[10, 15, 10]} 
                        intensity={1.5} 
                        color="#fffbeb" 
                        castShadow 
                        shadow-bias={-0.0005}
                    />
                    
                    {/* Fill Light */}
                    <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#bae6fd" />

                    <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 10, -10]} />
                    <Environment preset="sunset" background={false} />
                    <fog attach="fog" args={['#f0f9ff', 10, 50]} />
                </>
            )}
        </group>
    );
};