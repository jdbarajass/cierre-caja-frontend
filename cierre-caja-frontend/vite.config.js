import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Alias para imports más limpios
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@services': resolve(__dirname, './src/services'),
      '@contexts': resolve(__dirname, './src/contexts'),
    },
  },

  // Optimizaciones de build
  build: {
    // Tamaño de chunk warning
    chunkSizeWarningLimit: 600,

    // Minificación
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.log en producción
        drop_debugger: true,
      },
    },

    // Code splitting optimizado
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y React-DOM en su propio chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separar lucide-react
          'icons': ['lucide-react'],
          // Separar utils
          'utils': ['yup'],
        },
      },
    },

    // Source maps solo en desarrollo
    sourcemap: false,
  },

  // Optimizaciones del servidor de desarrollo
  server: {
    port: 5173,
    open: true,
  },

  // Pre-bundling de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'yup'],
  },
})
