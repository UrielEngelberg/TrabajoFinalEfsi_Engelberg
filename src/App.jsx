// Componente principal de la aplicación que configura el routing y los providers
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { PetProvider } from './contexts/PetContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Alimentar from './pages/Alimentar'
import Jugar from './pages/Jugar'
import Dormir from './pages/Dormir'

// Componente principal que envuelve toda la aplicación
function App() {
  return (
    // Provider de usuario para manejar autenticación globalmente
    <UserProvider>
      {/* Provider de mascota para manejar el estado de la mascota globalmente */}
      <PetProvider>
        {/* Router para manejar la navegación entre páginas */}
        <Router>
          {/* Layout común que envuelve todas las páginas */}
          <Layout>
            {/* Definición de rutas de la aplicación */}
            <Routes>
              {/* Ruta principal - página de inicio con estado de la mascota */}
              <Route path="/" element={<Home />} />
              {/* Ruta de autenticación - login/registro */}
              <Route path="/auth" element={<Auth />} />
              {/* Ruta para alimentar la mascota */}
              <Route path="/alimentar" element={<Alimentar />} />
              {/* Ruta para jugar con la mascota */}
              <Route path="/jugar" element={<Jugar />} />
              {/* Ruta para dormir la mascota */}
              <Route path="/dormir" element={<Dormir />} />
            </Routes>
          </Layout>
        </Router>
      </PetProvider>
    </UserProvider>
  )
}

export default App