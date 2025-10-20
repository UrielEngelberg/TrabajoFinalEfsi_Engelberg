// Página para alimentar la mascota virtual
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'

// Componente de la página de alimentación
const Alimentar = () => {
  const { isAuthenticated } = useUser()
  const { pet, feedPet } = usePet()
  const cooldownLeft = useCooldown(pet.cooldowns.feed)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  const handleFeed = () => {
    const success = feedPet()
    if (success) {
      console.log('Mascota alimentada exitosamente')
    }
  }

  const isDisabled = cooldownLeft > 0 || pet.sleeping

  return (
    <div className="card scene-feed">
      <h1>🍎 Alimentar Mascota</h1>
      
      <div className="action-info">
        <p>Alimentar a tu mascota aumenta su hambre en 20 puntos.</p>
        <p><strong>Cooldown:</strong> 60 segundos</p>
      </div>
      
      <div className="current-stat">
        <h3>Hambre Actual: {pet.hunger}/100</h3>
        <div className="stats-bar">
          <div 
            className="stats-fill stats-hunger"
            style={{ width: `${pet.hunger}%` }}
          />
        </div>
      </div>
      
      <button 
        onClick={handleFeed}
        disabled={isDisabled}
        className={`btn ${isDisabled ? 'btn-disabled' : 'btn-success'}`}
      >
        {pet.sleeping ? '😴 Mascota durmiendo' : '🍎 Alimentar'}
      </button>
      
      {cooldownLeft > 0 && (
        <div className="cooldown-timer">
          ⏰ Próxima alimentación en: {Math.ceil(cooldownLeft / 1000)}s
        </div>
      )}
      
      <div className="action-tips">
        <h3>💡 Consejos:</h3>
        <ul>
          <li>Alimenta a tu mascota cuando tenga hambre (menos de 50 puntos)</li>
          <li>No puedes alimentar mientras duerme</li>
          <li>El hambre se degrada automáticamente cada 2 minutos</li>
        </ul>
      </div>
    </div>
  )
}

export default Alimentar