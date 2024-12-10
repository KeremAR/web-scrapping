'use client';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 mb-4 text-navy-600 hover:text-navy-800 transition-colors"
    >
      <IoArrowBack className="text-xl" />
      <span>Geri Dön</span>
    </button>
  );
}
