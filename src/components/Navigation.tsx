import { Link, useLocation } from 'react-router-dom';
import { Home, Blocks, Coins, Key } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/blockchain', label: 'Blockchain Demo', icon: Blocks },
    { path: '/crypto', label: 'Crypto Demo', icon: Coins },
    { path: '/ecdsa', label: 'ECDSA Signatures', icon: Key },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/src/assets/cyfrin.png" 
              alt="Cyfrin Logo" 
              className="w-8"
            />
            <span className="text-xl font-bold text-gray-800">
              Blockchain Learning Hub
            </span>
          </Link>
          
          <div className="flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;