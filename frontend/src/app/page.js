'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-4 tracking-tight">
            Fiyat Tahmin Oyunu
            <span className="ml-2 inline-block bg-red-500 text-white px-3 py-1 rounded-lg text-sm md:text-lg transform -rotate-2">OFFLINE BETA</span>
          </h1>
          
          <p className="text-xl text-center text-gray-200 mb-16 max-w-2xl mx-auto">
            Hangi kategoride fiyat tahmin etmek istersiniz?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Cars Option */}
            <button
              onClick={() => router.push('/cars')}
              className="group relative bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-2">Otomobil</h2>
                <p className="text-gray-300 text-center">Araç fiyatlarını tahmin edin</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>

            {/* Houses Option */}
            <button
              onClick={() => router.push('/houses')}
              className="group relative bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-2">Kiralık Evler</h2>
                <p className="text-gray-300 text-center">Ev kiralarını tahmin edin</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
