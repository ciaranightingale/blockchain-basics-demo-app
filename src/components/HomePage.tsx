import { Link } from 'react-router-dom';
import { Blocks, Coins, Key, ArrowRight, AlertCircle } from 'lucide-react';

const HomePage = () => {
  const apps = [
    {
      title: 'Why Blockchain',
      description: 'Experience real-world problems with traditional finance that blockchain solves.',
      path: '/why-blockchain',
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      title: 'Blockchain Demo',
      description: 'Learn about blockchain fundamentals, consensus mechanisms, and .',
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Updraft Learning Hub
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base max-w-3xl mx-auto">
          Interactive demonstrations to learn blockchain technology, cryptography, and decentralized finance
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
        {apps.map((app) => (
          <Link
            key={app.path}
            to={app.path}
            className="group block p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-full ${app.color} text-white shadow-lg`}>
                <app.icon size={32} className="sm:w-10 sm:h-10" />
              </div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">
              {app.title}
            </h3>
            
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-center leading-relaxed">
              {app.description}
            </p>
            
            <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors font-medium">
              <span className="mr-2">Learn More</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;