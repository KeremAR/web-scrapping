'use client';
import { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { FaLiraSign } from 'react-icons/fa';

export default function HousePriceGuess({ actualPrice, onGameOver, gameOver, timeLeft }) {
  const [guessPrice, setGuessPrice] = useState('');
  const [gameStatus, setGameStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setAttempts(0);
    setGameStatus(null);
    setGuessPrice('');
  }, [actualPrice]);

  const formatPrice = price => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const handleInputChange = e => {
    const numericValue = e.target.value.replace(/\D/g, '');
    if (numericValue.length > 8) {
      return;
    }
    if (numericValue) {
      const formattedValue = formatPrice(parseInt(numericValue));
      setGuessPrice(formattedValue);
    } else {
      setGuessPrice('');
    }
  };

  const adjustPrice = amount => {
    const currentPrice = parseInt(guessPrice.replace(/\D/g, '')) || 0;
    const newPrice = currentPrice + amount;
    if (newPrice.toString().length > 8) {
      return;
    }
    setGuessPrice(formatPrice(newPrice));
  };

  const handleSubmit = () => {
    if (gameOver || attempts >= 2) return;

    const guessValue = parseInt(guessPrice.replace(/\D/g, ''));
    const actualValue = parseInt(actualPrice.replace(/\D/g, ''));

    const difference = Math.abs(guessValue - actualValue);
    const percentageDiff = (difference / actualValue) * 100;

    if (difference === 0) {
      setGameStatus('win');
      onGameOver();
    } else if (percentageDiff <= 10) {
      setGameStatus('close');
    } else {
      setGameStatus('far');
    }

    setAttempts(prev => prev + 1);

    if (attempts === 1) {
      onGameOver();
    }
  };

  return (
    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg shadow-md">
      <div className="mb-3 sm:mb-4">
        <div className="bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${(attempts / 2) * 100}%` }}
          />
        </div>
        <div className="text-center mt-1 sm:mt-2">
          <span className="text-xs sm:text-sm font-semibold">Attempt {attempts}/2</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
          <button
            onClick={() => adjustPrice(-500)}
            className="w-20 sm:w-24 p-1 sm:p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
          >
            <span className="font-bold">-</span>
            {formatPrice(500)}
          </button>
          <button
            onClick={() => adjustPrice(-1000)}
            className="w-20 sm:w-24 p-1 sm:p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
          >
            <span className="font-bold">-</span>
            {formatPrice(1000)}
          </button>
          <button
            onClick={() => adjustPrice(-5000)}
            className="w-20 sm:w-24 p-1 sm:p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
          >
            <span className="font-bold">-</span>
            {formatPrice(5000)}
          </button>
        </div>

        <div className="flex-1 w-full sm:w-auto">
          <div className="relative flex items-center">
            <div className="absolute left-2 sm:left-4 flex items-center h-full">
              <FaLiraSign className="text-base sm:text-lg text-gray-500" />
            </div>
            <input
              type="text"
              value={guessPrice}
              onChange={handleInputChange}
              placeholder="Enter your price guess"
              className="w-full p-2 sm:p-3 pl-8 sm:pl-12 pr-12 sm:pr-16 text-black h-12 sm:h-20 text-center text-lg sm:text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-600"
            />
            <div className="absolute right-2 sm:right-4 flex items-center h-full">
              <button
                onClick={handleSubmit}
                disabled={gameOver || attempts >= 2}
                className={`p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110
                  ${
                    gameOver || attempts >= 2
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-navy-600 hover:bg-navy-800'
                  } 
                  text-white`}
              >
                <FaArrowRight className="text-base sm:text-xl" />
              </button>
            </div>
          </div>

          {gameStatus && (
            <div
              className={`mt-3 sm:mt-4 text-center text-sm sm:text-lg font-semibold rounded-lg p-2
              ${
                gameStatus === 'win'
                  ? 'bg-green-100 text-green-700'
                  : gameStatus === 'close'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {gameStatus === 'win'
                ? 'Congratulations! You got it exactly right!'
                : gameStatus === 'close'
                  ? 'Very close! Try again!'
                  : 'Not quite there! Try again!'}
            </div>
          )}
        </div>

        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
          <button
            onClick={() => adjustPrice(500)}
            className="w-20 sm:w-24 p-1 sm:p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-xs sm:text-sm"
          >
            <span className="font-bold">+</span>
            {formatPrice(500)}
          </button>
          <button
            onClick={() => adjustPrice(1000)}
            className="w-20 sm:w-24 p-1 sm:p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-xs sm:text-sm"
          >
            <span className="font-bold">+</span>
            {formatPrice(1000)}
          </button>
          <button
            onClick={() => adjustPrice(5000)}
            className="w-20 sm:w-24 p-1 sm:p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-xs sm:text-sm"
          >
            <span className="font-bold">+</span>
            {formatPrice(5000)}
          </button>
        </div>
      </div>
    </div>
  );
}
