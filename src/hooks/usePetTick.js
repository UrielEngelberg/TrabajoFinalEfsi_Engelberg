// Custom hooks para manejar la lógica de la mascota virtual
import { useEffect, useState } from 'react'

// Hook personalizado que maneja la degradación automática de stats de la mascota
// Se ejecuta cada minuto y degrada los stats cada 5 minutos según las reglas del juego
export const usePetTick = (pet, setPet, user) => {
  useEffect(() => {
    // Solo ejecutar si hay usuario y mascota
    if (!user || !pet) return

    // Configurar intervalo que se ejecuta cada minuto (60000ms)
    const tickInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastTick = now - pet.lastTick
      
      // Verificar si han pasado 2 minutos (120000ms) desde el último tick
      if (timeSinceLastTick >= 120000) {
        // Aplicar degradación según las reglas del juego:
        // - Todos los stats: -5 puntos cada 2 minutos
        setPet(prev => ({
          ...prev, // Mantener todos los valores anteriores
          hunger: Math.max(0, prev.hunger - 5), // Degradar hambre (mínimo 0)
          energy: Math.max(0, prev.energy - 5), // Degradar energía (mínimo 0)
          happiness: Math.max(0, prev.happiness - 5), // Degradar felicidad (mínimo 0)
          hygiene: Math.max(0, prev.hygiene - 3), // Degradar higiene (mínimo 0) - más lento
          lastTick: now // Actualizar timestamp del último tick
        }))
      }
    }, 60000) // Verificar cada minuto

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(tickInterval)
  }, [pet, setPet, user])
}

// Hook personalizado para manejar cooldowns de acciones
// Recibe un timestamp de cooldown y devuelve el tiempo restante en milisegundos
export const useCooldown = (cooldownTime) => {
  // Estado para el tiempo restante del cooldown
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    // Si el cooldown ya expiró, no hacer nada
    if (cooldownTime <= Date.now()) {
      setTimeLeft(0)
      return
    }

    // Configurar intervalo que actualiza cada segundo
    const interval = setInterval(() => {
      const remaining = Math.max(0, cooldownTime - Date.now())
      setTimeLeft(remaining)
      
      // Si no queda tiempo, limpiar el intervalo
      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 1000) // Actualizar cada segundo

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval)
  }, [cooldownTime])

  // Devolver el tiempo restante en milisegundos
  return timeLeft
}