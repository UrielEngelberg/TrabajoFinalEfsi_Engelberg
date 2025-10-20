// Configuración de Vite para el proyecto de mascota virtual
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración principal de Vite
export default defineConfig({
  // Plugins utilizados en el proyecto
  plugins: [react()], // Plugin de React para JSX y hot reload
  
  // Configuración para GitHub Pages
  base: '/mascota-virtual/', // Ruta base para el deploy en GitHub Pages
  
  // Configuración de build
  build: {
    outDir: 'dist' // Directorio donde se generarán los archivos de producción
  }
})