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
      sleep: 0 // Cooldown para dormir
    }
  })

  // Hook personalizado que maneja la degradación automática de stats
  // Se ejecuta cada minuto y degrada stats cada 5 minutos
  usePetTick(pet, setPet, user)

  // Efecto que se ejecuta cuando cambia el usuario
  // Carga la mascota desde localStorage o crea una nueva
  useEffect(() => {
    if (user) {
      // Intentar cargar mascota desde localStorage usando el ID del usuario
      const savedPet = localStorage.getItem(`mv:pet:${user.id}`)
      if (savedPet) {
        // Si existe, restaurar el estado de la mascota
        const petData = JSON.parse(savedPet)
        setPet(petData)
      } else {
        // Si no existe, crear una nueva mascota con valores por defecto
        const newPet = {
          hunger: 50,
          energy: 50,
          happiness: 50,
          sleeping: false,
          lastTick: Date.now(),
          cooldowns: {
            feed: 0,
            play: 0,
            sleep: 0
          }
        }
        setPet(newPet)
        // Guardar inmediatamente en localStorage
        localStorage.setItem(`mv:pet:${user.id}`, JSON.stringify(newPet))
      }
    }
  }, [user])

  // Efecto que guarda automáticamente la mascota en localStorage
  // cada vez que cambia el estado de la mascota
  useEffect(() => {
    if (user && pet) {
      // Guardar estado actual de la mascota en localStorage
      localStorage.setItem(`mv:pet:${user.id}`, JSON.stringify(pet))
    }
  }, [pet, user])

  // Función para alimentar la mascota
  const feedPet = () => {
    const now = Date.now()
    
    // Verificar si la acción está en cooldown
    if (now < pet.cooldowns.feed) return false

    // Actualizar estado de la mascota
    setPet(prev => ({
      ...prev, // Mantener todos los valores anteriores
      hunger: Math.min(100, prev.hunger + 20), // Aumentar hambre (máximo 100)
      cooldowns: {
        ...prev.cooldowns, // Mantener otros cooldowns
        feed: now + 60000 // Establecer cooldown de 60 segundos
      }
    }))
    return true // Indicar que la acción fue exitosa
  }

  // Función para jugar con la mascota
  const playWithPet = () => {
    const now = Date.now()
    
    // Verificar si la acción está en cooldown
    if (now < pet.cooldowns.play) return false

    // Actualizar estado de la mascota
    setPet(prev => ({
      ...prev, // Mantener todos los valores anteriores
      happiness: Math.min(100, prev.happiness + 15), // Aumentar felicidad (máximo 100)
      energy: Math.max(0, prev.energy - 10), // Disminuir energía (mínimo 0)
      cooldowns: {
        ...prev.cooldowns, // Mantener otros cooldowns
        play: now + 60000 // Establecer cooldown de 60 segundos
      }
    }))
    return true // Indicar que la acción fue exitosa
  }

  // Función para dormir la mascota
  const putPetToSleep = () => {
    const now = Date.now()
    
    // Verificar si la acción está en cooldown o si ya está durmiendo
    if (now < pet.cooldowns.sleep || pet.sleeping) return false

    // Poner la mascota a dormir
    setPet(prev => ({
      ...prev, // Mantener todos los valores anteriores
      sleeping: true, // Cambiar estado a durmiendo
      cooldowns: {
        ...prev.cooldowns, // Mantener otros cooldowns
        sleep: now + 30000 // Establecer cooldown de 30 segundos
      }
    }))

    // Programar el despertar después de 30 segundos
    setTimeout(() => {
      setPet(prev => ({
        ...prev, // Mantener todos los valores anteriores
        sleeping: false, // Despertar la mascota
        energy: Math.min(100, prev.energy + 25) // Restaurar energía (máximo 100)
      }))
    }, 30000) // 30 segundos

    return true // Indicar que la acción fue exitosa
  }

  // Función para resetear la mascota cuando muere
  const resetPet = () => {
    const newPet = {
      hunger: 50,
      energy: 50,
      happiness: 50,
      sleeping: false,
      lastTick: Date.now(),
      cooldowns: {
        feed: 0,
        play: 0,
        sleep: 0
      }
    }
    setPet(newPet)
  }

  // Objeto con todos los valores y funciones que estarán disponibles
  // para los componentes que usen este contexto
  const value = {
    pet, // Estado actual de la mascota
    feedPet, // Función para alimentar
    playWithPet, // Función para jugar
    putPetToSleep, // Función para dormir
    resetPet // Función para resetear cuando muere
  }

  // Renderizar el provider con el valor del contexto
  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  )
}