
// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, ContactShadows, useThree } from '@react-three/drei';
import * as THREE from 'three';
import { EnvironmentController } from './3d/EnvironmentController';
import { ShareService } from '../core/social/ShareService';
import { ShareIcon } from './icons/ShareIcon';
import { SunMoonIcon } from './icons/SunMoonIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { useToast } from './Toast';

interface RoomViewer3DProps {
  isNightMode: boolean;
  color?: string;
  onToggleNightMode?: () => void;
  projectName?: string;
  projectId?: string;
}

const RotatingModel = ({ color, isNightMode }: { color: string; isNightMode: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.1} 
          emissive={isNightMode ? color : '#000000'}
          emissiveIntensity={isNightMode ? 0.8 : 0}
        />
      </mesh>
      {/* Interior light simulation for the object itself in night mode */}
      {isNightMode && (
         <pointLight position={[0, 1, 0]} intensity={3} distance={6} color={color} />
      )}
    </group>
  );
};

// Helper component to access the gl context for sharing
const CaptureManager = ({ onCaptureRef }: { onCaptureRef: (gl: HTMLCanvasElement) => void }) => {
    const { gl } = useThree();
    useEffect(() => {
        onCaptureRef(gl.domElement);
    }, [gl, onCaptureRef]);
    return null;
};

export const RoomViewer3D: React.FC<RoomViewer3DProps> = ({ isNightMode: initialNightMode, color = '#8B5CF6', onToggleNightMode, projectId = 'draft', projectName = 'My Design' }) => {
  const [localNightMode, setLocalNightMode] = useState(initialNightMode);
  const [isSharing, setIsSharing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { addToast } = useToast();

  // Sync internal state if prop changes, but allow local toggle
  useEffect(() => {
      setLocalNightMode(initialNightMode);
  }, [initialNightMode]);

  const handleToggle = () => {
      setLocalNightMode(!localNightMode);
      if (onToggleNightMode) onToggleNightMode();
  };

  const handleShare = async () => {
      if (!canvasRef.current) return;
      setIsSharing(true);
      
      // Force a render frame to ensure latest state is captured
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = await ShareService.captureAndShare(
          canvasRef.current, 
          { id: projectId, name: projectName } as any
      );
      
      addToast(result.message, result.success ? 'success' : 'error');
      setIsSharing(false);
  };

  // Cinematic background color logic
  const bgColor = localNightMode ? '#0f172a' : '#f0f9ff';

  return (
    <div className="w-full h-full absolute inset-0 group">
      {/* 3D Scene */}
      <Canvas 
        shadows 
        gl={{ preserveDrawingBuffer: true, antialias: true }} 
        dpr={[1, 2]} // Optimize for retina screens
      >
        <color attach="background" args={[bgColor]} />
        
        <PerspectiveCamera makeDefault position={[6, 5, 8]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={0.2} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
          autoRotate={!isSharing} // Pause rotation when sharing to avoid blur
          autoRotateSpeed={0.5}
          dampingFactor={0.05}
        />

        <EnvironmentController isNightMode={localNightMode} />

        <RotatingModel color={color} isNightMode={localNightMode} />

        <Grid 
          position={[0, 0, 0]} 
          args={[20, 20]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor={localNightMode ? "#334155" : "#cbd5e1"} 
          sectionSize={2.5} 
          sectionThickness={1} 
          sectionColor={localNightMode ? "#475569" : "#94a3b8"} 
          fadeDistance={20} 
        />
        
        <ContactShadows 
            position={[0, 0.01, 0]} 
            opacity={localNightMode ? 0.3 : 0.6} 
            scale={15} 
            blur={2.5} 
            far={1.5} 
            color="#000000"
        />

        <CaptureManager onCaptureRef={(el) => canvasRef.current = el} />
      </Canvas>
      
      {/* UI Overlay - Floating Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-3">
          {/* Share FAB */}
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-ai-violet hover:scale-110 transition-all shadow-lg"
            title="Share Snapshot"
          >
            {isSharing ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <ShareIcon className="w-5 h-5" />}
          </button>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
          {/* Day/Night Toggle FAB */}
          <button 
            onClick={handleToggle}
            className={`px-4 py-2 rounded-full flex items-center space-x-2 backdrop-blur-md border transition-all shadow-lg ${localNightMode ? 'bg-indigo-900/60 border-indigo-500/50 text-indigo-100' : 'bg-amber-100/60 border-amber-400/50 text-amber-900'}`}
          >
            <SunMoonIcon className="w-5 h-5" />
            <span className="text-xs font-bold">{localNightMode ? 'Night' : 'Day'}</span>
          </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/5 font-mono text-[10px] text-white/50">
            ARCHITEX ENGINE v2.5
        </div>
      </div>
    </div>
  );
};
