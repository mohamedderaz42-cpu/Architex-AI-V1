import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // رفع حد التحذير
    chunkSizeWarningLimit: 1600,
    
    // إعدادات التقسيم الآمنة
    rollupOptions: {
      output: {
        manualChunks: {
          // تقسيم مكتبات React الأساسية
          vendor: ['react', 'react-dom', 'framer-motion'],
          // تقسيم محرك الـ 3D فقط (لأنه الأكبر حجماً)
          three_engine: ['three', '@react-three/fiber', '@react-three/drei']
        },
      },
    },
  },
});
