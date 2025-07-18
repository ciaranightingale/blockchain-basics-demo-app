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
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Blockchain Learning Hub
        </h1>
        <p className="text-xl text-gray-600">
          Interactive demonstrations to learn blockchain technology, cryptography, and decentralized finance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {apps.map((app) => (
          <Link
            key={app.path}
            to={app.path}
            className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full ${app.color} text-white`}>
                <app.icon size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              {app.title}
            </h3>
            
            <p className="text-gray-600 mb-4 text-center">
              {app.description}
            </p>
            
            <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-800 transition-colors">
              <span className="mr-2">Learn More</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About This Hub
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            This learning hub provides hands-on demonstrations of blockchain technology concepts. 
            Each application focuses on different aspects of the blockchain ecosystem, from basic 
            blockchain mechanics to advanced cryptographic concepts and DeFi interactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;