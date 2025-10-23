// Página principal que muestra el estado general de la mascota virtual
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useInventory } from '../contexts/InventoryContext'
import { useCooldown } from '../hooks/usePetTick'
import PetSprite from '../components/PetSprite'
import PetStats from '../components/PetStats'

// Componente de la página de inicio
const Home = () => {
  const { isAuthenticated } = useUser()
  const { pet, feedPet, playWithPet, putPetToSleep, resetPet, isDead, isSick, giveMedicine } = usePet()
  const { inventory, useItem, getItemEffects } = useInventory()

  // Cooldowns visibles
  const feedLeft = useCooldown(pet.cooldowns.feed)
  const playLeft = useCooldown(pet.cooldowns.play)
  const sleepLeft = useCooldown(pet.cooldowns.sleep)
  const medLeft = useCooldown(pet.cooldowns.med)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // Función para encontrar la comida más barata disponible
  const findCheapestFood = () => {
    const foodItems = Object.keys(inventory).filter(item => {
      const effects = getItemEffects(item)
      return effects && inventory[item] > 0
    })
    
    if (foodItems.length === 0) return null
    
    // Ordenar por precio (más barato primero)
    return foodItems.reduce((cheapest, current) => {
      const currentPrice = getItemEffects(current).price
      const cheapestPrice = getItemEffects(cheapest).price
      return currentPrice < cheapestPrice ? current : cheapest
    })
  }

  const handleQuickFeed = () => {
    if (isDead) {
      alert('No puedes alimentar a una mascota muerta. Usa "Revivir Mascota" primero.')
      return
    }
    
    if (pet.sleeping) {
      alert('No puedes alimentar a una mascota que está durmiendo.')
      return
    }
    
    const cheapestFood = findCheapestFood()
    if (!cheapestFood) {
      alert('No tienes comida en tu inventario. ¡Ve a la tienda para comprar más!')
      return
    }
    
    if (!useItem(cheapestFood, 1)) {
      alert('No tienes este alimento en tu inventario.')
      return
    }
    
    const effects = getItemEffects(cheapestFood)
    if (feedPet(effects)) {
      // Mostrar mensaje de éxito
      const message = `¡${effects.emoji} ${effects.name} usado! Efectos aplicados.`
      // Crear un elemento temporal para mostrar el mensaje
      const tempDiv = document.createElement('div')
      tempDiv.className = 'quick-feed-message'
      tempDiv.textContent = message
      tempDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 184, 148, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: fadeInOut 3s ease-in-out;
      `
      document.body.appendChild(tempDiv)
      setTimeout(() => document.body.removeChild(tempDiv), 3000)
    } else {
      alert('No puedes alimentar ahora. Espera un momento.')
    }
  }
  
  const handleQuickPlay = () => { playWithPet() }
  const handleQuickSleep = () => { putPetToSleep() }
  const handleReset = () => { resetPet() }
  const handleMedicine = () => { giveMedicine() }

  const hasFood = findCheapestFood() !== null
  const feedDisabled = feedLeft > 0 || pet.sleeping || !hasFood
  const playDisabled = playLeft > 0 || pet.sleeping
  const sleepDisabled = sleepLeft > 0 || pet.sleeping
  const medDisabled = medLeft > 0

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
                {pet.sleeping ? '😴 Durmiendo' : !hasFood ? '🍎 Sin comida' : '🍎 Alimentar'}
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

              {isSick && (
                <>
                  <button onClick={handleMedicine} disabled={medDisabled} className={`btn ${medDisabled ? 'btn-disabled' : 'btn-secondary'}`}>
                    💊 Dar Remedio
                  </button>
                  {medLeft > 0 && (
                    <div className="cooldown-timer">⏰ {Math.ceil(medLeft / 1000)}s</div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home