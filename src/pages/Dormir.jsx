// Página para dormir la mascota virtual
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'
import PetSprite from '../components/PetSprite'

// Componente de la página de dormir
const Dormir = () => {
  const { isAuthenticated } = useUser()
  const { pet, putPetToSleep } = usePet()
  const cooldownLeft = useCooldown(pet.cooldowns.sleep)
  const [sleepProgress, setSleepProgress] = useState(0)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  const handleSleep = () => {
    const success = putPetToSleep()
    if (success) setSleepProgress(0)
  }

  useEffect(() => {
    if (!pet.sleeping) return
    const totalMs = 30000
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, Math.round((elapsed / totalMs) * 100))
      setSleepProgress(progress)
      if (elapsed >= totalMs) clearInterval(interval)
    }, 500)
    return () => clearInterval(interval)
  }, [pet.sleeping])

  const isDisabled = cooldownLeft > 0 || pet.sleeping

  return (
    <div className="card scene-sleep">
      <h1>😴 Dormir</h1>

      {/* Cama */}
      <div className="bed-area">
        <div className="bed">
          {/* Sprite posicionado encima de la cama */}
          <div className="bed-sprite">
            <PetSprite />
          </div>
        </div>
      </div>

      <div className="action-info">
        <p>Poner a dormir a tu mascota la deja en estado de sueño por 30 segundos.</p>
        <p>Al despertar recupera <strong>+25</strong> de energía.</p>
      </div>

      <div className="current-stats">
        <div className="stat-item">
          <h4>Energía: {pet.energy}/100</h4>
          <div className="stats-bar">
            <div className="stats-fill stats-energy" style={{ width: `${pet.energy}%` }} />
          </div>
        </div>
      </div>

      {pet.sleeping ? (
        <div className="sleeping-status">
          <h3>La mascota está durmiendo...</h3>
          <div className="sleep-progress">
            <div className="sleep-bar" style={{ width: `${sleepProgress}%` }} />
          </div>
          <p>Progreso: {sleepProgress}%</p>
        </div>
      ) : (
        <button onClick={handleSleep} disabled={isDisabled} className={`btn ${isDisabled ? 'btn-disabled' : 'btn-secondary'}`}>
          {cooldownLeft > 0 ? '⏳ En enfriamiento' : '😴 Poner a Dormir'}
        </button>
      )}

      {cooldownLeft > 0 && (
        <div className="cooldown-timer">⏰ Podrás volver a dormir en: {Math.ceil(cooldownLeft / 1000)}s</div>
      )}
    </div>
  )
}

export default Dormir
