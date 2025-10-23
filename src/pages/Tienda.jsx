// Página de la tienda para comprar comida y remedios
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useInventory } from '../contexts/InventoryContext'

const Tienda = () => {
  const { isAuthenticated } = useUser()
  const { inventory, coins, buyItem, getItemEffects, canAfford } = useInventory()
  const [activeTab, setActiveTab] = useState('food')
  const [message, setMessage] = useState('')

  if (!isAuthenticated) return <Navigate to="/auth" replace />

  const shopItems = {
    food: [
      { key: 'apple', ...getItemEffects('apple') },
      { key: 'orange', ...getItemEffects('orange') },
      { key: 'cucumber', ...getItemEffects('cucumber') },
      { key: 'banana', ...getItemEffects('banana') },
      { key: 'carrot', ...getItemEffects('carrot') },
      { key: 'grapes', ...getItemEffects('grapes') },
      { key: 'strawberry', ...getItemEffects('strawberry') },
      { key: 'watermelon', ...getItemEffects('watermelon') },
      { key: 'pizza', ...getItemEffects('pizza') },
      { key: 'cake', ...getItemEffects('cake') }
    ],
    medicine: [
      { key: 'vitamin', ...getItemEffects('vitamin', true) },
      { key: 'energyDrink', ...getItemEffects('energyDrink', true) },
      { key: 'happinessPill', ...getItemEffects('happinessPill', true) },
      { key: 'superFood', ...getItemEffects('superFood', true) },
      { key: 'miracleCure', ...getItemEffects('miracleCure', true) }
    ]
  }

  const handleBuy = (itemKey, itemData) => {
    if (buyItem(itemKey, itemData, 1)) {
      setMessage(`¡Comprado! ${itemData.emoji} ${itemData.name} agregado al inventario.`)
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('No tienes suficientes monedas.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const getEffectText = (item) => {
    const effects = []
    if (item.hunger > 0) effects.push(`🍽️ +${item.hunger} Hambre`)
    if (item.happiness > 0) effects.push(`😊 +${item.happiness} Felicidad`)
    if (item.energy > 0) effects.push(`⚡ +${item.energy} Energía`)
    if (item.hunger < 0) effects.push(`🍽️ ${item.hunger} Hambre`)
    if (item.energy < 0) effects.push(`⚡ ${item.energy} Energía`)
    return effects.join(', ')
  }

  return (
    <div className="card scene-shop">
      <h1>🛒 Tienda</h1>
      
      <div className="shop-header">
        <div className="coins-display">
          <h2>💰 Monedas: {coins}</h2>
        </div>
        
        <div className="shop-tabs">
          <button 
            className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            🍎 Comida
          </button>
          <button 
            className={`tab-btn ${activeTab === 'medicine' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicine')}
          >
            💊 Remedios
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('No tienes') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="shop-items">
        {shopItems[activeTab].map((item) => (
          <div key={item.key} className="shop-item">
            <div className="item-info">
              <div className="item-header">
                <span className="item-emoji">{item.emoji}</span>
                <h3>{item.name}</h3>
                <span className="item-price">💰 {item.price}</span>
              </div>
              <p className="item-effects">{getEffectText(item)}</p>
              <p className="item-inventory">
                En inventario: {inventory[item.key] || 0}
              </p>
            </div>
            <button 
              className={`btn ${canAfford(item.price) ? 'btn-success' : 'btn-disabled'}`}
              onClick={() => handleBuy(item.key, item)}
              disabled={!canAfford(item.price)}
            >
              {canAfford(item.price) ? 'Comprar' : 'Sin monedas'}
            </button>
          </div>
        ))}
      </div>

      <div className="shop-tips">
        <h3>💡 Consejos</h3>
        <ul>
          <li>Gana monedas jugando con tu mascota (1 moneda cada 10 clicks)</li>
          <li>La comida básica es barata pero efectiva</li>
          <li>Los remedios son más caros pero muy efectivos</li>
          <li>La Cura Milagrosa es el remedio más poderoso</li>
        </ul>
      </div>
    </div>
  )
}

export default Tienda
