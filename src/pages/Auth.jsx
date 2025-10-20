// Página de autenticación para login/registro de usuarios
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

// Componente de la página de autenticación
const Auth = () => {
  // Obtener función de login del contexto de usuario
  const { isAuthenticated, login } = useUser()
  
  // Estados locales para el formulario
  const [username, setUsername] = useState('') // Nombre de usuario
  const [pin, setPin] = useState('') // PIN de seguridad
  const [error, setError] = useState('') // Mensaje de error

  // Si ya está autenticado, redirigir a la página principal
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault() // Prevenir comportamiento por defecto del formulario
    
    // Validar que ambos campos estén completos
    if (!username.trim() || !pin.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    // Validar que el PIN tenga al menos 4 dígitos
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 dígitos')
      return
    }

    try {
      // Intentar hacer login con los datos proporcionados
      login(username.trim(), pin)
    } catch (err) {
      // Si hay error, mostrar mensaje
      setError('Error al iniciar sesión')
    }
  }

  return (
    <div className="card">
      {/* Título de la página */}
      <h1>🔐 Iniciar Sesión</h1>
      
      {/* Formulario de autenticación */}
      <form onSubmit={handleSubmit}>
        {/* Campo de nombre de usuario */}
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
        
        {/* Campo de PIN */}
        <div className="form-group">
          <label htmlFor="pin">PIN:</label>
          <input
            type="password"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Ingresa tu PIN (mínimo 4 dígitos)"
            required
          />
        </div>
        
        {/* Mostrar mensaje de error si existe */}
        {error && <div className="error">{error}</div>}
        
        {/* Botón de envío del formulario */}
        <button type="submit" className="btn">
          🚀 Crear/Entrar
        </button>
      </form>
      
      {/* Información adicional para el usuario */}
      <div className="auth-info">
        <p>💡 <strong>Nota:</strong> Si es tu primera vez, se creará una nueva cuenta. 
        Si ya tienes una cuenta, se cargará tu mascota existente.</p>
      </div>
    </div>
  )
}

export default Auth