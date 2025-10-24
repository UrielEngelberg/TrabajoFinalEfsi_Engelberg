// Context API para manejar el sistema de logros
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from './UserContext'
import { useInventory } from './InventoryContext'

// Crear el contexto de logros
const AchievementContext = createContext()

// Hook personalizado para usar el contexto de logros
export const useAchievement = () => {
  const context = useContext(AchievementContext)
  if (!context) {
    throw new Error('useAchievement must be used within an AchievementProvider')
  }
  return context
}

// Definición de logros
const ACHIEVEMENTS = {
  first_feed: {
    id: 'first_feed',
    name: 'Primera Comida',
    description: 'Alimenta a tu mascota por primera vez',
    emoji: '🍎',
    condition: (stats) => stats.feeds >= 1,
    reward: { coins: 10 }
  },
  five_feeds: {
    id: 'five_feeds',
    name: 'Alimentador Experto',
    description: 'Alimenta a tu mascota 5 veces',
    emoji: '🍽️',
    condition: (stats) => stats.feeds >= 5,
    reward: { coins: 25 }
  },
  ten_feeds: {
    id: 'ten_feeds',
    name: 'Chef Profesional',
    description: 'Alimenta a tu mascota 10 veces',
    emoji: '👨‍🍳',
    condition: (stats) => stats.feeds >= 10,
    reward: { coins: 50 }
  },
  first_play: {
    id: 'first_play',
    name: 'Primer Juego',
    description: 'Juega con tu mascota por primera vez',
    emoji: '🎮',
    condition: (stats) => stats.plays >= 1,
    reward: { coins: 10 }
  },
  five_plays: {
    id: 'five_plays',
    name: 'Compañero de Juegos',
    description: 'Juega con tu mascota 5 veces',
    emoji: '🎯',
    condition: (stats) => stats.plays >= 5,
    reward: { coins: 25 }
  },
  first_sleep: {
    id: 'first_sleep',
    name: 'Primera Siesta',
    description: 'Pon a dormir a tu mascota por primera vez',
    emoji: '😴',
    condition: (stats) => stats.sleeps >= 1,
    reward: { coins: 10 }
  },
  first_bath: {
    id: 'first_bath',
    name: 'Primer Baño',
    description: 'Baña a tu mascota por primera vez',
    emoji: '🛁',
    condition: (stats) => stats.baths >= 1,
    reward: { coins: 15 }
  },
  five_baths: {
    id: 'five_baths',
    name: 'Higiene Perfecta',
    description: 'Baña a tu mascota 5 veces',
    emoji: '🧼',
    condition: (stats) => stats.baths >= 5,
    reward: { coins: 30 }
  },
  first_friend: {
    id: 'first_friend',
    name: 'Primer Amigo',
    description: 'Haz que tu mascota tenga su primer amigo',
    emoji: '👫',
    condition: (stats) => stats.friends >= 1,
    reward: { coins: 20 }
  },
  first_companion: {
    id: 'first_companion',
    name: 'Primera Compañera',
    description: 'Encuentra una compañera de vida para tu mascota',
    emoji: '💕',
    condition: (stats) => stats.companion,
    reward: { coins: 50 }
  }
}

// Provider del contexto de logros
export const AchievementProvider = ({ children }) => {
  const { user } = useUser()
  const { addCoins } = useInventory()
  
  // Estado de logros del usuario
  const [achievements, setAchievements] = useState({})
  
  // Estadísticas del usuario para verificar logros
  const [stats, setStats] = useState({
    feeds: 0,
    plays: 0,
    sleeps: 0,
    baths: 0,
    friends: 0,
    companion: false
  })

  // Cargar logros y estadísticas desde localStorage
  useEffect(() => {
    if (user) {
      const savedAchievements = localStorage.getItem(`mv:achievements:${user.id}`)
      const savedStats = localStorage.getItem(`mv:stats:${user.id}`)
      
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements))
      }
      
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }
    }
  }, [user])

  // Guardar logros y estadísticas en localStorage
  useEffect(() => {
    if (user && Object.keys(achievements).length > 0) {
      localStorage.setItem(`mv:achievements:${user.id}`, JSON.stringify(achievements))
    }
  }, [achievements, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`mv:stats:${user.id}`, JSON.stringify(stats))
    }
  }, [stats, user])

  // Verificar y otorgar logros
  const checkAchievements = (newStats) => {
    const updatedStats = { ...stats, ...newStats }
    setStats(updatedStats)
    
    const newAchievements = { ...achievements }
    let hasNewAchievement = false
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!newAchievements[achievement.id] && achievement.condition(updatedStats)) {
        newAchievements[achievement.id] = {
          ...achievement,
          unlockedAt: Date.now()
        }
        hasNewAchievement = true
        
        // Agregar monedas de recompensa
        addCoins(achievement.reward.coins)
        
        // Mostrar notificación de logro
        showAchievementNotification(achievement)
      }
    })
    
    if (hasNewAchievement) {
      setAchievements(newAchievements)
    }
  }

  // Mostrar notificación de logro desbloqueado
  const showAchievementNotification = (achievement) => {
    const notification = document.createElement('div')
    notification.className = 'achievement-notification'
    notification.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-emoji">${achievement.emoji}</div>
        <div class="achievement-text">
          <div class="achievement-title">¡Logro Desbloqueado!</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-description">${achievement.description}</div>
          <div class="achievement-reward">Recompensa: ${achievement.reward.coins} monedas</div>
        </div>
      </div>
    `
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 1000;
      animation: slideInRight 0.5s ease-out;
      max-width: 300px;
    `
    
    // Agregar estilos de animación
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .achievement-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .achievement-emoji {
        font-size: 24px;
      }
      .achievement-text {
        flex: 1;
      }
      .achievement-title {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 2px;
      }
      .achievement-name {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 2px;
      }
      .achievement-description {
        font-size: 12px;
        opacity: 0.9;
        margin-bottom: 4px;
      }
      .achievement-reward {
        font-size: 11px;
        opacity: 0.8;
      }
    `
    document.head.appendChild(style)
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }, 5000)
  }

  // Funciones para actualizar estadísticas
  const incrementFeed = () => checkAchievements({ feeds: stats.feeds + 1 })
  const incrementPlay = () => checkAchievements({ plays: stats.plays + 1 })
  const incrementSleep = () => checkAchievements({ sleeps: stats.sleeps + 1 })
  const incrementBath = () => checkAchievements({ baths: stats.baths + 1 })
  const incrementFriend = () => checkAchievements({ friends: stats.friends + 1 })
  const setCompanion = () => checkAchievements({ companion: true })

  // Obtener logros desbloqueados
  const getUnlockedAchievements = () => {
    return Object.values(achievements).filter(achievement => achievement.unlockedAt)
  }

  // Obtener logros disponibles
  const getAvailableAchievements = () => {
    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: !!achievements[achievement.id],
      unlockedAt: achievements[achievement.id]?.unlockedAt
    }))
  }

  const value = {
    achievements,
    stats,
    incrementFeed,
    incrementPlay,
    incrementSleep,
    incrementBath,
    incrementFriend,
    setCompanion,
    getUnlockedAchievements,
    getAvailableAchievements
  }

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  )
}
