// Página para jugar con la mascota virtual
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'

// Componente de la página de juego
const Jugar = () => {
  // Obtener estado de autenticación del usuario
  const { isAuthenticated } = useUser()
  
  // Obtener función para jugar y estado de la mascota
  const { pet, playWithPet } = usePet()
  
  // Hook para manejar el cooldown de la acción de jugar
  const cooldownLeft = useCooldown(pet.cooldowns.play)
  
  // Estados locales para el minijuego
  const [gameActive, setGameActive] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  // Si el usuario no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // Función que inicia el minijuego
  const startGame = () => {
    if (cooldownLeft > 0 || pet.sleeping) return
    
    setGameActive(true)
    setClicks(0)
    setTimeLeft(10) // 10 segundos para el juego
    
    // Timer del juego
    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimer)
          setGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Función que maneja los clics durante el juego
  const handleClick = () => {
    if (!gameActive) return
    setClicks(prev => prev + 1)
  }

  // Función que termina el juego y aplica los efectos
  const endGame = () => {
    if (!gameActive) return
    
    setGameActive(false)
    
    // Aplicar efectos de jugar (felicidad +15, energía -10)
    const success = playWithPet()
    if (success) {
      console.log(`Juego terminado! Clics: ${clicks}`)
    }
  }

  // Efecto que termina el juego automáticamente
  useEffect(() => {
    if (timeLeft === 0 && gameActive) {
      endGame()
    }
  }, [timeLeft, gameActive])

  // Calcular si el botón debe estar deshabilitado
  const isDisabled = cooldownLeft > 0 || pet.sleeping

  return (
    <div className="card">
      {/* Título de la página */}
      <h1>🎮 Jugar con Mascota</h1>
      
      {/* Información sobre la acción */}
      <div className="action-info">
        <p>Jugar aumenta la felicidad en 15 puntos pero reduce la energía en 10.</p>
        <p><strong>Cooldown:</strong> 60 segundos</p>
      </div>
      
      {/* Estados actuales */}
      <div className="current-stats">
        <div className="stat-item">
          <h4>Felicidad: {pet.happiness}/100</h4>
          <div className="stats-bar">
            <div 
              className="stats-fill stats-happiness"
              style={{ width: `${pet.happiness}%` }}
            />
          </div>
        </div>
        
        <div className="stat-item">
          <h4>Energía: {pet.energy}/100</h4>
          <div className="stats-bar">
            <div 
              className="stats-fill stats-energy"
              style={{ width: `${pet.energy}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Área del minijuego */}
      <div className="game-area">
        {!gameActive ? (
          <button 
            onClick={startGame}
            disabled={isDisabled}
            className={`btn ${isDisabled ? 'btn-disabled' : 'btn-warning'}`}
          >
            {pet.sleeping ? '😴 Mascota durmiendo' : '🎮 Iniciar Juego'}
          </button>
        ) : (
          <div className="active-game">
            <h3>¡Haz clic lo más rápido que puedas!</h3>
            <p>Tiempo restante: {timeLeft}s</p>
            <p>Clics: {clicks}</p>
            <button 
              onClick={handleClick}
              className="btn btn-warning game-button"
            >
              🎯 ¡CLIC!
            </button>
          </div>
        )}
      </div>
      
      {/* Mostrar cooldown si está activo */}
      {cooldownLeft > 0 && (
        <div className="cooldown-timer">
          ⏰ Próximo juego en: {Math.ceil(cooldownLeft / 1000)}s
        </div>
      )}
      
      {/* Información adicional */}
      <div className="action-tips">
        <h3>💡 Consejos:</h3>
        <ul>
          <li>Haz clic lo más rápido que puedas durante 10 segundos</li>
          <li>Los efectos se aplican al terminar el juego</li>
          <li>Jugar consume energía, úsalo con moderación</li>
          <li>No puedes jugar mientras la mascota duerme</li>
        </ul>
      </div>
    </div>
  )
}

export default Jugar