// src/demos/DexDemo.tsx
import { useState, useEffect } from 'react';
import { ArrowRightLeft, Settings, Info, ChevronDown } from 'lucide-react';
import TransactionModal from './TransactionModal';
import { useToast } from './Toast';

interface Token {
  name: string;
  symbol: string;
  price: number;
  balance: number;
  decimals: number;
  color: string;
}

interface TokenBalances {
  [key: string]: Token;
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

interface DexDemoProps {
  onActionCompleted: (action: string) => void;
}

const DexDemo = ({ onActionCompleted }: DexDemoProps) => {
  const [fromToken, setFromToken] = useState<string>('ETH');
  const [toToken, setToToken] = useState<string>('USDC');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.5');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);

  const { showToast, ToastComponent } = useToast();

  // Mock token data with balances
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({
    ETH: { name: 'Ethereum', symbol: 'ETH', price: 2500, balance: 1.5, decimals: 18, color: 'text-purple-600' },
    USDC: { name: 'USD Coin', symbol: 'USDC', price: 1, balance: 3750, decimals: 6, color: 'text-blue-600' },
    BTC: { name: 'Bitcoin', symbol: 'BTC', price: 45000, balance: 0.05, decimals: 8, color: 'text-orange-600' },
    UNI: { name: 'Uniswap', symbol: 'UNI', price: 8.5, balance: 125, decimals: 18, color: 'text-pink-600' },
    LINK: { name: 'Chainlink', symbol: 'LINK', price: 15.2, balance: 45, decimals: 18, color: 'text-blue-500' }
  });

  // Calculate exchange rate and output amount
  useEffect(() => {
    if (fromAmount && fromToken && toToken && parseFloat(fromAmount) > 0) {
      const fromPrice = tokenBalances[fromToken].price;
      const toPrice = tokenBalances[toToken].price;
      const exchangeRate = fromPrice / toPrice;
      const slippageMultiplier = 1 - (parseFloat(slippage) / 100);
      const calculatedAmount = (parseFloat(fromAmount) * exchangeRate * slippageMultiplier).toFixed(6);
      setToAmount(calculatedAmount);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, slippage, tokenBalances]);

  const swapTokens = (): void => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = (): void => {
    const amount = parseFloat(fromAmount);
    
    if (!fromAmount || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > tokenBalances[fromToken].balance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    // Prepare transaction data
    const txData = {
      from: '0x742d35Cc7B4C4532C...a3eC73ac', // Mock wallet address
      to: 'Uniswap V3 Router',
      action: `Swap ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      amount: `${fromAmount} ${fromToken}`,
      fee: '~$2.50',
      total: `${toAmount} ${toToken}`,
      details: [
        `Nonce: ${Math.floor(Math.random() * 1000000)}`,
        `Gas Price: 20 Gwei`,
        `Gas Limit: 150000`,
        `Slippage: ${slippage}%`,
        `Route: ${fromToken} → ${toToken}`
      ]
    };

    setTransactionData(txData);
    setShowConfirmModal(true);
  };

  const executeSwap = (): void => {
    setIsSwapping(true);
    setTimeout(() => {
      const fromAmountNum = parseFloat(fromAmount);
      const toAmountNum = parseFloat(toAmount);

      // Update token balances
      setTokenBalances(prev => ({
        ...prev,
        [fromToken]: {
          ...prev[fromToken],
          balance: Number((prev[fromToken].balance - fromAmountNum).toFixed(6))
        },
        [toToken]: {
          ...prev[toToken],
          balance: Number((prev[toToken].balance + toAmountNum).toFixed(6))
        }
      }));

      setIsSwapping(false);
      setShowConfirmModal(false);
      setFromAmount('');
      setToAmount('');
      
      // Mark DEX completion
      if (onActionCompleted) {
        onActionCompleted('dex');
      }
      
      showToast(
        `Successfully swapped ${fromAmountNum} ${fromToken} for ${toAmountNum} ${toToken}`,
        'success',
        'Swap Completed! 🎉'
      );
    }, 2000);
  };

  const TokenSelector = ({ selectedToken, onSelect }: { selectedToken: string; onSelect: (token: string) => void; label: string }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
        >
          <span className={`font-semibold ${tokenBalances[selectedToken].color}`}>
            {selectedToken}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-10 min-w-[150px]">
            {Object.entries(tokenBalances).map(([symbol, token]) => (
              <button
                key={symbol}
                onClick={() => {
                  onSelect(symbol);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
              >
                <div>
                  <div className={`font-semibold ${token.color}`}>{symbol}</div>
                  <div className="text-xs text-gray-500">{token.name}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {token.balance.toFixed(4)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Swap Tokens</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {showSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Slippage Tolerance</label>
                <div className="flex space-x-2">
                  {['0.1', '0.5', '1.0'].map((value) => (
                    <button
                      key={value}
                      onClick={() => setSlippage(value)}
                      className={`px-3 py-1 rounded text-sm ${
                        slippage === value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {value}%
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder="Custom slippage %"
              />
            </div>
          )}

          <div className="space-y-4">
            {/* From Token */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">From</label>
                <span className="text-sm text-gray-500">
                  Balance: {tokenBalances[fromToken].balance.toFixed(4)} {fromToken}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || parseFloat(value) >= 0) {
                      setFromAmount(value);
                    }
                  }}
                  placeholder="0.0"
                  min="0"
                  step="0.000001"
                  className="flex-1 text-2xl font-semibold bg-transparent outline-none"
                />
                <TokenSelector
                  selectedToken={fromToken}
                  onSelect={setFromToken}
                  label="From"
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                ≈ ${fromAmount ? (parseFloat(fromAmount) * tokenBalances[fromToken].price).toFixed(2) : '0.00'}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapTokens}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowRightLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* To Token */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">To</label>
                <span className="text-sm text-gray-500">
                  Balance: {tokenBalances[toToken].balance.toFixed(4)} {toToken}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  className="flex-1 text-2xl font-semibold bg-transparent outline-none text-gray-700"
                />
                <TokenSelector
                  selectedToken={toToken}
                  onSelect={setToToken}
                  label="To"
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                ≈ ${toAmount ? (parseFloat(toAmount) * tokenBalances[toToken].price).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>

          {fromAmount && toAmount && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Trade Details</span>
              </div>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Exchange Rate:</span>
                  <span>1 {fromToken} = {((tokenBalances[fromToken].price / tokenBalances[toToken].price) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Impact:</span>
                  <span className="text-green-600">{'<0.01%'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidity Provider Fee:</span>
                  <span>0.30%</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSwap}
            disabled={!fromAmount || !toAmount || parseFloat(fromAmount) > tokenBalances[fromToken].balance || parseFloat(fromAmount) <= 0}
            className="w-full mt-6 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
          >
            {!fromAmount ? 'Enter Amount' : 
             parseFloat(fromAmount) <= 0 ? 'Enter Valid Amount' :
             parseFloat(fromAmount) > tokenBalances[fromToken].balance ? 'Insufficient Balance' : 
             'Swap Tokens'}
          </button>
        </div>

        <TransactionModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setTransactionData(null);
          }}
          onConfirm={executeSwap}
          title="Confirm Swap"
          transactionData={transactionData || {}}
          isProcessing={isSwapping}
        />

        <ToastComponent />
      </div>
    </div>
  );
};

export default DexDemo;