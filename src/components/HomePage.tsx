import { Link } from 'react-router-dom';
import { Blocks, Coins, Key, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const apps = [
    {
      title: 'Blockchain Demo',
      description: 'Learn about blockchain fundamentals, consensus mechanisms, and mining.',
      path: '/blockchain',
      icon: Blocks,
      color: 'bg-blue-500',
    },
    {
      title: 'Crypto Demo',
      description: 'Explore cryptocurrency wallets, DEX trading, NFTs, and staking.',
      path: '/crypto',
      icon: Coins,
      color: 'bg-green-500',
    },
    {
      title: 'ECDSA Signatures',
      description: 'Understand cryptographic signatures, key generation, and verification.',
      path: '/ecdsa',
      icon: Key,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
        Blockchain Learning Hub
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Interactive demonstrations to learn blockchain technology, cryptography, and decentralized finance
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {apps.map((app) => (
          <Link
            key={app.path}
            to={app.path}
            className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-center mb-6">
              <div className={`p-4 rounded-full ${app.color} text-white shadow-lg`}>
                <app.icon size={40} />
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              {app.title}
            </h3>
            
            <p className="text-gray-600 mb-6 text-center leading-relaxed">
              {app.description}
            </p>
            
            <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-800 transition-colors font-medium">
              <span className="mr-2">Learn More</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;