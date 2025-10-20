// Página principal que muestra el estado general de la mascota virtual
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import PetSprite from '../components/PetSprite'
import PetStats from '../components/PetStats'

// Componente de la página de inicio
const Home = () => {
  // Obtener estado de autenticación del usuario
  const { isAuthenticated } = useUser()
  
  // Obtener estado de la mascota
  const { pet } = usePet()

  // Si el usuario no está autenticado, redirigir a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="card">
      {/* Título de la página */}
      <h1>🏠 Mi Mascota Virtual</h1>
      
      {/* Componente que muestra el sprite animado de la mascota */}
      <PetSprite />
      
      {/* Componente que muestra las barras de estadísticas */}
      <PetStats />
      
      {/* Sección que muestra el estado actual de la mascota */}
      <div className="actions-summary">
        <h3>Estado Actual:</h3>
        <p>
          {/* Mostrar mensajes según el estado crítico de cada stat */}
          {pet.hunger < 20 && "🍎 Tu mascota tiene hambre! "}
          {pet.energy < 20 && "😴 Tu mascota está cansada! "}
          {pet.happiness < 20 && "😢 Tu mascota está triste! "}
          {/* Si todos los stats están bien, mostrar mensaje positivo */}
          {pet.hunger >= 20 && pet.energy >= 20 && pet.happiness >= 20 && "😊 Tu mascota está feliz!"}
        </p>
      </div>
      
      {/* Sección con botones de acceso rápido a las acciones */}
      <div className="quick-actions">
        <h3>Acciones Rápidas:</h3>
        <div className="action-buttons">
          {/* Enlaces a las diferentes páginas de acciones */}
          <a href="/alimentar" className="btn btn-success">🍎 Alimentar</a>
          <a href="/jugar" className="btn btn-warning">🎮 Jugar</a>
          <a href="/dormir" className="btn btn-secondary">😴 Dormir</a>
        </div>
      </div>
    </div>
  )
}

export default Home