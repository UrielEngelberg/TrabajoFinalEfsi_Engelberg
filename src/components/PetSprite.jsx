// Componente que renderiza el sprite animado de la mascota virtual
import React from 'react'
import { usePet } from '../contexts/PetContext'

// Componente que muestra el sprite de la mascota con diferentes estados visuales
const PetSprite = () => {
  // Obtener estado de la mascota desde el contexto
  const { pet } = usePet()

  // SVG pixel art embebido como data URI para evitar dependencias externas (estilo Pou)
  const pixelArt = `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
      <rect width='16' height='16' fill='#b3e5fc'/>
      <!-- cuerpo pou (triángulo redondeado pixelado) -->
      <rect x='3' y='6' width='10' height='7' fill='#c69c6d'/>
      <rect x='4' y='5' width='8' height='1' fill='#c69c6d'/>
      <rect x='5' y='4' width='6' height='1' fill='#c69c6d'/>
      <rect x='6' y='3' width='4' height='1' fill='#c69c6d'/>
      <!-- vientre más claro -->
      <rect x='5' y='9' width='6' height='3' fill='#e0c9a6'/>
      <!-- ojos -->
      <rect x='6' y='7' width='2' height='2' fill='#fff'/>
      <rect x='8' y='7' width='2' height='2' fill='#fff'/>
      <rect x='6' y='8' width='1' height='1' fill='#333'/>
      <rect x='9' y='8' width='1' height='1' fill='#333'/>
      <!-- boca -->
      <rect x='7' y='10' width='2' height='1' fill='#8d6e63'/>
    </svg>`
  )}")`

  // Función que determina qué clase CSS usar según el estado de la mascota
  const getSpriteClass = () => {
    if (pet.sleeping) return 'pet-sprite pet-sleeping'
    if (pet.hunger < 20) return 'pet-sprite pet-hungry'
    if (pet.energy < 20) return 'pet-sprite pet-tired'
    if (pet.happiness < 20) return 'pet-sprite pet-sad'
    return 'pet-sprite pet-happy'
  }

  return (
    <div 
      className={getSpriteClass()}
      style={{
        backgroundImage: pixelArt,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    />
  )
}

export default PetSprite