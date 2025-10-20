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

// Provider del contexto de usuario que envuelve la aplicación
export const UserProvider = ({ children }) => {
  // Estado del usuario actual (null si no está autenticado)
  const [user, setUser] = useState(null)
  
  // Estado de autenticación (true si el usuario está logueado)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Efecto que se ejecuta al cargar la aplicación
  // Verifica si hay un usuario guardado en localStorage
  useEffect(() => {
    // Intentar cargar usuario desde localStorage
    const savedUser = localStorage.getItem('mv:user')
    if (savedUser) {
      // Parsear el JSON y restaurar el estado del usuario
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  // Función para iniciar sesión o crear nuevo usuario
  const login = (username, pin) => {
    // Crear objeto de usuario con datos básicos
    const userData = {
      id: Date.now().toString(), // ID único basado en timestamp
      username, // Nombre de usuario
      pin, // PIN de seguridad
      createdAt: new Date().toISOString() // Fecha de creación
    }
    
    // Actualizar estado local
    setUser(userData)
    setIsAuthenticated(true)
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('mv:user', JSON.stringify(userData))
  }

  // Función para cerrar sesión
  const logout = () => {
    // Limpiar estado local
    setUser(null)
    setIsAuthenticated(false)
    
    // Limpiar localStorage
    localStorage.removeItem('mv:user')
    localStorage.removeItem(`mv:pet:${user?.id}`) // También limpiar datos de mascota
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