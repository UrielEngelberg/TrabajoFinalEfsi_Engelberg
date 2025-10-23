// Componente Layout que proporciona la estructura común de todas las páginas
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

// Componente que envuelve todas las páginas con navegación común
const Layout = ({ children }) => {
  // Obtener datos del usuario desde el contexto
  const { isAuthenticated, user, logout } = useUser()
  
  // Obtener la ruta actual para posibles estilos activos
  const location = useLocation()

  return (
    <div>
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-links">
            {/* Mostrar diferentes opciones según el estado de autenticación */}
            {isAuthenticated ? (
              <>
                {/* Enlaces de navegación para usuarios autenticados */}
                <Link to="/">🏠 Inicio</Link>
                <Link to="/alimentar">🍎 Alimentar</Link>
                <Link to="/jugar">🎮 Jugar</Link>
                <Link to="/dormir">😴 Dormir</Link>
                <Link to="/tienda">🛒 Tienda</Link>
                
                {/* Mostrar nombre de usuario actual con estilo consistente */}
                <span className="user-info">👤 {user?.username}</span>
                
                {/* Botón para cerrar sesión */}
                <button onClick={logout} className="btn btn-secondary">
                  Salir
                </button>
              </>
            ) : (
              /* Solo mostrar enlace de login si no está autenticado */
              <Link to="/auth">🔐 Iniciar Sesión</Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* Contenido principal de la página */}
      <main className="container">
        {children}
      </main>
    </div>
  )
}

export default Layout