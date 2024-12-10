'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Card from '@/components/Card'
import PriceGuess from '@/components/PriceGuess'

export default function Home() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentCar, setCurrentCar] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15) // Changed to 15 seconds
  const [showingResults, setShowingResults] = useState(false)

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    if (cars.length > 0 && !currentCar) {
      const randomIndex = Math.floor(Math.random() * cars.length)
      setCurrentCar(cars[randomIndex])
    }
  }, [cars])

  useEffect(() => {
    if (timeLeft > 0 && !showingResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      handleGameOver()
    }
  }, [timeLeft, showingResults])

  async function fetchCars() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCars(data || [])
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGameOver = () => {
    setGameOver(true)
    setShowingResults(true)
    
    // After 5 seconds, move to next car
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * cars.length)
      const newCar = cars[newIndex]
      
      // Make sure we don't get the same car
      if (newCar.id === currentCar.id && cars.length > 1) {
        const nextIndex = (newIndex + 1) % cars.length
        setCurrentCar(cars[nextIndex])
      } else {
        setCurrentCar(newCar)
      }
      
      setGameOver(false)
      setShowingResults(false)
      setTimeLeft(15)
    }, 5000)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <main className="container mx-auto p-4">
      
      <div className="max-w-3xl mx-auto">
        {currentCar && (
          <>
            {/* Timer Bar */}
            <div className="mb-2 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-navy-600 transition-all duration-1000"
                style={{ 
                  width: `${(timeLeft / 15) * 100}%`,
                  backgroundColor: timeLeft <= 5 ? '#ef4444' : undefined
                }}
              />
            </div>
            <div className="text-center mb-4 font-semibold text-black">
              {showingResults ? 'Next car in 5 seconds...' : `Time Left: ${timeLeft} seconds`}
            </div>

            <Card car={currentCar} showPrice={gameOver} />
            <PriceGuess 
              actualPrice={currentCar.price} 
              onGameOver={handleGameOver}
              gameOver={gameOver}
              timeLeft={timeLeft}
            />

            {gameOver && (
              <div className="mt-4 text-center">
                <p className="text-xl font-bold mb-2">Time's up!</p>
                <p className="text-lg">Actual Price: {currentCar.price}</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
