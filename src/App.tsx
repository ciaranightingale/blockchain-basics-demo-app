import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import BlockchainApp from './apps/blockchain-demo/BlockchainApp';
import CryptoApp from './apps/crypto-app/CryptoApp';
import EcdsaApp from './apps/ecdsa-demo/EcdsaApp';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blockchain" element={<BlockchainApp />} />
            <Route path="/crypto" element={<CryptoApp />} />
            <Route path="/ecdsa" element={<EcdsaApp />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
