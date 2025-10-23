// Context API para manejar el inventario, monedas y tienda
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from './UserContext'

// Crear el contexto de inventario
const InventoryContext = createContext()

// Hook personalizado para usar el contexto de inventario
export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}

// Definir tipos de comida disponibles
const FOOD_TYPES = {
  apple: { name: 'Manzana', emoji: '🍎', hunger: 15, happiness: 5, energy: 0, price: 5 },
  orange: { name: 'Naranja', emoji: '🍊', hunger: 12, happiness: 8, energy: 3, price: 6 },
  cucumber: { name: 'Pepino', emoji: '🥒', hunger: 8, happiness: 2, energy: 5, price: 3 },
  banana: { name: 'Plátano', emoji: '🍌', hunger: 18, happiness: 10, energy: 8, price: 8 },
  carrot: { name: 'Zanahoria', emoji: '🥕', hunger: 10, happiness: 3, energy: 7, price: 4 },
  grapes: { name: 'Uvas', emoji: '🍇', hunger: 14, happiness: 12, energy: 4, price: 7 },
  strawberry: { name: 'Fresa', emoji: '🍓', hunger: 6, happiness: 15, energy: 2, price: 9 },
  watermelon: { name: 'Sandía', emoji: '🍉', hunger: 25, happiness: 8, energy: 10, price: 12 },
  pizza: { name: 'Pizza', emoji: '🍕', hunger: 30, happiness: 20, energy: -5, price: 20 },
  cake: { name: 'Pastel', emoji: '🍰', hunger: 20, happiness: 25, energy: -3, price: 18 }
}

// Definir tipos de remedios disponibles
const MEDICINE_TYPES = {
  vitamin: { name: 'Vitamina', emoji: '💊', hunger: 5, happiness: 5, energy: 10, price: 8 },
  energyDrink: { name: 'Bebida Energética', emoji: '🥤', hunger: 0, happiness: 5, energy: 20, price: 12 },
  happinessPill: { name: 'Píldora de Felicidad', emoji: '😊', hunger: 0, happiness: 20, energy: 0, price: 15 },
  superFood: { name: 'Super Alimento', emoji: '🌟', hunger: 15, happiness: 15, energy: 15, price: 25 },
  miracleCure: { name: 'Cura Milagrosa', emoji: '✨', hunger: 25, happiness: 25, energy: 25, price: 40 }
}

// Provider del contexto de inventario
export const InventoryProvider = ({ children }) => {
  const { user } = useUser()
  
  // Estado del inventario
  const [inventory, setInventory] = useState({})
  const [coins, setCoins] = useState(0)

  // Efecto que se ejecuta cuando cambia el usuario
  useEffect(() => {
    if (user) {
      const savedInventory = localStorage.getItem(`mv:inventory:${user.id}`)
      const savedCoins = localStorage.getItem(`mv:coins:${user.id}`)
      
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory))
      } else {
        // Inventario inicial con comida básica
        const initialInventory = {
          apple: 1,
          orange: 1,
          cucumber: 1
        }
        setInventory(initialInventory)
      }
      
      if (savedCoins) {
        setCoins(parseInt(savedCoins))
      } else {
        setCoins(0)
      }
    }
  }, [user])

  // Guardado automático
  useEffect(() => {
    if (user) {
      localStorage.setItem(`mv:inventory:${user.id}`, JSON.stringify(inventory))
      localStorage.setItem(`mv:coins:${user.id}`, coins.toString())
    }
  }, [inventory, coins, user])

  // Agregar monedas
  const addCoins = (amount) => {
    setCoins(prev => prev + amount)
  }

  // Usar item del inventario
  const useItem = (itemType, amount = 1) => {
    if (!inventory[itemType] || inventory[itemType] < amount) {
      return false
    }
    
    setInventory(prev => ({
      ...prev,
      [itemType]: prev[itemType] - amount
    }))
    return true
  }

  // Comprar item
  const buyItem = (itemType, itemData, amount = 1) => {
    const totalPrice = itemData.price * amount
    if (coins < totalPrice) {
      return false
    }
    
    setCoins(prev => prev - totalPrice)
    setInventory(prev => ({
      ...prev,
      [itemType]: (prev[itemType] || 0) + amount
    }))
    return true
  }

  // Obtener efectos de un item
  const getItemEffects = (itemType, isMedicine = false) => {
    const items = isMedicine ? MEDICINE_TYPES : FOOD_TYPES
    return items[itemType]
  }

  // Verificar si se puede comprar un item
  const canAfford = (price) => {
    return coins >= price
  }

  // Obtener todos los items disponibles para la tienda
  const getShopItems = () => {
    return {
      food: FOOD_TYPES,
      medicine: MEDICINE_TYPES
    }
  }

  // Reset del inventario (para cuando la mascota muere)
  const resetInventory = () => {
    const initialInventory = {
      apple: 1,
      orange: 1,
      cucumber: 1
    }
    setInventory(initialInventory)
    setCoins(0)
  }

  const value = {
    inventory,
    coins,
    addCoins,
    useItem,
    buyItem,
    getItemEffects,
    canAfford,
    getShopItems,
    resetInventory
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}
