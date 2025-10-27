// Página para alimentar la mascota virtual
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useInventory } from '../contexts/InventoryContext'
import { useCooldown } from '../hooks/usePetTick'

const Alimentar = () => {
  const { isAuthenticated } = useUser()
  const { pet, isDead, feedPet } = usePet()
  const { inventory, useItem, getItemEffects } = useInventory()
  const [message, setMessage] = useState('')

  if (!isAuthenticated) return <Navigate to="/auth" replace />

  // Obtener solo comida del inventario
  const foodItems = Object.keys(inventory).filter(item => {
    const effects = getItemEffects(item)
    return effects && inventory[item] > 0
  })

  const handleFeed = (itemKey) => {
    if (isDead || pet.sleeping) {
      setMessage('No puedes alimentar a una mascota muerta o durmiendo.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (!useItem(itemKey, 1)) {
      setMessage('No tienes este alimento en tu inventario.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const effects = getItemEffects(itemKey)
    if (feedPet(effects)) {
      setMessage(`¡${effects.emoji} ${effects.name} alimentado! Efectos aplicados.`)
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('No puedes alimentar ahora. Espera un momento.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const getEffectText = (itemKey) => {
    const effects = getItemEffects(itemKey)
    const effectTexts = []
    if (effects.hunger > 0) effectTexts.push(`🍽️ +${effects.hunger} Hambre`)
    if (effects.happiness > 0) effectTexts.push(`😊 +${effects.happiness} Felicidad`)
    if (effects.energy > 0) effectTexts.push(`⚡ +${effects.energy} Energía`)
    if (effects.hunger < 0) effectTexts.push(`🍽️ ${effects.hunger} Hambre`)
    if (effects.energy < 0) effectTexts.push(`⚡ ${effects.energy} Energía`)
    return effectTexts.join(', ')
  }

  return (
    <div className="card scene-feed">
      <h1>🍎 Cocina</h1>

      <div className="current-stats">
        <div className="stat-item">
          <h4>Hambre: {pet.hunger}/100</h4>
          <div className="stats-bar">
            <div className="stats-fill stats-hunger" style={{ width: `${pet.hunger}%` }} />
          </div>
        </div>
        <div className="stat-item">
          <h4>Felicidad: {pet.happiness}/100</h4>
          <div className="stats-bar">
            <div className="stats-fill stats-happiness" style={{ width: `${pet.happiness}%` }} />
          </div>
        </div>
        <div className="stat-item">
          <h4>Energía: {pet.energy}/100</h4>
          <div className="stats-bar">
            <div className="stats-fill stats-energy" style={{ width: `${pet.energy}%` }} />
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('No puedes') || message.includes('No tienes') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="food-inventory">
        <h3>🍽️ Tu Inventario de Comida</h3>
        {foodItems.length === 0 ? (
          <div className="empty-inventory">
            <p>No tienes comida en tu inventario.</p>
            <p>¡Ve a la tienda para comprar más comida!</p>
          </div>
        ) : (
          <div className="food-grid">
            {foodItems.map(itemKey => {
              const effects = getItemEffects(itemKey)
              const quantity = inventory[itemKey]
              return (
                <div key={itemKey} className="food-item">
                  <div className="food-info">
                    <div className="food-header">
                      <span className="food-emoji">{effects.emoji}</span>
                      <h4>{effects.name}</h4>
                      <span className="food-quantity">x{quantity}</span>
                    </div>
                    <p className="food-effects">{getEffectText(itemKey)}</p>
                  </div>
                  <button 
                    className={`btn ${isDead || pet.sleeping ? 'btn-disabled' : 'btn-success'}`}
                    onClick={() => handleFeed(itemKey)}
                    disabled={isDead || pet.sleeping}
                  >
                    {isDead ? '💀 Mascota muerta' : pet.sleeping ? '😴 Durmiendo' : 'Alimentar'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="feeding-tips">
        <h3>💡 Consejos de Alimentación</h3>
        <ul>
          <li>Diferentes alimentos tienen diferentes efectos</li>
          <li>Algunos alimentos pueden reducir la energía</li>
          <li>La pizza y el pastel son muy efectivos pero caros</li>
          <li>Las frutas son una buena opción balanceada</li>
        </ul>
      </div>
    </div>
  )
}

export default Alimentar
