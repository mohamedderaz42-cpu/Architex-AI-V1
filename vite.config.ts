import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // رفع حد التحذير لملفات الـ 3D الكبيرة
    chunkSizeWarningLimit: 1600,
    
    // تقسيم الكود لتسريع التحميل
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          three_engine: ['three', '@react-three/fiber', '@react-three/drei'],
          ai_engine: ['@google/generative-ai']
        },
      },
    },
  },
});
