'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen relative">
      {/* Background Image with Blur */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/messi.jpg"
          alt="Messi Background"
          fill
          style={{ objectFit: 'cover' }}
          className="blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-8">
            Fiyat Tahmin Oyunu<span className="text-red-500"> OFFLINE BETA</span>
          </h1>
          <p className="text-xl text-center text-gray-300 mb-16">
            Hangi kategoride fiyat tahmin etmek istersiniz?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Cars Option */}
            <button
              onClick={() => router.push('/cars')}
              className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Otomobil</h2>
                <p className="text-gray-600 text-center">Araç fiyatlarını tahmin edin</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>

            {/* Houses Option */}
            <button
              onClick={() => router.push('/houses')}
              className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Kiralık Evler</h2>
                <p className="text-gray-600 text-center">Ev kiralarını tahmin edin</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
