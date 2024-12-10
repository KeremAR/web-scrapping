'use client'
import { useState, useEffect } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { FaLiraSign } from "react-icons/fa";


export default function PriceGuess({ actualPrice, onGameOver, gameOver, timeLeft }) {
  const [guessPrice, setGuessPrice] = useState('')
  const [gameStatus, setGameStatus] = useState(null)
  const [attempts, setAttempts] = useState(0)

  // Reset attempts and status when actualPrice changes (new car)
  useEffect(() => {
    setAttempts(0)
    setGameStatus(null)
    setGuessPrice('')
  }, [actualPrice])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR').format(price)
  }

  const handleInputChange = (e) => {
    // Remove all non-digits
    const numericValue = e.target.value.replace(/\D/g, '')
    
    // Check if the number exceeds 8 digits
    if (numericValue.length > 8) {
      return // Don't update if exceeds limit
    }
    
    // Convert to number and format
    if (numericValue) {
      const formattedValue = formatPrice(parseInt(numericValue))
      setGuessPrice(formattedValue)
    } else {
      setGuessPrice('')
    }
  }

  const adjustPrice = (amount) => {
    const currentPrice = parseInt(guessPrice.replace(/\D/g, '')) || 0
    const newPrice = currentPrice + amount
    
    // Check if the new price exceeds 8 digits
    if (newPrice.toString().length > 8) {
      return // Don't update if exceeds limit
    }
    
    setGuessPrice(formatPrice(newPrice))
  }

  const handleSubmit = () => {
    // Prevent submission if game is over or already made 2 attempts
    if (gameOver || attempts >= 2) return

    const guessValue = parseInt(guessPrice.replace(/\D/g, ''))
    const actualValue = parseInt(actualPrice.replace(/\D/g, ''))
    
    const difference = Math.abs(guessValue - actualValue)
    const percentageDiff = (difference / actualValue) * 100

    if (difference === 0) {
      setGameStatus('win')
      onGameOver() // End game if exact match
    } else if (percentageDiff <= 10) {
      setGameStatus('close')
    } else {
      setGameStatus('far')
    }

    setAttempts(prev => prev + 1)
    
    // If this was the second attempt, end the game
    if (attempts === 1) {
      onGameOver()
    }
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      {/* Attempts Bar */}
      <div className="mb-4">
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${(attempts / 2) * 100}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="font-semibold">Attempt {attempts}/2</span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Decrement Buttons (Left) */}
        <div className="space-y-2 flex flex-col">
          <button
            onClick={() => adjustPrice(-50000)}
            className="w-24 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            <span className="font-bold">-</span>{formatPrice(50000)}
          </button>
          <button
            onClick={() => adjustPrice(-100000)}
            className="w-24 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            <span className="font-bold">-</span>{formatPrice(100000)}
          </button>
          <button
            onClick={() => adjustPrice(-1000000)}
            className="w-24 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            <span className="font-bold">-</span>{formatPrice(1000000)}
          </button>
        </div>

        {/* Price Input with Submit Button */}
        <div className="flex-1 flex flex-col">
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center h-full">
              <FaLiraSign className="text-lg text-gray-500" />
            </div>
            <input
              type="text"
              value={guessPrice}
              onChange={handleInputChange}
              placeholder="Enter your price guess"
              className="w-full p-3 pl-12 pr-16 text-black h-20 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-600"
            />
            <div className="absolute right-4 flex items-center h-full">
              <button 
                onClick={handleSubmit}
                disabled={gameOver || attempts >= 2}
                className={`p-3 rounded-full transition-all duration-200 hover:scale-110
                  ${gameOver || attempts >= 2 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-navy-600 hover:bg-navy-800'} 
                  text-white`}
              >
                <FaArrowRight className="text-lg" />
              </button>
            </div>
          </div>

          {/* Game Status Message */}
          {gameStatus && (
            <div className={`mt-4 text-center text-lg font-semibold rounded-lg p-2
              ${gameStatus === 'win' ? 'bg-green-100 text-green-700' : 
                gameStatus === 'close' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}`}
            >
              {gameStatus === 'win' ? 'Congratulations! You got it exactly right!' :
               gameStatus === 'close' ? 'Very close! Try again!' :
               'Not quite there! Try again!'}
            </div>
          )}
        </div>

        {/* Increment Buttons (Right) */}
        <div className="space-y-2 flex flex-col">
          <button
            onClick={() => adjustPrice(50000)}
            className="w-24 p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
          >
            <span className="font-bold">+</span>{formatPrice(50000)}
          </button>
          <button
            onClick={() => adjustPrice(100000)}
            className="w-24 p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
          >
            <span className="font-bold">+</span>{formatPrice(100000)}
          </button>
          <button
            onClick={() => adjustPrice(1000000)}
            className="w-24 p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
          >
            <span className="font-bold">+</span>{formatPrice(1000000)}
          </button>
        </div>
      </div>

      {gameOver && (
        <div className="mt-4 text-center text-lg font-semibold text-red-600">
          Time's up! The actual price was {actualPrice}
        </div>
      )}
    </div>
  )
} 