'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import HouseCard from '@/components/HouseCard';
import PriceGuess from '@/components/PriceGuess';

export default function HousesGame() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHouse, setCurrentHouse] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showingResults, setShowingResults] = useState(false);

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleGameOver = useCallback(() => {
    setGameOver(true);
    setShowingResults(true);

    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * houses.length);
      const newHouse = houses[newIndex];

      if (newHouse.id === currentHouse?.id && houses.length > 1) {
        const nextIndex = (newIndex + 1) % houses.length;
        setCurrentHouse(houses[nextIndex]);
      } else {
        setCurrentHouse(newHouse);
      }

      setGameOver(false);
      setShowingResults(false);
      setTimeLeft(15);
    }, 5000);
  }, [houses, currentHouse]);

  useEffect(() => {
    if (houses.length > 0 && !currentHouse) {
      const randomIndex = Math.floor(Math.random() * houses.length);
      setCurrentHouse(houses[randomIndex]);
    }
  }, [houses, currentHouse]);

  useEffect(() => {
    if (timeLeft > 0 && !showingResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
  }, [timeLeft, showingResults, handleGameOver]);

  async function fetchHouses() {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHouses(data || []);
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        {currentHouse && (
          <>
            {/* Timer Bar - Now Sticky */}
            <div className="sticky top-5 z-50">
              <div className="mb-2 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-navy-600 transition-all duration-1000"
                  style={{
                    width: `${(timeLeft / 15) * 100}%`,
                    backgroundColor: timeLeft <= 5 ? '#ef4444' : undefined,
                  }}
                />
              </div>
              <div className="flex justify-center">
                <div className="inline-block bg-white px-3 py-1 rounded-full shadow-sm">
                  <span className="text-sm font-semibold text-gray-700">
                    {showingResults ? 'Next house in 5 seconds...' : `Time Left: ${timeLeft}s`}
                  </span>
                </div>
              </div>
            </div>

            {/* Add some padding to prevent content jump when timer becomes sticky */}
            <div className="mt-4">
              <HouseCard house={currentHouse} showPrice={gameOver} />
              <PriceGuess
                actualPrice={currentHouse.price}
                onGameOver={handleGameOver}
                gameOver={gameOver}
                timeLeft={timeLeft}
              />

              {gameOver && (
                <div className="mt-4 text-center">
                  <p className="text-xl font-bold mb-2">Time&apos;s up!</p>
                  <p className="text-lg">Actual Price: {currentHouse.price}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
