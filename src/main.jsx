// Punto de entrada principal de la aplicación React
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// Crear el punto de montaje de React en el elemento #root del HTML
const root = ReactDOM.createRoot(document.getElementById('root'))

// Renderizar la aplicación principal con React.StrictMode
// StrictMode ayuda a detectar problemas potenciales durante el desarrollo
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)