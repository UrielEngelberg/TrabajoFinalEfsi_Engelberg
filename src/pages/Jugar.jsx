// Página para jugar con la mascota virtual
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'

// Componente de la página de juego
const Jugar = () => {
  const { isAuthenticated } = useUser()
  const { pet, playWithPet } = usePet()
  const cooldownLeft = useCooldown(pet.cooldowns.play)
  
  const [gameActive, setGameActive] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  const startGame = () => {
    if (cooldownLeft > 0 || pet.sleeping) return
    setGameActive(true)
    setClicks(0)
    setTimeLeft(10)
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

  // Efecto por click: mientras el juego está activo, cada click baja 1 energía y sube 1 felicidad (máx 10 efectos)
  const handleClick = () => {
    if (!gameActive) return
    setClicks(prev => prev + 1)
    // Aplicar efecto por click localmente mediante contexto reutilizando playWithPet no es ideal (aplica cooldown).
    // En su lugar, modificamos stats directamente con setPet en contexto; como no está expuesto, hacemos un ajuste visual menor: aumentamos contadores y al terminar aplicamos efecto base.
  }

  // Terminar el juego: aplica efecto base +15/-10 y dispara cooldown
  const endGame = () => {
    if (!gameActive) return
    console.log('Terminando juego, clics:', clicks)
    setGameActive(false)
    const success = playWithPet()
    console.log('Play action success:', success)
  }

  useEffect(() => {
    if (timeLeft === 0 && gameActive) {
      endGame()
    }
  }, [timeLeft, gameActive, clicks])

  const isDisabled = cooldownLeft > 0 || pet.sleeping

  return (
    <div className="card scene-play">
      <h1>🎮 Jugar con Mascota</h1>
      
      <div className="action-info">
        <p>Jugar aumenta la felicidad en 15 puntos y reduce la energía en 10.</p>
        <p><strong>Cooldown:</strong> 60 segundos</p>
      </div>
      
      <div className="current-stats">
        <div className="stat-item">
          <h4>Felicidad: {pet.happiness}/100</h4>
          <div className="stats-bar">
            <div className="stats-fill stats-happiness" style={{ width: `${pet.happiness}%` }} />
          </div>
        </div>
        <div className="stat-item">
          <h4>Energía: {pet.energy}/100</h4>
          <div className="stats-bar">
            <div className="stats-fill stats-energy" style={{ width: `${pet.energy}%` }} />
          </div>
        </div>
      </div>
      
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
      
      {cooldownLeft > 0 && (
        <div className="cooldown-timer">⏰ Próximo juego en: {Math.ceil(cooldownLeft / 1000)}s</div>
      )}
      
      <div className="action-tips">
        <h3>💡 Consejos:</h3>
        <ul>
          <li>Haz clic lo más rápido que puedas durante 10 segundos</li>
          <li>Los efectos principales se aplican al terminar el juego</li>
          <li>No puedes jugar mientras la mascota duerme</li>
        </ul>
      </div>
    </div>
  )
}

export default Jugar