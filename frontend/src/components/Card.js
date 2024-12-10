'use client';
import { useState } from 'react';
import { TbManualGearbox } from 'react-icons/tb';
import { TbAutomaticGearbox } from 'react-icons/tb';
import { BsFuelPump } from 'react-icons/bs';
import { MdOutlineSpeed } from 'react-icons/md';
import { FaLiraSign } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoLogoModelS } from 'react-icons/io';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { BsFillExclamationTriangleFill } from 'react-icons/bs';
import { SiBmw, SiFiat, SiMercedes, SiFord, SiAudi } from 'react-icons/si';
import CarImage from './CarImage';

export default function Card({ car, showPrice, currentImageIndex, setCurrentImageIndex }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getBrandIcon = brand => {
    switch (brand.toLowerCase()) {
      case 'bmw':
        return <SiBmw className="inline-block mr-2" />;
      case 'fiat':
        return <SiFiat className="inline-block mr-2" />;
      case 'mercedes':
        return <SiMercedes className="inline-block mr-2" />;
      case 'ford':
        return <SiFord className="inline-block mr-2" />;
      case 'audi':
        return <SiAudi className="inline-block mr-2" />;
      default:
        return null;
    }
  };

  const getGearIcon = gearType => {
    if (gearType.toLowerCase().includes('otomatik')) {
      return <TbAutomaticGearbox className="inline-block mr-2" />;
    }
    if (gearType.toLowerCase().includes('manuel')) {
      return <TbManualGearbox className="inline-block mr-2" />;
    }
    return null;
  };

  const nextImage = () => {
    if (car.image_urls && car.image_urls.length > 0) {
      setCurrentImageIndex(prev => (prev === car.image_urls.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (car.image_urls && car.image_urls.length > 0) {
      setCurrentImageIndex(prev => (prev === 0 ? car.image_urls.length - 1 : prev - 1));
    }
  };

  const getGuaranteeStatus = status => {
    if (!status) return 'Bilgi Yok';
    return status.toLowerCase() === 'evet' ? 'Garantisi Var' : 'Garantisi Yok';
  };

  const getDamageStatus = status => {
    if (!status) return 'Bilgi Yok';
    return status.toLowerCase() === 'evet' ? 'Ağır Hasarlı' : 'Hasar Kaydı Yok';
  };

  const infoBoxStyle =
    'bg-navy-600 bg-opacity-5 p-2 sm:p-3 rounded-lg flex items-center justify-between hover:bg-opacity-10 transition-all duration-200';
  const textStyle = 'text-gray-700 flex items-center w-full text-xs sm:text-sm';

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-md">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold p-3 sm:p-4 text-gray-600 border-b">
        {car.title}
      </h2>

      {/* Image Slideshow */}
      <div className="relative aspect-video">
        {car.image_urls && car.image_urls.length > 0 && (
          <>
            <CarImage
              src={car.image_urls[currentImageIndex]}
              alt={`${car.title} - Image ${currentImageIndex + 1}`}
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
              {currentImageIndex + 1} / {car.image_urls.length}
            </div>
          </>
        )}
      </div>

      {/* Car Information */}
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
        {/* First Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-sm">
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              {getBrandIcon(car.brand)} {car.brand}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <IoLogoModelS className="inline-block mr-1 sm:mr-2" /> {car.model}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <FaCalendarAlt className="inline-block mr-1 sm:mr-2" /> {car.year}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <MdLocationPin className="inline-block mr-1 sm:mr-2" /> {car.location}
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-sm">
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <BsFuelPump className="inline-block mr-1 sm:mr-2" /> {car.fuel_type}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <MdOutlineSpeed className="inline-block mr-1 sm:mr-2" /> {car.kilometers} km
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              {getGearIcon(car.gear_type)} {car.gear_type}
            </p>
          </div>
          <div className={infoBoxStyle}>
            <p className={textStyle}>
              <BsFillExclamationTriangleFill className="inline-block mr-1 sm:mr-2" />
              {getDamageStatus(car.damage_status)}
            </p>
          </div>
        </div>

        {/* Price */}
        {showPrice && (
          <div className="border-t pt-2 sm:pt-4">
            <div className={`${infoBoxStyle} bg-green-100`}>
              <p className="text-center w-full text-lg sm:text-xl font-bold text-green-700">
                <FaLiraSign className="inline-block mr-1 sm:mr-2" /> {car.price}
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="border-t pt-2">
          <p
            className={`text-xs sm:text-sm text-gray-700 w-full ${showFullDescription ? '' : 'line-clamp-3'}`}
          >
            {car.description}
          </p>
          {car.description && car.description.length > 150 && (
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
