import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import BlockchainApp from './apps/blockchain-demo/BlockchainApp';
import CryptoApp from './apps/crypto-app/CryptoApp';
import EcdsaApp from './apps/ecdsa-demo/EcdsaApp';
import BlockchainBasicsApp from './apps/blockchain-basics/BlockchainBasicsApp';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const location = useLocation();
  
  const getFooterProps = () => {
    switch (location.pathname) {
      case '/blockchain':
        return {
          inspirationUrl: "https://andersbrownworth.com/blockchain/",
          inspirationText: "Inspired by Anders Brownworth's Blockchain Demo"
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Navigation />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blockchain" element={<BlockchainApp />} />
          <Route path="/crypto" element={<CryptoApp />} />
          <Route path="/ecdsa" element={<EcdsaApp />} />
          <Route path="/why-blockchain" element={<BlockchainBasicsApp />} />
        </Routes>
      </main>
      {location.pathname !== '/crypto' && <Footer {...getFooterProps()} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
