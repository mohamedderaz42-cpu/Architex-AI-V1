import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    root: '.',
    publicDir: 'public',
    build: {
      outDir: 'dist',
    },
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
    define: {
      // This ensures process.env.API_KEY is replaced by the actual string value during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});