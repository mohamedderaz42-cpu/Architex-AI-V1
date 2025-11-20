
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface RoomViewer3DProps {
  isNightMode: boolean;
  color?: string;
}

const RotatingModel = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
    </mesh>
  );
};

export const RoomViewer3D: React.FC<RoomViewer3DProps> = ({ isNightMode, color = '#8B5CF6' }) => {
  // Adjust lighting based on mode
  const ambientIntensity = isNightMode ? 0.2 : 0.8;
  const pointLightIntensity = isNightMode ? 2 : 0.5;
  const bgColor = isNightMode ? '#0f172a' : '#1e293b';

  return (
    <div className="w-full h-full absolute inset-0 bg-slate-900">
      <Canvas>
        <color attach="background" args={[bgColor]} />
        
        <PerspectiveCamera makeDefault position={[4, 4, 6]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
          autoRotate={false}
        />

        {/* Lighting Environment */}
        <ambientLight intensity={ambientIntensity} />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={pointLightIntensity} 
          color={isNightMode ? "#a78bfa" : "#ffffff"} 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* The Room / Model */}
        <RotatingModel color={color} />

        {/* Floor / Environment */}
        <Grid 
          position={[0, 0, 0]} 
          args={[10, 10]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor={isNightMode ? "#4c1d95" : "#64748b"} 
          sectionSize={3} 
          sectionThickness={1} 
          sectionColor={isNightMode ? "#8b5cf6" : "#94a3b8"} 
          fadeDistance={30} 
        />
        <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={1.5} far={1} />
      </Canvas>
      
      <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 pointer-events-none bg-black/20 px-2 rounded">
        Interactive 3D View
      </div>
    </div>
  );
};
