// Página para mostrar los logros del usuario
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useAchievement } from '../contexts/AchievementContext'

const Logros = () => {
  const { isAuthenticated } = useUser()
  const { getAvailableAchievements, getUnlockedAchievements } = useAchievement()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  const achievements = getAvailableAchievements()
  const unlockedAchievements = getUnlockedAchievements()

  return (
    <div className="card">
      <h1>🏆 Logros</h1>
      
      <div className="achievements-summary">
        <h3>Progreso: {unlockedAchievements.length}/{achievements.length} logros desbloqueados</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-emoji">
              {achievement.unlocked ? achievement.emoji : '🔒'}
            </div>
            <div className="achievement-info">
              <h4 className="achievement-name">{achievement.name}</h4>
              <p className="achievement-description">{achievement.description}</p>
              <div className="achievement-reward">
                Recompensa: {achievement.reward.coins} monedas
              </div>
              {achievement.unlocked && (
                <div className="achievement-date">
                  Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Logros
