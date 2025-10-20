// Componente que muestra las barras de estadísticas de la mascota
import React from 'react'
import { usePet } from '../contexts/PetContext'

// Componente individual para cada barra de estadística
const StatsBar = ({ label, value, type }) => {
  return (
    <div className="stats-container">
      {/* Etiqueta con el valor numérico */}
      <div className="stats-label">
        <span>{label}: {value}/100</span>
      </div>
      
      {/* Barra visual de progreso */}
      <div className="stats-bar">
        <div 
          className={`stats-fill stats-${type}`}
          style={{ width: `${value}%` }} // Ancho basado en el valor
        />
      </div>
    </div>
  )
}

// Componente principal que muestra todas las estadísticas de la mascota
const PetStats = () => {
  // Obtener estado de la mascota desde el contexto
  const { pet } = usePet()

  return (
    <div className="pet-stats">
      {/* Barra de hambre */}
      <StatsBar label="Hambre" value={pet.hunger} type="hunger" />
      
      {/* Barra de energía */}
      <StatsBar label="Energía" value={pet.energy} type="energy" />
      
      {/* Barra de felicidad */}
      <StatsBar label="Felicidad" value={pet.happiness} type="happiness" />
      
      {/* Indicador especial si la mascota está durmiendo */}
      {pet.sleeping && (
        <div className="sleeping-indicator">
          😴 La mascota está durmiendo...
        </div>
      )}
    </div>
  )
}

export default PetStats