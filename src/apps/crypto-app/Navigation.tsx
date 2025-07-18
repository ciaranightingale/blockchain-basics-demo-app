// src/components/Navigation.jsx
import { Wallet, ArrowRightLeft, Image, Coins } from 'lucide-react';

const Navigation = ({ demos, currentDemo, goToDemo }) => {
  const getIcon = (demoId) => {
    switch (demoId) {
      case 'wallet': return <Wallet className="w-5 h-5" />;
      case 'dex': return <ArrowRightLeft className="w-5 h-5" />;
      case 'nft': return <Image className="w-5 h-5" />;
      case 'staking': return <Coins className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg flex items-center justify-center">
              <img 
                src="src/assets/cyfrin.png" 
                alt="DeFi Logo" 
                className="w-8"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Blockchain Demo Suite</h1>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {demos.map((demo, index) => (
              <button
                key={demo.id}
                onClick={() => goToDemo(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentDemo === index
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {getIcon(demo.id)}
                <span className="font-medium">{demo.title}</span>
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              {getIcon(demos[currentDemo].id)}
              <span className="font-medium text-gray-900">
                {demos[currentDemo].title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;