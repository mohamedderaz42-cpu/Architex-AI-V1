
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface RoomViewer3DProps {
  isNightMode: boolean;
  color?: string;
}

const RotatingModel = ({ color, isNightMode }: { color: string; isNightMode: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.6} 
          emissive={isNightMode ? color : '#000000'}
          emissiveIntensity={isNightMode ? 0.5 : 0}
        />
      </mesh>
      {/* Interior light simulation */}
      {isNightMode && (
         <pointLight position={[0, 1, 0]} intensity={2} distance={5} color={color} />
      )}
    </group>
  );
};

export const RoomViewer3D: React.FC<RoomViewer3DProps> = ({ isNightMode, color = '#8B5CF6' }) => {
  // Cinematic Lighting Configuration
  const bgColor = isNightMode ? '#020617' : '#e2e8f0';
  const fogColor = isNightMode ? '#020617' : '#e2e8f0';
  
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas shadows>
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[fogColor, 5, 25]} />
        
        <PerspectiveCamera makeDefault position={[5, 4, 7]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={0.5} 
          maxPolarAngle={Math.PI / 2 - 0.05} 
          autoRotate={false}
          dampingFactor={0.05}
        />

        {/* Dynamic Environment */}
        <ambientLight intensity={isNightMode ? 0.2 : 0.7} />
        
        {/* Sun / Moon Light */}
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={isNightMode ? 0.5 : 1.5} 
          castShadow 
          shadow-bias={-0.0001}
          color={isNightMode ? "#8b5cf6" : "#fff7ed"}
        />
        
        {/* Rim Light for Cinema feel */}
        <spotLight position={[-5, 5, -5]} intensity={isNightMode ? 2 : 0.5} color={isNightMode ? "#00ffff" : "#ffffff"} />

        <RotatingModel color={color} isNightMode={isNightMode} />

        <Grid 
          position={[0, 0, 0]} 
          args={[20, 20]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor={isNightMode ? "#334155" : "#cbd5e1"} 
          sectionSize={2.5} 
          sectionThickness={1} 
          sectionColor={isNightMode ? "#64748b" : "#94a3b8"} 
          fadeDistance={20} 
        />
        
        <ContactShadows 
            position={[0, 0.01, 0]} 
            opacity={isNightMode ? 0.4 : 0.6} 
            scale={15} 
            blur={2} 
            far={1.5} 
            color="#000000"
        />
      </Canvas>
      
      <div className="absolute bottom-3 left-3 text-[10px] text-white/50 pointer-events-none bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/5 font-mono">
        RENDER ENGINE: ACTIVE
      </div>
    </div>
  );
};
