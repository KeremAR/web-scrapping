'use client';
import { useState } from 'react';
import { MdLocationPin } from 'react-icons/md';
import {
  FaCalendarAlt,
  FaLiraSign,
  FaRulerCombined,
  FaBed,
  FaBath,
  FaTemperatureHigh,
} from 'react-icons/fa';
import { MdElevator, MdLocalParking } from 'react-icons/md';
import { BsFillBuildingsFill } from 'react-icons/bs';
import HouseImage from './HouseImage';

export default function HouseCard({ house, showPrice }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const nextImage = () => {
    if (house.image_urls && house.image_urls.length > 0) {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % house.image_urls.length);
    }
  };

  const prevImage = () => {
    if (house.image_urls && house.image_urls.length > 0) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === 0 ? house.image_urls.length - 1 : prevIndex - 1
      );
    }
  };

  const infoBoxStyle =
    'bg-navy-600 bg-opacity-5 p-3 rounded-lg flex items-center justify-between hover:bg-opacity-10 transition-all duration-200';
  const textStyle = 'text-gray-700 flex items-center w-full';

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-md">
      {/* Title */}
      <h2 className="text-xl font-semibold p-4 text-gray-600 border-b">{house.title}</h2>

      {/* Image Slideshow */}
      <div className="relative aspect-video">
        {house.image_urls && house.image_urls.length > 0 && (
          <>
            <HouseImage
              src={house.image_urls[currentImageIndex]}
              alt={`${house.title} - Image ${currentImageIndex + 1}`}
            />
            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={prevImage}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                →
              </button>
            </div>
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentImageIndex + 1} / {house.image_urls.length}
            </div>
          </>
        )}
      </div>

      {/* House Information */}
      <div className="p-4 space-y-4">
        {/* First Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <MdLocationPin className="inline-block mr-2" /> {house.city}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaCalendarAlt className="inline-block mr-2" /> {house.listing_date}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaRulerCombined className="inline-block mr-2" /> {house.square_gross} m²
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaBed className="inline-block mr-2" /> {house.rooms}
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <BsFillBuildingsFill className="inline-block mr-2" /> {house.floor}. Kat
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaTemperatureHigh className="inline-block mr-2" /> {house.heating}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaBath className="inline-block mr-2" /> {house.bathroom}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <MdElevator className="inline-block mr-2" /> {house.elevator}
            </p>
          </div>
        </div>

        {/* Price (only shown when showPrice is true) */}
        {showPrice && (
          <div className="border-t pt-4">
            <div className={`${infoBoxStyle} bg-green-100`}>
              <p className="text-center w-full text-xl font-bold text-green-700">
                <FaLiraSign className="inline-block mr-2" /> {house.price}
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="border-t pt-2">
          <p
            className={`text-sm text-gray-700 w-full ${showFullDescription ? '' : 'line-clamp-3'}`}
          >
            {house.description}
          </p>
          {house.description && house.description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-navy-600 text-sm mt-2 hover:text-navy-800 transition"
            >
              {showFullDescription ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
