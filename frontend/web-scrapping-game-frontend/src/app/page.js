'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-600 to-navy-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-8">
          Fiyat Tahmin Oyunu
        </h1>
        <p className="text-xl text-center text-gray-300 mb-16">
          Hangi kategoride fiyat tahmin etmek istersiniz?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Cars Option */}
          <button
            onClick={() => router.push('/cars')}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="text-navy-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.739 10.921c-1.347-.39-1.885-.538-3.552-.921 0 0-2.379-2.359-2.832-2.816-.568-.572-1.043-1.184-2.949-1.184h-7.894c-2.5 0-2.5 1.927-2.5 1.927l-1.733 4.073h-1.279v2.5h1.279c0 .48.333.901.858 1.001l1.746 6.666h13.239l1.746-6.666c.526-.1.858-.521.858-1.001h1.279v-2.5h-1.279l.016-.627c.976.291 2.029.6 2.846.83.404.116.764-.256.764-.627 0-.37-.36-.742-.764-.627zm-16.739 1.579h2.596l1.336-3c.19-.436.667-.757 1.159-.757h7.812l2.336 2.321-.177.679h-15.062zm.785 7h12.43l-1.337-5h-9.756l-1.337 5zm13.215-11.495c-1.145-.345-2.291-.681-3.436-1.003-.395-.106-.846.24-.846.659s.452.764.846.659c1.145-.322 2.291-.659 3.436-1.003.395-.113.846-.233.846-.652s-.451-.773-.846-.66z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Otomobil</h2>
              <p className="text-gray-600 text-center">Araç fiyatlarını tahmin edin</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>

          {/* Houses Option */}
          <button
            onClick={() => router.push('/houses')}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-8">
              <div className="text-navy-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Kiralık Evler</h2>
              <p className="text-gray-600 text-center">Ev kiralarını tahmin edin</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </main>
  );
}
