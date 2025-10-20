// Página principal que muestra el estado general de la mascota virtual
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'
import PetSprite from '../components/PetSprite'
import PetStats from '../components/PetStats'

// Componente de la página de inicio
const Home = () => {
  const { isAuthenticated } = useUser()
  const { pet, feedPet, playWithPet, putPetToSleep, resetPet } = usePet()

  // Cooldowns visibles
  const feedLeft = useCooldown(pet.cooldowns.feed)
  const playLeft = useCooldown(pet.cooldowns.play)
  const sleepLeft = useCooldown(pet.cooldowns.sleep)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  const handleQuickFeed = () => {
    feedPet()
  }

  const handleQuickPlay = () => {
    playWithPet()
  }

  const handleQuickSleep = () => {
    putPetToSleep()
  }

  const handleReset = () => {
    resetPet()
  }

  const feedDisabled = feedLeft > 0 || pet.sleeping
  const playDisabled = playLeft > 0 || pet.sleeping
  const sleepDisabled = sleepLeft > 0 || pet.sleeping

  // Verificar si la mascota está muerta
  const isDead = pet.hunger <= 0 || pet.energy <= 0 || pet.happiness <= 0

  return (
    <div className="card">
      <h1>🏠 Mi Mascota Virtual</h1>

      <PetSprite />
      <PetStats />

      <div className="actions-summary">
        <h3>Estado Actual:</h3>
        <p>
          {pet.hunger <= 0 && "💀 Tu mascota ha muerto de hambre! "}
          {pet.energy <= 0 && "💀 Tu mascota ha muerto de cansancio! "}
          {pet.happiness <= 0 && "💀 Tu mascota ha muerto de tristeza! "}
          {pet.hunger <= 10 && pet.hunger > 0 && "🤒 Tu mascota está enferma de hambre! "}
          {pet.energy <= 10 && pet.energy > 0 && "🤒 Tu mascota está enferma de cansancio! "}
          {pet.happiness <= 10 && pet.happiness > 0 && "🤒 Tu mascota está enferma de tristeza! "}
          {pet.hunger < 20 && pet.hunger > 10 && "🍎 Tu mascota tiene hambre! "}
          {pet.energy < 20 && pet.energy > 10 && "😴 Tu mascota está cansada! "}
          {pet.happiness < 20 && pet.happiness > 10 && "😢 Tu mascota está triste! "}
          {pet.hunger >= 20 && pet.energy >= 20 && pet.happiness >= 20 && "😊 Tu mascota está feliz!"}
        </p>
      </div>

      {/* Acciones rápidas que ejecutan directamente las acciones */}
      <div className="quick-actions">
        <h3>Acciones Rápidas:</h3>
        <div className="action-buttons">
          {isDead ? (
            <button onClick={handleReset} className="btn btn-warning">
              💀 Revivir Mascota
            </button>
          ) : (
            <>
              <button onClick={handleQuickFeed} disabled={feedDisabled} className={`btn ${feedDisabled ? 'btn-disabled' : 'btn-success'}`}>
                {pet.sleeping ? '😴 Durmiendo' : '🍎 Alimentar'}
              </button>
              {feedLeft > 0 && (
                <div className="cooldown-timer">⏰ {Math.ceil(feedLeft / 1000)}s</div>
              )}

              <button onClick={handleQuickPlay} disabled={playDisabled} className={`btn ${playDisabled ? 'btn-disabled' : 'btn-warning'}`}>
                {pet.sleeping ? '😴 Durmiendo' : '🎮 Jugar'}
              </button>
              {playLeft > 0 && (
                <div className="cooldown-timer">⏰ {Math.ceil(playLeft / 1000)}s</div>
              )}

              <button onClick={handleQuickSleep} disabled={sleepDisabled} className={`btn ${sleepDisabled ? 'btn-disabled' : 'btn-secondary'}`}>
                {pet.sleeping ? '😴 Durmiendo...' : '😴 Dormir'}
              </button>
              {sleepLeft > 0 && (
                <div className="cooldown-timer">⏰ {Math.ceil(sleepLeft / 1000)}s</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home