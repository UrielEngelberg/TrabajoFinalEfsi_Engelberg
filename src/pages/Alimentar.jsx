// Página para alimentar la mascota virtual
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'

// Componente de la página de alimentación
const Alimentar = () => {
  // Obtener estado de autenticación del usuario
  const { isAuthenticated } = useUser()
  
  // Obtener función para alimentar y estado de la mascota
  const { pet, feedPet } = usePet()
  
  // Hook para manejar el cooldown de la acción de alimentar
  const cooldownLeft = useCooldown(pet.cooldowns.feed)

  // Si el usuario no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // Función que maneja el clic en el botón de alimentar
  const handleFeed = () => {
    const success = feedPet()
    if (success) {
      // Aquí se podría mostrar una notificación de éxito
      console.log('Mascota alimentada exitosamente')
    }
  }

  // Calcular si el botón debe estar deshabilitado
  const isDisabled = cooldownLeft > 0 || pet.sleeping

  return (
    <div className="card">
      {/* Título de la página */}
      <h1>🍎 Alimentar Mascota</h1>
      
      {/* Información sobre la acción */}
      <div className="action-info">
        <p>Alimentar a tu mascota aumenta su hambre en 20 puntos.</p>
        <p><strong>Cooldown:</strong> 60 segundos</p>
      </div>
      
      {/* Estado actual de hambre */}
      <div className="current-stat">
        <h3>Hambre Actual: {pet.hunger}/100</h3>
        <div className="stats-bar">
          <div 
            className="stats-fill stats-hunger"
            style={{ width: `${pet.hunger}%` }}
          />
        </div>
      </div>
      
      {/* Botón principal de alimentar */}
      <button 
        onClick={handleFeed}
        disabled={isDisabled}
        className={`btn ${isDisabled ? 'btn-disabled' : 'btn-success'}`}
      >
        {pet.sleeping ? '😴 Mascota durmiendo' : '🍎 Alimentar'}
      </button>
      
      {/* Mostrar cooldown si está activo */}
      {cooldownLeft > 0 && (
        <div className="cooldown-timer">
          ⏰ Próxima alimentación en: {Math.ceil(cooldownLeft / 1000)}s
        </div>
      )}
      
      {/* Información adicional */}
      <div className="action-tips">
        <h3>💡 Consejos:</h3>
        <ul>
          <li>Alimenta a tu mascota cuando tenga hambre (menos de 50 puntos)</li>
          <li>No puedes alimentar mientras duerme</li>
          <li>El hambre se degrada automáticamente cada 5 minutos</li>
        </ul>
      </div>
    </div>
  )
}

export default Alimentar