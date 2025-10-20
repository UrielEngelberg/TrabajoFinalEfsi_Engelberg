// Context API para manejar el estado global de la mascota virtual
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from './UserContext'
import { usePetTick } from '../hooks/usePetTick'

// Crear el contexto de mascota
const PetContext = createContext()

// Hook personalizado para usar el contexto de mascota
// Este hook verifica que se esté usando dentro del provider correcto
export const usePet = () => {
  const context = useContext(PetContext)
  if (!context) {
    throw new Error('usePet must be used within a PetProvider')
  }
  return context
}

// Provider del contexto de mascota que envuelve la aplicación
export const PetProvider = ({ children }) => {
  // Obtener datos del usuario desde el contexto de usuario
  const { user } = useUser()
  
  // Estado inicial de la mascota con valores por defecto
  const [pet, setPet] = useState({
    hunger: 50, // Hambre inicial (0-100)
    energy: 50, // Energía inicial (0-100)
    happiness: 50, // Felicidad inicial (0-100)
    sleeping: false, // Estado de sueño
    lastTick: Date.now(), // Timestamp del último tick automático
    cooldowns: { // Cooldowns para las acciones (en timestamp)
      feed: 0, // Cooldown para alimentar
      play: 0, // Cooldown para jugar
      sleep: 0, // Cooldown para dormir
      med: 0 // Cooldown para remedio
    }
  })

  // Hook personalizado que maneja la degradación automática de stats
  // Se ejecuta cada minuto y degrada stats cada 2 minutos
  usePetTick(pet, setPet, user)

  // Efecto que se ejecuta cuando cambia el usuario
  // Carga la mascota desde localStorage o crea una nueva
  useEffect(() => {
    if (user) {
      const savedPet = localStorage.getItem(`mv:pet:${user.id}`)
      if (savedPet) {
        const petData = JSON.parse(savedPet)
        setPet(petData)
      } else {
        const newPet = {
          hunger: 50,
          energy: 50,
          happiness: 50,
          sleeping: false,
          lastTick: Date.now(),
          cooldowns: {
            feed: 0,
            play: 0,
            sleep: 0,
            med: 0
          }
        }
        setPet(newPet)
        localStorage.setItem(`mv:pet:${user.id}`, JSON.stringify(newPet))
      }
    }
  }, [user])

  // Guardado automático
  useEffect(() => {
    if (user && pet) {
      localStorage.setItem(`mv:pet:${user.id}`, JSON.stringify(pet))
    }
  }, [pet, user])

  // Derivados: enfermedad y muerte
  const isSick = pet.hunger <= 10 || pet.energy <= 10 || pet.happiness <= 10
  const isDead = pet.hunger <= 0 || pet.energy <= 0 || pet.happiness <= 0

  // Acciones
  const feedPet = () => {
    const now = Date.now()
    if (now < pet.cooldowns.feed || isDead || pet.sleeping) return false
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 20),
      cooldowns: { ...prev.cooldowns, feed: now + 60000 }
    }))
    return true
  }

  const playWithPet = () => {
    const now = Date.now()
    if (now < pet.cooldowns.play || isDead || pet.sleeping) return false
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.max(0, prev.energy - 10),
      cooldowns: { ...prev.cooldowns, play: now + 60000 }
    }))
    return true
  }

  const putPetToSleep = () => {
    const now = Date.now()
    if (now < pet.cooldowns.sleep || isDead || pet.sleeping) return false
    setPet(prev => ({
      ...prev,
      sleeping: true,
      cooldowns: { ...prev.cooldowns, sleep: now + 30000 }
    }))
    setTimeout(() => {
      setPet(prev => ({
        ...prev,
        sleeping: false,
        energy: Math.min(100, prev.energy + 25)
      }))
    }, 30000)
    return true
  }

  // Dar remedio: solo si está enfermo; reduce penalidad curando levemente stats y aplica cooldown
  const giveMedicine = () => {
    const now = Date.now()
    if (!isSick || now < pet.cooldowns.med || isDead) return false
    setPet(prev => ({
      ...prev,
      // Curar un poco cada stat, sin exceder 100
      hunger: Math.min(100, prev.hunger + 5),
      energy: Math.min(100, prev.energy + 5),
      happiness: Math.min(100, prev.happiness + 5),
      cooldowns: { ...prev.cooldowns, med: now + 60000 }
    }))
    return true
  }

  // Reset al morir
  const resetPet = () => {
    const newPet = {
      hunger: 50,
      energy: 50,
      happiness: 50,
      sleeping: false,
      lastTick: Date.now(),
      cooldowns: { feed: 0, play: 0, sleep: 0, med: 0 }
    }
    setPet(newPet)
  }

  // Exponer contexto
  const value = {
    pet,
    isSick,
    isDead,
    feedPet,
    playWithPet,
    putPetToSleep,
    giveMedicine,
    resetPet
  }

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  )
}