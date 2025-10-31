// Página para jugar con la mascota virtual
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { usePet } from '../contexts/PetContext'
import { useInventory } from '../contexts/InventoryContext'
import { useAchievement } from '../contexts/AchievementContext'
import { useCooldown } from '../hooks/usePetTick'

const Jugar = () => {
  const { isAuthenticated } = useUser()
  const { pet, isDead, startPlayCooldown, playWithPet, playClickTick } = usePet()
  const { coins, addCoins } = useInventory()
  const { incrementPlay } = useAchievement()
  const cooldownLeft = useCooldown(pet.cooldowns.play)
  
  const [gameActive, setGameActive] = useState(false)
  const [currentGame, setCurrentGame] = useState('click')
  const [clicks, setClicks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [memoryCards, setMemoryCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [snakePosition, setSnakePosition] = useState({ x: 10, y: 10 })
  const [snakeDirection, setSnakeDirection] = useState('right')
  const [snakeBody, setSnakeBody] = useState([{ x: 10, y: 10 }])
  const [foodPosition, setFoodPosition] = useState({ x: 15, y: 15 })
  const [snakeScore, setSnakeScore] = useState(0)

  if (!isAuthenticated) return <Navigate to="/auth" replace />

  // Inicializar juego de memoria
  const initMemoryGame = () => {
    const symbols = ['🐱', '🐶', '🐰', '🐸', '🐯', '🐻', '🦊', '🐨']
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5)
    setMemoryCards(cards.map((symbol, index) => ({ id: index, symbol, flipped: false })))
    setFlippedCards([])
    setMatchedCards([])
  }

  // Inicializar juego de serpiente
  const initSnakeGame = () => {
    setSnakePosition({ x: 10, y: 10 })
    setSnakeDirection('right')
    setSnakeBody([{ x: 10, y: 10 }])
    setFoodPosition({ x: 15, y: 15 })
    setSnakeScore(0)
  }

  const startGame = (gameType) => {
    if (cooldownLeft > 0 || pet.sleeping || isDead) return
    
    setCurrentGame(gameType)
    setGameActive(true)
    setClicks(0)
    setTimeLeft(10)
    
    if (gameType === 'memory') {
      initMemoryGame()
    } else if (gameType === 'snake') {
      initSnakeGame()
    }
    
    // Iniciar cooldown inmediatamente
    startPlayCooldown()
    
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
    if (!gameActive || currentGame !== 'click') return
    const newClicks = clicks + 1
    setClicks(newClicks)
    // Cada 5 clics: +1 felicidad y -1 energía; en los demás: 0
    const isFifth = newClicks % 5 === 0
    playClickTick(isFifth ? 1 : 0, isFifth ? -1 : 0)
    
    // Ganar 1 moneda cada 10 clicks
    if (newClicks % 10 === 0) {
      addCoins(1)
    }
  }

  // Manejar click en tarjeta de memoria
  const handleMemoryCardClick = (cardId) => {
    if (flippedCards.length >= 2 || matchedCards.includes(cardId)) return
    
    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)
    
    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards
      const firstCard = memoryCards.find(c => c.id === first)
      const secondCard = memoryCards.find(c => c.id === second)
      
      if (firstCard.symbol === secondCard.symbol) {
        setMatchedCards([...matchedCards, first, second])
        addCoins(2)
      }
      
      setTimeout(() => {
        setFlippedCards([])
      }, 1000)
    }
  }

  // Manejar movimiento de serpiente
  const handleSnakeMove = (direction) => {
    if (currentGame !== 'snake' || !gameActive) return
    
    setSnakeDirection(direction)
    const newBody = [...snakeBody]
    const head = { ...newBody[0] }
    
    switch (direction) {
      case 'up': head.y -= 1; break
      case 'down': head.y += 1; break
      case 'left': head.x -= 1; break
      case 'right': head.x += 1; break
    }
    
    // Verificar colisión con bordes
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      endGame()
      return
    }
    
    // Verificar colisión consigo misma
    if (newBody.some(segment => segment.x === head.x && segment.y === head.y)) {
      endGame()
      return
    }
    
    newBody.unshift(head)
    
    // Verificar si comió comida
    if (head.x === foodPosition.x && head.y === foodPosition.y) {
      setSnakeScore(prev => prev + 1)
      addCoins(1)
      // Generar nueva comida
      setFoodPosition({
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      })
    } else {
      newBody.pop()
    }
    
    setSnakeBody(newBody)
    setSnakePosition(head)
  }

  const endGame = () => {
    if (!gameActive) return
    setGameActive(false)
    // Aplica efecto final (mantiene cooldown ya iniciado)
    if (playWithPet()) {
      incrementPlay()
    }
  }

  useEffect(() => {
    if (timeLeft === 0 && gameActive) endGame()
  }, [timeLeft, gameActive])

  const isDisabled = cooldownLeft > 0 || pet.sleeping || isDead

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
        <div className="stat-item">
          <h4>💰 Monedas: {coins}</h4>
        </div>
      </div>
      
      <div className="game-area">
        {!gameActive ? (
          <div className="game-selection">
            <h3>Selecciona un juego:</h3>
            <div className="game-buttons">
              <button 
                onClick={() => startGame('click')} 
                disabled={isDisabled} 
                className={`btn ${isDisabled ? 'btn-disabled' : 'btn-warning'}`}
              >
                🎯 Juego de Clics
              </button>
              <button 
                onClick={() => startGame('memory')} 
                disabled={isDisabled} 
                className={`btn ${isDisabled ? 'btn-disabled' : 'btn-info'}`}
              >
                🧠 Memoria
              </button>
              <button 
                onClick={() => startGame('snake')} 
                disabled={isDisabled} 
                className={`btn ${isDisabled ? 'btn-disabled' : 'btn-success'}`}
              >
                🐍 Serpiente
              </button>
            </div>
            {isDisabled && (
              <p className="disabled-message">
                {isDead ? '💀 Mascota muerta' : pet.sleeping ? '😴 Durmiendo' : `⏳ ${Math.ceil(cooldownLeft/1000)}s`}
              </p>
            )}
          </div>
        ) : (
          <div className="active-game">
            <div className="game-header">
              <p>Tiempo: {timeLeft}s</p>
              {currentGame === 'click' && <p>Clics: {clicks}</p>}
              {currentGame === 'snake' && <p>Puntuación: {snakeScore}</p>}
              {currentGame === 'memory' && <p>Parejas: {matchedCards.length / 2}</p>}
            </div>
            
            {currentGame === 'click' && (
              <button onClick={handleClick} className="btn btn-warning game-button">🎯 CLIC</button>
            )}
            
            {currentGame === 'memory' && (
              <div className="memory-game">
                <div className="memory-grid">
                  {memoryCards.map(card => (
                    <button
                      key={card.id}
                      onClick={() => handleMemoryCardClick(card.id)}
                      className={`memory-card ${flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'flipped' : ''}`}
                      disabled={flippedCards.length >= 2}
                    >
                      {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.symbol : '?'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {currentGame === 'snake' && (
              <div className="snake-game">
                <div className="snake-board">
                  {Array.from({ length: 20 }, (_, y) => (
                    <div key={y} className="snake-row">
                      {Array.from({ length: 20 }, (_, x) => (
                        <div key={x} className="snake-cell">
                          {snakeBody.some(segment => segment.x === x && segment.y === y) && '🐍'}
                          {foodPosition.x === x && foodPosition.y === y && '🍎'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="snake-controls">
                  <button onClick={() => handleSnakeMove('up')} className="btn btn-success">⬆️</button>
                  <div>
                    <button onClick={() => handleSnakeMove('left')} className="btn btn-success">⬅️</button>
                    <button onClick={() => handleSnakeMove('right')} className="btn btn-success">➡️</button>
                  </div>
                  <button onClick={() => handleSnakeMove('down')} className="btn btn-success">⬇️</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Jugar