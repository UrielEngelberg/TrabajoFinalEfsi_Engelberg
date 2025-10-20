// Componente que renderiza el sprite animado de la mascota virtual
import React from 'react'
import { usePet } from '../contexts/PetContext'

// Componente que muestra el sprite de la mascota con diferentes estados visuales
const PetSprite = () => {
  // Obtener estado de la mascota desde el contexto
  const { pet } = usePet()

  // Función que determina qué clase CSS usar según el estado de la mascota
  const getSpriteClass = () => {
    // Si está durmiendo, mostrar sprite de sueño
    if (pet.sleeping) return 'pet-sprite pet-sleeping'
    
    // Si tiene hambre crítica, mostrar sprite hambriento
    if (pet.hunger < 20) return 'pet-sprite pet-hungry'
    
    // Si tiene energía crítica, mostrar sprite cansado
    if (pet.energy < 20) return 'pet-sprite pet-tired'
    
    // Si tiene felicidad crítica, mostrar sprite triste
    if (pet.happiness < 20) return 'pet-sprite pet-sad'
    
    // Si todo está bien, mostrar sprite feliz
    return 'pet-sprite pet-happy'
  }

  return (
    <div 
      className={getSpriteClass()}
      style={{
        // Placeholder para el sprite - aquí irá la imagen real
        backgroundImage: 'url(/src/assets/pet-sprite.png)',
        backgroundSize: 'contain', // Ajustar imagen al contenedor
        backgroundRepeat: 'no-repeat', // No repetir la imagen
        backgroundPosition: 'center' // Centrar la imagen
      }}
    />
  )
}

export default PetSprite