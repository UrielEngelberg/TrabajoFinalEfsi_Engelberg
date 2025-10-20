// Página para jugar con la mascota virtual
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useCooldown } from '../hooks/usePetTick'

const Jugar = () => {
  const { isAuthenticated } = useUser()
  const { pet, startPlayCooldown, playWithPet, playClickTick } = usePet()
  const cooldownLeft = useCooldown(pet.cooldowns.play)
  
  const [gameActive, setGameActive] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  if (!isAuthenticated) return <Navigate to="/auth" replace />

  const startGame = () => {
    if (cooldownLeft > 0 || pet.sleeping) return
    // Iniciar cooldown inmediatamente
    startPlayCooldown()
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

  const handleClick = () => {
    if (!gameActive) return
    setClicks(prev => prev + 1)
    playClickTick()
  }

  const endGame = () => {
    if (!gameActive) return
    setGameActive(false)
    // Aplica efecto final (mantiene cooldown ya iniciado)
    playWithPet()
  }

  useEffect(() => {
    if (timeLeft === 0 && gameActive) endGame()
  }, [timeLeft, gameActive])

  const isDisabled = cooldownLeft > 0 || pet.sleeping

  return (
    <div className="card scene-play">
      <h1>🎮 Jugar</h1>
      
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
          <button onClick={startGame} disabled={isDisabled} className={`btn ${isDisabled ? 'btn-disabled' : 'btn-warning'}`}>
            {pet.sleeping ? '😴 Durmiendo' : (cooldownLeft > 0 ? `⏳ ${Math.ceil(cooldownLeft/1000)}s` : 'Iniciar')}
          </button>
        ) : (
          <div className="active-game">
            <p>Tiempo: {timeLeft}s | Clics: {clicks}</p>
            <button onClick={handleClick} className="btn btn-warning game-button">🎯 CLIC</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Jugar