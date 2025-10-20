// Página para dormir la mascota virtual
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'

// Componente de la página de dormir
const Dormir = () => {
  // Obtener estado de autenticación del usuario
  const { isAuthenticated } = useUser()
  
  // Obtener funciones y estado de la mascota
  const { pet, putPetToSleep } = usePet()

  // Hook para manejar el cooldown/temporizador de dormir
  const cooldownLeft = useCooldown(pet.cooldowns.sleep)

  // Estado local para mostrar progreso visual mientras duerme
  const [sleepProgress, setSleepProgress] = useState(0)

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // Iniciar dormir
  const handleSleep = () => {
    const success = putPetToSleep()
    if (success) {
      // Reiniciar progreso visual
      setSleepProgress(0)
    }
  }

  // Actualizar barra de progreso cuando está durmiendo
  useEffect(() => {
    if (!pet.sleeping) return

    const totalMs = 30000 // 30s
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, Math.round((elapsed / totalMs) * 100))
      setSleepProgress(progress)
      if (elapsed >= totalMs) {
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [pet.sleeping])

  const isDisabled = cooldownLeft > 0 || pet.sleeping

  return (
    <div className="card">
      {/* Título */}
      <h1>😴 Dormir</h1>

      {/* Información */}
      <div className="action-info">
        <p>Poner a dormir a tu mascota la deja en estado de sueño por 30 segundos.</p>
        <p>Al despertar recupera <strong>+25</strong> de energía.</p>
      </div>

      {/* Estados actuales */}
      <div className="current-stats">
        <div className="stat-item">
          <h4>Energía: {pet.energy}/100</h4>
          <div className="stats-bar">
            <div 
              className="stats-fill stats-energy"
              style={{ width: `${pet.energy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Área de sueño */}
      <div className="sleep-area">
        {pet.sleeping ? (
          <div className="sleeping-status">
            <h3>La mascota está durmiendo...</h3>
            <div className="sleep-progress">
              <div className="sleep-bar" style={{ width: `${sleepProgress}%` }} />
            </div>
            <p>Progreso: {sleepProgress}%</p>
          </div>
        ) : (
          <button 
            onClick={handleSleep}
            disabled={isDisabled}
            className={`btn ${isDisabled ? 'btn-disabled' : 'btn-secondary'}`}
          >
            {cooldownLeft > 0 ? '⏳ En enfriamiento' : '😴 Poner a Dormir'}
          </button>
        )}
      </div>

      {/* Cooldown visible */}
      {cooldownLeft > 0 && (
        <div className="cooldown-timer">
          ⏰ Podrás volver a dormir en: {Math.ceil(cooldownLeft / 1000)}s
        </div>
      )}

      {/* Consejos */}
      <div className="action-tips">
        <h3>💡 Consejos:</h3>
        <ul>
          <li>No puedes iniciar otra acción mientras duerme.</li>
          <li>Dormir es útil cuando la energía es baja.</li>
        </ul>
      </div>
    </div>
  )
}

export default Dormir
