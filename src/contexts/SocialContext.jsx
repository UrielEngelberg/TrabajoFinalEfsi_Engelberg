// Context API para manejar el sistema social (amigos y compañera)
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from './UserContext'

// Crear el contexto social
const SocialContext = createContext()

// Hook personalizado para usar el contexto social
export const useSocial = () => {
  const context = useContext(SocialContext)
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider')
  }
  return context
}

// Tipos de amigos disponibles
const FRIEND_TYPES = {
  cat: {
    id: 'cat',
    name: 'Gatito',
    emoji: '🐱',
    description: 'Un gato amigable que le gusta jugar',
    happinessBonus: 5,
    energyCost: 2
  },
  dog: {
    id: 'dog',
    name: 'Perrito',
    emoji: '🐶',
    description: 'Un perro leal que siempre está feliz',
    happinessBonus: 8,
    energyCost: 3
  },
  rabbit: {
    id: 'rabbit',
    name: 'Conejito',
    emoji: '🐰',
    description: 'Un conejo saltarín y divertido',
    happinessBonus: 6,
    energyCost: 1
  },
  bird: {
    id: 'bird',
    name: 'Pajarito',
    emoji: '🐦',
    description: 'Un pájaro cantarín y alegre',
    happinessBonus: 4,
    energyCost: 1
  }
}

// Tipos de compañeras disponibles
const COMPANION_TYPES = {
  fairy: {
    id: 'fairy',
    name: 'Hada',
    emoji: '🧚‍♀️',
    description: 'Una hada mágica que cuida de tu mascota',
    happinessBonus: 10,
    energyBonus: 5,
    specialPower: 'Curación mágica ocasional'
  },
  robot: {
    id: 'robot',
    name: 'Robot',
    emoji: '🤖',
    description: 'Un robot inteligente que ayuda a tu mascota',
    happinessBonus: 8,
    energyBonus: 8,
    specialPower: 'Eficiencia energética'
  },
  princess: {
    id: 'princess',
    name: 'Princesa',
    emoji: '👸',
    description: 'Una princesa elegante y cariñosa',
    happinessBonus: 12,
    energyBonus: 3,
    specialPower: 'Felicidad extra'
  }
}

// Provider del contexto social
export const SocialProvider = ({ children }) => {
  const { user } = useUser()
  
  // Estado de amigos
  const [friends, setFriends] = useState([])
  
  // Estado de compañera
  const [companion, setCompanion] = useState(null)
  
  // Estado de interacciones sociales
  const [lastInteraction, setLastInteraction] = useState(0)

  // Cargar datos sociales desde localStorage
  useEffect(() => {
    if (user) {
      const savedFriends = localStorage.getItem(`mv:friends:${user.id}`)
      const savedCompanion = localStorage.getItem(`mv:companion:${user.id}`)
      const savedInteraction = localStorage.getItem(`mv:lastInteraction:${user.id}`)
      
      if (savedFriends) {
        setFriends(JSON.parse(savedFriends))
      }
      
      if (savedCompanion) {
        setCompanion(JSON.parse(savedCompanion))
      }
      
      if (savedInteraction) {
        setLastInteraction(parseInt(savedInteraction))
      }
    }
  }, [user])

  // Guardar datos sociales en localStorage
  useEffect(() => {
    if (user && friends.length > 0) {
      localStorage.setItem(`mv:friends:${user.id}`, JSON.stringify(friends))
    }
  }, [friends, user])

  useEffect(() => {
    if (user && companion) {
      localStorage.setItem(`mv:companion:${user.id}`, JSON.stringify(companion))
    }
  }, [companion, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`mv:lastInteraction:${user.id}`, lastInteraction.toString())
    }
  }, [lastInteraction, user])

  // Agregar un amigo
  const addFriend = (friendType) => {
    const friendData = FRIEND_TYPES[friendType]
    if (!friendData) return false
    
    const newFriend = {
      ...friendData,
      id: `${friendType}_${Date.now()}`,
      addedAt: Date.now(),
      interactions: 0
    }
    
    setFriends(prev => [...prev, newFriend])
    return true
  }

  // Interactuar con un amigo
  const interactWithFriend = (friendId) => {
    const now = Date.now()
    const friend = friends.find(f => f.id === friendId)
    
    if (!friend) return false
    
    // Verificar cooldown (1 hora)
    if (now - lastInteraction < 3600000) return false
    
    setFriends(prev => prev.map(f => 
      f.id === friendId 
        ? { ...f, interactions: f.interactions + 1 }
        : f
    ))
    
    setLastInteraction(now)
    return true
  }

  // Remover un amigo
  const removeFriend = (friendId) => {
    setFriends(prev => prev.filter(f => f.id !== friendId))
  }

  // Establecer compañera
  const setCompanionType = (companionType) => {
    const companionData = COMPANION_TYPES[companionType]
    if (!companionData) return false
    
    const newCompanion = {
      ...companionData,
      id: `${companionType}_${Date.now()}`,
      setAt: Date.now()
    }
    
    setCompanion(newCompanion)
    return true
  }

  // Remover compañera
  const removeCompanion = () => {
    setCompanion(null)
  }

  // Obtener efectos de interacción social
  const getSocialEffects = () => {
    let happinessBonus = 0
    let energyBonus = 0
    let energyCost = 0
    
    // Efectos de amigos
    friends.forEach(friend => {
      happinessBonus += friend.happinessBonus
      energyCost += friend.energyCost
    })
    
    // Efectos de compañera
    if (companion) {
      happinessBonus += companion.happinessBonus
      energyBonus += companion.energyBonus
    }
    
    return {
      happiness: happinessBonus,
      energy: energyBonus - energyCost
    }
  }

  // Verificar si puede interactuar socialmente
  const canInteract = () => {
    const now = Date.now()
    return now - lastInteraction >= 3600000 // 1 hora
  }

  // Obtener tiempo restante para próxima interacción
  const getTimeUntilNextInteraction = () => {
    const now = Date.now()
    const timeLeft = 3600000 - (now - lastInteraction)
    return Math.max(0, timeLeft)
  }

  const value = {
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
  }

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  )
}
