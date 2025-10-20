// Context API para manejar el estado global del usuario y autenticación
import React, { createContext, useContext, useState, useEffect } from 'react'

// Crear el contexto de usuario
const UserContext = createContext()

// Hook personalizado para usar el contexto de usuario
// Este hook verifica que se esté usando dentro del provider correcto
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Helpers de storage
const USERS_KEY = 'mv:users' // diccionario por username
const CURRENT_USER_KEY = 'mv:user' // sesión actual

function loadUsersMap() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch (e) {
    return {}
  }
}

function saveUsersMap(usersMap) {
  localStorage.setItem(USERS_KEY, JSON.stringify(usersMap))
}

// Provider del contexto de usuario que envuelve la aplicación
export const UserProvider = ({ children }) => {
  // Estado del usuario actual (null si no está autenticado)
  const [user, setUser] = useState(null)
  
  // Estado de autenticación (true si el usuario está logueado)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Efecto que se ejecuta al cargar la aplicación
  // Verifica si hay un usuario guardado en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  // Función para iniciar sesión o crear nuevo usuario
  const login = (username, pin) => {
    const normalizedUsername = username.trim().toLowerCase()
    const usersMap = loadUsersMap()

    const existing = usersMap[normalizedUsername]
    if (existing) {
      // Validar PIN del usuario existente
      if (existing.pin !== pin) {
        throw new Error('PIN incorrecto')
      }
      const sessionUser = {
        id: existing.id,
        username: existing.username,
        createdAt: existing.createdAt
      }
      setUser(sessionUser)
      setIsAuthenticated(true)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))
      return
    }

    // Crear nuevo usuario si no existe
    const newUserRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      username: normalizedUsername,
      pin,
      createdAt: new Date().toISOString()
    }

    usersMap[normalizedUsername] = newUserRecord
    saveUsersMap(usersMap)

    // Sesión (sin exponer el PIN)
    const sessionUser = {
      id: newUserRecord.id,
      username: newUserRecord.username,
      createdAt: newUserRecord.createdAt
    }

    setUser(sessionUser)
    setIsAuthenticated(true)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))
  }

  // Función para cerrar sesión (sin borrar la mascota del usuario)
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  // Objeto con todos los valores y funciones que estarán disponibles
  // para los componentes que usen este contexto
  const value = {
    user, // Usuario actual
    isAuthenticated, // Estado de autenticación
    login, // Función para iniciar sesión
    logout // Función para cerrar sesión
  }

  // Renderizar el provider con el valor del contexto
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}