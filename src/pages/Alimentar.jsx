// Página para alimentar la mascota virtual
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'

const Alimentar = () => {
  const { isAuthenticated } = useUser()
  const { pet, feedPet } = usePet()
  const cooldownLeft = useCooldown(pet.cooldowns.feed)

  if (!isAuthenticated) return <Navigate to="/auth" replace />

  const isDisabled = cooldownLeft > 0 || pet.sleeping

  return (
    <div className="card scene-feed">
      <h1>🍎 Alimentar</h1>

      <div className="current-stat">
        <h3>Hambre: {pet.hunger}/100</h3>
        <div className="stats-bar">
          <div className="stats-fill stats-hunger" style={{ width: `${pet.hunger}%` }} />
        </div>
      </div>

      <button
        onClick={feedPet}
        disabled={isDisabled}
        className={`btn ${isDisabled ? 'btn-disabled' : 'btn-success'}`}
      >
        {pet.sleeping ? '😴 Durmiendo' : (cooldownLeft > 0 ? `⏳ ${Math.ceil(cooldownLeft/1000)}s` : 'Alimentar')}
      </button>
    </div>
  )
}

export default Alimentar
