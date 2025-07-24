// src/demos/StakingDemo.jsx
import { useState } from 'react';
import { PiggyBank, TrendingUp, Clock, Award, Plus, Minus } from 'lucide-react';
import TransactionModal from './TransactionModal';
import { useToast } from '../../components/Toast';

interface StakingPool {
  id: string;
  token: string;
  name: string;
  apy: number;
  tvl: string;
  minStake: number;
  lockPeriod: string;
  color: string;
  description: string;
  riskLevel: string;
}

interface UserStake {
  amount: number;
  rewards: number;
  timeStaked: number;
}

interface UserBalances {
  ETH: number;
  USDC: number;
  UNI: number;
  LINK: number;
  [key: string]: number;
}

interface UserStakes {
  'ETH-STAKE': UserStake;
  'USDC-STAKE': UserStake;
  'UNI-STAKE': UserStake;
  'LINK-STAKE': UserStake;
  [key: string]: UserStake;
}

interface TransactionData {
  from: string;
  to: string;
  action: string;
  amount: string;
  fee: string;
  total: string;
  details: string[];
}

interface StakingDemoProps {
  onActionCompleted: (action: string, type?: string) => void;
}

const StakingDemo = ({ onActionCompleted }: StakingDemoProps) => {
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = useState<string>('');
  const [showStakeModal, setShowStakeModal] = useState<boolean>(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState<boolean>(false);
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<string>(''); // 'stake', 'unstake', 'claim'
  
  // Error states for inline validation
  const [stakeAmountError, setStakeAmountError] = useState<string>('');
  const [unstakeAmountError, setUnstakeAmountError] = useState<string>('');

  const { showToast } = useToast();

  const [userBalances, setUserBalances] = useState<UserBalances>({
    ETH: 5.25,
    USDC: 12500,
    UNI: 450,
    LINK: 230
  });

  const [userStakes, setUserStakes] = useState<UserStakes>({
    'ETH-STAKE': { amount: 2.5, rewards: 0.125, timeStaked: Date.now() - 86400000 * 30 },
    'USDC-STAKE': { amount: 5000, rewards: 125.5, timeStaked: Date.now() - 86400000 * 15 },
    'UNI-STAKE': { amount: 0, rewards: 0, timeStaked: 0 },
    'LINK-STAKE': { amount: 100, rewards: 8.75, timeStaked: Date.now() - 86400000 * 7 }
  });

  // Mock staking pools
  const stakingPools: StakingPool[] = [
    {
      id: 'ETH-STAKE',
      token: 'ETH',
      name: 'Ethereum Staking',
      apy: 5.2,
      tvl: '$2.1B',
      minStake: 0.1,
      lockPeriod: '7 days',
      color: 'from-purple-500 to-purple-600',
      description: 'Stake ETH and earn rewards while securing the network',
      riskLevel: 'Low'
    },
    {
      id: 'USDC-STAKE',
      token: 'USDC',
      name: 'USDC Yield Farming',
      apy: 8.7,
      tvl: '$850M',
      minStake: 100,
      lockPeriod: '14 days',
      color: 'from-blue-500 to-blue-600',
      description: 'Earn high yield on your stablecoin holdings',
      riskLevel: 'Low'
    },
    {
      id: 'UNI-STAKE',
      token: 'UNI',
      name: 'Uniswap Staking',
      apy: 15.3,
      tvl: '$420M',
      minStake: 10,
      lockPeriod: '30 days',
      color: 'from-pink-500 to-pink-600',
      description: 'Provide liquidity and earn UNI rewards',
      riskLevel: 'Medium'
    },
    {
      id: 'LINK-STAKE',
      token: 'LINK',
      name: 'Chainlink Staking',
      apy: 12.1,
      tvl: '$315M',
      minStake: 5,
      lockPeriod: '21 days',
      color: 'from-blue-400 to-blue-500',
      description: 'Stake LINK tokens to secure oracle networks',
      riskLevel: 'Medium'
    }
  ];

  const formatTime = (timestamp: number): string => {
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const calculateProjectedRewards = (amount: string, apy: number, days: number = 365): string => {
    return (parseFloat(amount) * (apy / 100) * (days / 365)).toFixed(6);
  };

  const handleStake = (): void => {
    if (!selectedPool) return;
    
    const amount = parseFloat(stakeAmount);
    
    // Clear previous errors
    setStakeAmountError('');
    
    if (!stakeAmount || amount <= 0) {
      setStakeAmountError('Please enter a valid amount');
      return;
    }

    if (amount < selectedPool.minStake) {
      setStakeAmountError(`Minimum stake amount is ${selectedPool.minStake} ${selectedPool.token}`);
      return;
    }

    if (amount > userBalances[selectedPool.token]) {
      setStakeAmountError('Insufficient balance');
      return;
    }

    // Prepare transaction data
    const txData = {
      from: '0x742d35Cc7B4C4532CaCd8beCcBE3e5e4A78B14da3eC73ac',
      to: `${selectedPool.name} Contract`,
      action: `Stake ${amount} ${selectedPool.token}`,
      amount: `${amount} ${selectedPool.token}`,
      fee: '~$3.20',
      total: `${amount} ${selectedPool.token}`,
      details: [
        `Nonce: ${Math.floor(Math.random() * 1000000)}`,
        `Gas Price: 25 Gwei`,
        `Gas Limit: 180000`,
        `APY: ${selectedPool.apy}%`,
        `Lock Period: ${selectedPool.lockPeriod}`
      ]
    };

    setTransactionData(txData);
    setCurrentAction('stake');
    setShowStakeModal(false);
    setShowTransactionModal(true);
  };

  const handleUnstake = (): void => {
    if (!selectedPool) return;
    
    const amount = parseFloat(unstakeAmount);
    
    // Clear previous errors
    setUnstakeAmountError('');
    
    if (!unstakeAmount || amount <= 0) {
      setUnstakeAmountError('Please enter a valid amount');
      return;
    }
    
    if (amount > userStakes[selectedPool.id].amount) {
      setUnstakeAmountError('Amount exceeds staked balance');
      return;
    }

    // Prepare transaction data
    const txData = {
      from: '0x742d35Cc7B4C4532CaCd8beCcBE3e5e4A78B14da3eC73ac',
      to: `${selectedPool.name} Contract`,
      action: `Unstake ${amount} ${selectedPool.token}`,
      amount: `${amount} ${selectedPool.token}`,
      fee: '~$2.80',
      total: `${amount} ${selectedPool.token}`,
      details: [
        `Nonce: ${Math.floor(Math.random() * 1000000)}`,
        `Gas Price: 22 Gwei`,
        `Gas Limit: 160000`,
        `Lock Period: ${selectedPool.lockPeriod}`,
        `Remaining Stake: ${(userStakes[selectedPool.id].amount - amount).toFixed(4)} ${selectedPool.token}`
      ]
    };

    setTransactionData(txData);
    setCurrentAction('unstake');
    setShowUnstakeModal(false);
    setShowTransactionModal(true);
  };

  const claimRewards = (poolId: string): void => {
    const rewards = userStakes[poolId].rewards;
    const pool = stakingPools.find(p => p.id === poolId);
    if (!pool) return;
    
    // Prepare transaction data
    const txData = {
      from: '0x742d35Cc7B4C4532CaCd8beCcBE3e5e4A78B14da3eC73ac',
      to: `${pool.name} Contract`,
      action: `Claim ${rewards.toFixed(6)} ${pool.token} rewards`,
      amount: `${rewards.toFixed(6)} ${pool.token}`,
      fee: '~$1.50',
      total: `${rewards.toFixed(6)} ${pool.token}`,
      details: [
        `Nonce: ${Math.floor(Math.random() * 1000000)}`,
        `Gas Price: 18 Gwei`,
        `Gas Limit: 120000`,
        `Reward Type: Staking Rewards`,
        `APY: ${pool.apy}%`
      ]
    };

    setTransactionData(txData);
    setSelectedPool(pool);
    setCurrentAction('claim');
    setShowTransactionModal(true);
  };

  const executeTransaction = (): void => {
    setIsProcessing(true);
    
    setTimeout(() => {
      if (currentAction === 'stake' && selectedPool) {
        const amount = parseFloat(stakeAmount);
        setUserBalances(prev => ({
          ...prev,
          [selectedPool.token]: Number((prev[selectedPool.token] - amount).toFixed(6))
        }));
        setUserStakes(prev => ({
          ...prev,
          [selectedPool.id]: {
            amount: Number((prev[selectedPool.id].amount + amount).toFixed(6)),
            rewards: prev[selectedPool.id].rewards,
            timeStaked: prev[selectedPool.id].timeStaked || Date.now()
          }
        }));
        setStakeAmount('');
        
        // Mark staking completion
        if (onActionCompleted) {
          onActionCompleted('staking', 'staked');
        }
        
        showToast(
          `Successfully staked ${amount} ${selectedPool.token} in ${selectedPool.name}`,
          'success',
          'Staking Successful! 🏦'
        );
      } else if (currentAction === 'unstake' && selectedPool) {
        const amount = parseFloat(unstakeAmount);
        setUserBalances(prev => ({
          ...prev,
          [selectedPool.token]: Number((prev[selectedPool.token] + amount).toFixed(6))
        }));
        setUserStakes(prev => ({
          ...prev,
          [selectedPool.id]: {
            ...prev[selectedPool.id],
            amount: Number((prev[selectedPool.id].amount - amount).toFixed(6))
          }
        }));
        setUnstakeAmount('');
        showToast(
          `Successfully unstaked ${amount} ${selectedPool.token}`,
          'success',
          'Unstaking Successful! 💰'
        );
      } else if (currentAction === 'claim' && selectedPool) {
        const rewards = userStakes[selectedPool.id].rewards;
        setUserBalances(prev => ({
          ...prev,
          [selectedPool.token]: Number((prev[selectedPool.token] + rewards).toFixed(6))
        }));
        setUserStakes(prev => ({
          ...prev,
          [selectedPool.id]: {
            ...prev[selectedPool.id],
            rewards: 0
          }
        }));
        
        // Mark claiming completion
        if (onActionCompleted) {
          onActionCompleted('staking', 'claimed');
        }
        
        showToast(
          `Claimed ${rewards.toFixed(6)} ${selectedPool.token} in rewards!`,
          'success',
          'Rewards Claimed! 🎁'
        );
      }
      
      setIsProcessing(false);
      setShowTransactionModal(false);
      setTransactionData(null);
      setCurrentAction('');
    }, 2000);
  };

  const StakingPoolCard = ({ pool }: { pool: StakingPool }) => {
    const userStake = userStakes[pool.id];
    const isStaked = userStake.amount > 0;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border dark:border-gray-700">
        <div className={`h-2 bg-gradient-to-r ${pool.color}`}></div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${pool.color} flex items-center justify-center text-white font-bold`}>
                {pool.token}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{pool.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{pool.description}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              pool.riskLevel === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
            }`}>
              {pool.riskLevel} Risk
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{pool.apy}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">APY</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{pool.tvl}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">TVL</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{pool.minStake}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Min Stake</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{pool.lockPeriod}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Lock Period</div>
            </div>
          </div>

          {isStaked && (
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-white">Your Stake</span>
                <span className="text-sm text-blue-700 dark:text-gray-300">Staked for {formatTime(userStake.timeStaked)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xl font-bold text-blue-900 dark:text-white">{userStake.amount.toFixed(4)} {pool.token}</div>
                  <div className="text-xs text-blue-700 dark:text-gray-400">Staked Amount</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">{userStake.rewards.toFixed(6)} {pool.token}</div>
                  <div className="text-xs text-blue-700 dark:text-gray-400">Pending Rewards</div>
                </div>
              </div>
              <button
                onClick={() => claimRewards(pool.id)}
                disabled={userStake.rewards === 0}
                className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                {userStake.rewards === 0 ? 'No Rewards Available' : 'Claim Rewards'}
              </button>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setSelectedPool(pool);
                setShowStakeModal(true);
              }}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Stake</span>
            </button>
            {isStaked && (
              <button
                onClick={() => {
                  setSelectedPool(pool);
                  setShowUnstakeModal(true);
                }}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Minus className="w-4 h-4" />
                <span>Unstake</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Calculate total portfolio value
  const totalStakedValue = Object.entries(userStakes).reduce((total, [poolId, stake]) => {
    const pool = stakingPools.find(p => p.id === poolId);
    if (pool && stake.amount > 0) {
      // Mock prices for calculation
      const prices: { [key: string]: number } = { ETH: 2500, USDC: 1, UNI: 8.5, LINK: 15.2 };
      return total + (stake.amount * prices[pool.token]);
    }
    return total;
  }, 0);

  const totalRewards = Object.values(userStakes).reduce((total, stake) => {
    return total + stake.rewards;
  }, 0);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <PiggyBank className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Total Staked</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">${totalStakedValue.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Across all pools</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-8 h-8 text-green-600" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Total Rewards</h3>
            </div>
            <div className="text-3xl font-bold text-green-600">${(totalRewards * 2500).toFixed(2)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available to claim</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Avg APY</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600">9.2%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Weighted average</div>
          </div>
        </div>

        {/* Staking Pools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stakingPools.map(pool => (
            <StakingPoolCard key={pool.id} pool={pool} />
          ))}
        </div>

        {/* Stake Modal */}
        {showStakeModal && selectedPool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Stake {selectedPool.token}</h3>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-500">Amount to Stake</label>
                    <span className="text-sm text-gray-500">
                      Balance: {userBalances[selectedPool.token].toFixed(4)} {selectedPool.token}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => {
                      setStakeAmount(e.target.value);
                      if (stakeAmountError) setStakeAmountError('');
                    }}
                    placeholder={`Min: ${selectedPool.minStake} ${selectedPool.token}`}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg ${
                      stakeAmountError ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {stakeAmountError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{stakeAmountError}</p>
                  )}
                  <button
                    onClick={() => setStakeAmount(userBalances[selectedPool.token].toString())}
                    className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                  >
                    Use Max Balance
                  </button>
                </div>

                {stakeAmount && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-2">Projected Earnings</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Daily:</span>
                        <span>{calculateProjectedRewards(stakeAmount, selectedPool.apy, 1)} {selectedPool.token}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span>{calculateProjectedRewards(stakeAmount, selectedPool.apy, 30)} {selectedPool.token}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Yearly:</span>
                        <span>{calculateProjectedRewards(stakeAmount, selectedPool.apy, 365)} {selectedPool.token}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowStakeModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStake}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Stake Tokens
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unstake Modal */}
        {showUnstakeModal && selectedPool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Unstake {selectedPool.token}</h3>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Amount to Unstake</label>
                    <span className="text-sm text-gray-500">
                      Staked: {userStakes[selectedPool.id].amount.toFixed(4)} {selectedPool.token}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => {
                      setUnstakeAmount(e.target.value);
                      if (unstakeAmountError) setUnstakeAmountError('');
                    }}
                    placeholder="0.0"
                    max={userStakes[selectedPool.id].amount}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg ${
                      unstakeAmountError ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {unstakeAmountError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{unstakeAmountError}</p>
                  )}
                  <button
                    onClick={() => setUnstakeAmount(userStakes[selectedPool.id].amount.toString())}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Unstake All
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-yellow-800">
                    <Clock className="w-4 h-4" />
                    <span>Lock period: {selectedPool.lockPeriod}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUnstakeModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUnstake}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Unstake Tokens
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => {
            setShowTransactionModal(false);
            setTransactionData(null);
            setCurrentAction('');
          }}
          onConfirm={executeTransaction}
          title={
            currentAction === 'stake' ? 'Confirm Stake' :
            currentAction === 'unstake' ? 'Confirm Unstake' :
            'Claim Rewards'
          }
          transactionData={transactionData || {}}
          isProcessing={isProcessing}
        />

      </div>
    </div>
  );
};

export default StakingDemo;