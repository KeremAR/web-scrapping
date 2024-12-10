'use client';
import { useState } from 'react';
import { FaLiraSign } from 'react-icons/fa'; // Fiyat
import { MdLocationPin } from 'react-icons/md'; // Konum
import { BsFillBuildingsFill } from 'react-icons/bs'; // Kat
import { FaRulerCombined } from 'react-icons/fa'; // m²
import { FaBed } from 'react-icons/fa'; // Oda Sayısı
import { RiBuilding2Line } from 'react-icons/ri'; // Bina Yaşı
import { FaTemperatureHigh } from 'react-icons/fa'; // Isıtma
import { FaBath } from 'react-icons/fa'; // Banyo
import { MdElevator } from 'react-icons/md'; // Asansör
import { FaCarAlt } from 'react-icons/fa'; // Otopark
import { MdChair } from 'react-icons/md'; // Eşyalı

import HouseImage from './HouseImage';

export default function HouseCard({ house, showPrice, currentImageIndex, setCurrentImageIndex }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const nextImage = () => {
    if (house.image_urls && house.image_urls.length > 0) {
      setCurrentImageIndex(prev => (prev === house.image_urls.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (house.image_urls && house.image_urls.length > 0) {
      setCurrentImageIndex(prev => (prev === 0 ? house.image_urls.length - 1 : prev - 1));
    }
  };

  const infoBoxStyle =
    'bg-navy-600 bg-opacity-5 p-2 sm:p-3 rounded-lg flex items-center justify-between hover:bg-opacity-10 transition-all duration-200';
  const textStyle = 'text-gray-700 flex items-center w-full text-xs sm:text-sm';

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-md">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold p-3 sm:p-4 text-gray-600 border-b">
        {house.title}
      </h2>

      {/* Image Slideshow */}
      <div className="relative aspect-video">
        {house.image_urls && house.image_urls.length > 0 && (
          <>
            <HouseImage
              src={house.image_urls[currentImageIndex]}
              alt={`${house.title} - Image ${currentImageIndex + 1}`}
            />
            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4">
              <button
                onClick={prevImage}
                className="bg-black/50 text-white p-1 sm:p-2 rounded-full hover:bg-black/70 transition text-sm sm:text-base"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="bg-black/50 text-white p-1 sm:p-2 rounded-full hover:bg-black/70 transition text-sm sm:text-base"
              >
                →
              </button>
            </div>
            {/* Image Counter */}
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 text-white px-2 py-1 rounded text-xs sm:text-sm">
              {currentImageIndex + 1} / {house.image_urls.length}
            </div>
          </>
        )}
      </div>

      {/* House Information */}
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
        {/* First Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 text-sm">
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <MdLocationPin className="inline-block mr-1 sm:mr-2" />
              {house.city} <span className="font-bold mx-1">/</span> {house.district}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaRulerCombined className="inline-block mr-1 sm:mr-2" />
              {house.square_gross} <span className="font-bold mx-1">/</span> {house.square_net}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaBed className="inline-block mr-1 sm:mr-2" />
              {house.rooms}
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 text-sm">
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <BsFillBuildingsFill className="inline-block mr-1 sm:mr-2" />
              {house.floor} <span className="font-bold mx-1">/</span> {house.building_floor}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaTemperatureHigh className="inline-block mr-1 sm:mr-2" />
              {house.heating}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaBath className="inline-block mr-1 sm:mr-2" />
              {house.bathroom}
            </p>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 text-sm">
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <RiBuilding2Line className="inline-block mr-1 sm:mr-2" />
              {house.age}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaCarAlt className="inline-block mr-1 sm:mr-2" />
              {house.parking?.toLowerCase() === 'evet' ? 'Otopark var' : 'Otopark yok'}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <MdChair className="inline-block mr-1 sm:mr-2" />
              {house.furnished?.toLowerCase() === 'yes' ? 'Eşyalı' : 'Eşyasız'}
            </p>
          </div>
        </div>

        {/* Price */}
        {showPrice && (
          <div className="border-t pt-2 sm:pt-4">
            <div className={`${infoBoxStyle} bg-green-100`}>
              <p className="text-center w-full text-lg sm:text-xl font-bold text-green-700">
                <FaLiraSign className="inline-block mr-1 sm:mr-2" />
                {house.price}
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="border-t pt-2">
          <p
            className={`text-xs sm:text-sm text-gray-700 w-full ${showFullDescription ? '' : 'line-clamp-3'}`}
          >
            {house.description}
          </p>
          {house.description && house.description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-navy-600 text-xs sm:text-sm mt-2 hover:text-navy-800 transition"
            >
              {showFullDescription ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
