// Página para gestionar amigos y compañera de vida
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useSocial } from '../contexts/SocialContext'
import { useInventory } from '../contexts/InventoryContext'
import { useAchievement } from '../contexts/AchievementContext'
import { useCooldown } from '../hooks/usePetTick'

const Social = () => {
  const { isAuthenticated } = useUser()
  const { 
    friends, 
    companion, 
    addFriend, 
    interactWithFriend, 
    removeFriend, 
    setCompanionType, 
    removeCompanion,
    getSocialEffects,
    canInteract,
    getTimeUntilNextInteraction,
    FRIEND_TYPES,
    COMPANION_TYPES
  } = useSocial()
  const { coins, addCoins, spendCoins } = useInventory()
  const { incrementFriend, setCompanion } = useAchievement()
  
  const [selectedFriendType, setSelectedFriendType] = useState('')
  const [selectedCompanionType, setSelectedCompanionType] = useState('')
  
  const timeUntilNextInteraction = getTimeUntilNextInteraction()
  const canInteractNow = canInteract()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  const handleAddFriend = () => {
    if (!selectedFriendType) return
    
    const friendData = FRIEND_TYPES[selectedFriendType]
    if (!friendData) return
    
    // Costo: 50 monedas por amigo
    if (coins < 50) {
      alert('No tienes suficientes monedas. Necesitas 50 monedas para agregar un amigo.')
      return
    }
    
    if (addFriend(selectedFriendType)) {
      spendCoins(50)
      incrementFriend()
      setSelectedFriendType('')
      alert(`¡${friendData.name} se ha unido a tu grupo de amigos!`)
    }
  }

  const handleInteractWithFriend = (friendId) => {
    if (!canInteractNow) {
      const minutesLeft = Math.ceil(timeUntilNextInteraction / 60000)
      alert(`Debes esperar ${minutesLeft} minutos para la próxima interacción social.`)
      return
    }
    
    if (interactWithFriend(friendId)) {
      const friend = friends.find(f => f.id === friendId)
      const effects = getSocialEffects()
      
      // Dar recompensa por interacción
      addCoins(5)
      
      alert(`¡Interactuaste con ${friend.name}! +${effects.happiness} felicidad, +${effects.energy} energía`)
    }
  }

  const handleRemoveFriend = (friendId) => {
    const friend = friends.find(f => f.id === friendId)
    if (confirm(`¿Estás seguro de que quieres remover a ${friend.name}?`)) {
      removeFriend(friendId)
    }
  }

  const handleSetCompanion = () => {
    if (!selectedCompanionType) return
    
    const companionData = COMPANION_TYPES[selectedCompanionType]
    if (!companionData) return
    
    // Costo: 200 monedas por compañera
    if (coins < 200) {
      alert('No tienes suficientes monedas. Necesitas 200 monedas para tener una compañera.')
      return
    }
    
    if (setCompanionType(selectedCompanionType)) {
      spendCoins(200)
      setCompanion()
      setSelectedCompanionType('')
      alert(`¡${companionData.name} se ha convertido en tu compañera de vida!`)
    }
  }

  const handleRemoveCompanion = () => {
    if (confirm('¿Estás seguro de que quieres remover a tu compañera?')) {
      removeCompanion()
    }
  }

  const socialEffects = getSocialEffects()

  return (
    <div className="card">
      <h1>👥 Vida Social</h1>
      
      <div className="social-stats">
        <h3>Efectos Sociales Actuales:</h3>
        <div className="effects-display">
          <div className="effect-item">
            <span>Felicidad: +{socialEffects.happiness}</span>
          </div>
          <div className="effect-item">
            <span>Energía: {socialEffects.energy >= 0 ? '+' : ''}{socialEffects.energy}</span>
          </div>
        </div>
        {!canInteractNow && (
          <p className="cooldown-message">
            ⏰ Próxima interacción en: {Math.ceil(timeUntilNextInteraction / 60000)} minutos
          </p>
        )}
      </div>

      {/* Sección de Amigos */}
      <div className="friends-section">
        <h2>🐾 Amigos ({friends.length})</h2>
        
        {friends.length > 0 ? (
          <div className="friends-list">
            {friends.map(friend => (
              <div key={friend.id} className="friend-card">
                <div className="friend-info">
                  <span className="friend-emoji">{friend.emoji}</span>
                  <div className="friend-details">
                    <h4>{friend.name}</h4>
                    <p>{friend.description}</p>
                    <p>Interacciones: {friend.interactions}</p>
                    <p>Efectos: +{friend.happinessBonus} felicidad, -{friend.energyCost} energía</p>
                  </div>
                </div>
                <div className="friend-actions">
                  <button 
                    onClick={() => handleInteractWithFriend(friend.id)}
                    disabled={!canInteractNow}
                    className="btn btn-success"
                  >
                    {canInteractNow ? '💬 Interactuar' : '⏰ Esperar'}
                  </button>
                  <button 
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="btn btn-secondary"
                  >
                    ❌ Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes amigos aún. ¡Agrega algunos para mejorar la vida social de tu mascota!</p>
        )}

        <div className="add-friend-section">
          <h3>Agregar Nuevo Amigo (50 monedas)</h3>
          <div className="friend-selection">
            <select 
              value={selectedFriendType} 
              onChange={(e) => setSelectedFriendType(e.target.value)}
              className="friend-select"
            >
              <option value="">Selecciona un amigo...</option>
              {Object.values(FRIEND_TYPES).map(friend => (
                <option key={friend.id} value={friend.id}>
                  {friend.emoji} {friend.name} - {friend.description}
                </option>
              ))}
            </select>
            <button 
              onClick={handleAddFriend}
              disabled={!selectedFriendType || coins < 50}
              className="btn btn-warning"
            >
              Agregar Amigo
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Compañera */}
      <div className="companion-section">
        <h2>💕 Compañera de Vida</h2>
        
        {companion ? (
          <div className="companion-card">
            <div className="companion-info">
              <span className="companion-emoji">{companion.emoji}</span>
              <div className="companion-details">
                <h4>{companion.name}</h4>
                <p>{companion.description}</p>
                <p>Poder especial: {companion.specialPower}</p>
                <p>Efectos: +{companion.happinessBonus} felicidad, +{companion.energyBonus} energía</p>
              </div>
            </div>
            <button 
              onClick={handleRemoveCompanion}
              className="btn btn-secondary"
            >
              ❌ Remover Compañera
            </button>
          </div>
        ) : (
          <div className="add-companion-section">
            <p>No tienes una compañera de vida. ¡Encuentra una para darle amor a tu mascota!</p>
            <div className="companion-selection">
              <select 
                value={selectedCompanionType} 
                onChange={(e) => setSelectedCompanionType(e.target.value)}
                className="companion-select"
              >
                <option value="">Selecciona una compañera...</option>
                {Object.values(COMPANION_TYPES).map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.emoji} {comp.name} - {comp.description}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleSetCompanion}
                disabled={!selectedCompanionType || coins < 200}
                className="btn btn-info"
              >
                Establecer Compañera (200 monedas)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Social
