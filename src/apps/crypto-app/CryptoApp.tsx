import { useState, useEffect } from 'react';
import ProgressIndicator from './ProgressIndicator';
import CompletionModal from './CompletionModal';
import WalletDemo from './WalletDemo';
import DexDemo from './DexDemo';
import NFTDemo from './NFTDemo';
import StakingDemo from './StakingDemo';

const CryptoDemoApp = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [completedActions, setCompletedActions] = useState({
    wallet: false,
    dex: false,
    staking: { staked: false, claimed: false }
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const demos = [
    {
      id: 'wallet',
      title: 'Crypto Wallet',
      description: 'Send and receive transactions',
      component: WalletDemo
    },
    {
      id: 'dex',
      title: 'DEX Trading',
      description: 'Decentralized exchange demo',
      component: DexDemo
    },
    // {
    //   id: 'nft',
    //   title: 'NFT Marketplace',
    //   description: 'Buy and sell NFTs',
    //   component: NFTDemo
    // },
    {
      id: 'staking',
      title: 'DeFi Staking',
      description: 'Stake tokens and earn rewards',
      component: StakingDemo
    }
  ];

  // Check if all required actions are completed
  const isFullyCompleted = () => {
    return completedActions.wallet && 
           completedActions.dex && 
           completedActions.staking.staked && 
           completedActions.staking.claimed;
  };

  // Check completion status for each demo
  const getDemoCompletionStatus = (demoId) => {
    switch (demoId) {
      case 'wallet':
        return completedActions.wallet;
      case 'dex':
        return completedActions.dex;
      case 'nft':
        return true; // NFT demo doesn't have completion requirements
      case 'staking':
        return completedActions.staking.staked && completedActions.staking.claimed;
      default:
        return false;
    }
  };

  // Mark action as completed
  const markCompleted = (action, subAction = null) => {
    setCompletedActions(prev => {
      const newState = { ...prev };
      
      if (subAction) {
        newState[action] = { ...prev[action], [subAction]: true };
      } else {
        newState[action] = true;
      }
      
      return newState;
    });
  };

  // Check if we should show completion modal
  useEffect(() => {
    if (isFullyCompleted() && !showCompletionModal) {
      // Add a small delay for better UX
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 1000);
    }
  }, [completedActions, showCompletionModal]);

  const nextDemo = () => {
    if (currentDemo < demos.length - 1) {
      setCurrentDemo(currentDemo + 1);
    }
  };

  const prevDemo = () => {
    if (currentDemo > 0) {
      setCurrentDemo(currentDemo - 1);
    }
  };

  const goToDemo = (index) => {
    setCurrentDemo(index);
  };

  const CurrentDemoComponent = demos[currentDemo].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Crypto Demo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Interactive demonstrations of crypto wallets, DEX trading, and DeFi staking
        </p>
        
        {/* Central Tab Navigation */}
        <div className="flex justify-center mb-8">
          <nav className="flex flex-wrap justify-center space-x-1 bg-white rounded-lg p-1 shadow-md">
            {demos.map((demo, index) => (
              <button
                key={demo.id}
                onClick={() => goToDemo(index)}
                className={`px-4 py-3 rounded-md font-medium transition-all text-sm ${
                  currentDemo === index
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="pb-32"> {/* Add padding bottom for fixed navigation */}
          <CurrentDemoComponent onActionCompleted={markCompleted} />
        </div>

        <ProgressIndicator 
          demos={demos}
          currentDemo={currentDemo}
          nextDemo={nextDemo}
          prevDemo={prevDemo}
          getDemoCompletionStatus={getDemoCompletionStatus}
        />

        <CompletionModal 
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
        />
      </div>
    </div>
  );
};

export default CryptoDemoApp;