// src/demos/WalletDemo.jsx
import { useState } from 'react';
import { Wallet, Send, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

interface WalletState {
  address: string;
  balance: number;
  privateKey: string;
  showPrivateKey: boolean;
}

interface TransactionData {
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  fee: string;
  total: string;
  nonce: number;
  data: string;
}

interface WalletDemoProps {
  onActionCompleted: (action: string) => void;
}

const WalletDemo = ({ onActionCompleted }: WalletDemoProps) => {
  // Wallet states
  const [walletA, setWalletA] = useState<WalletState>({
    address: '0x742d35Cc7B4C4532C...a3eC73ac',
    balance: 2.5,
    privateKey: '0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f',
    showPrivateKey: false
  });

  const [walletB, setWalletB] = useState<WalletState>({
    address: '0x8ba1f109551bD432E...c6BcF04b',
    balance: 1.8,
    privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
    showPrivateKey: false
  });

  // Transaction states
  const [sendAmount, setSendAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [gasPrice, setGasPrice] = useState<string>('20');
  const [gasLimit, setGasLimit] = useState<string>('21000');
  const [activeWallet, setActiveWallet] = useState<'A' | 'B'>('A');
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [copied, setCopied] = useState<string>('');

  const { showToast, ToastComponent } = useToast();

  const currentWallet = activeWallet === 'A' ? walletA : walletB;
  const targetWallet = activeWallet === 'A' ? walletB : walletA;

  const togglePrivateKey = (wallet: 'A' | 'B') => {
    if (wallet === 'A') {
      setWalletA(prev => ({ ...prev, showPrivateKey: !prev.showPrivateKey }));
    } else {
      setWalletB(prev => ({ ...prev, showPrivateKey: !prev.showPrivateKey }));
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const calculateTransactionFee = () => {
    return (parseFloat(gasPrice) * parseFloat(gasLimit)) / 1000000000; // Convert to ETH
  };

  const prepareTransaction = () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(sendAmount) > currentWallet.balance) {
      alert('Insufficient balance');
      return;
    }

    const fee = calculateTransactionFee();
    const total = parseFloat(sendAmount) + fee;

    if (total > currentWallet.balance) {
      alert('Insufficient balance for transaction + gas fees');
      return;
    }

    const toAddress = recipient || targetWallet.address;
    
    const txData = {
      from: currentWallet.address,
      to: toAddress,
      value: sendAmount,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      fee: fee.toFixed(6),
      total: total.toFixed(6),
      nonce: Math.floor(Math.random() * 1000000),
      data: '0x'
    };

    setTransactionData(txData);
  };

  const signAndSendTransaction = () => {
    const amount = parseFloat(sendAmount);
    const fee = calculateTransactionFee();
    const targetWalletName = activeWallet === 'A' ? 'B' : 'A';
    
    if (activeWallet === 'A') {
      setWalletA(prev => ({ ...prev, balance: prev.balance - amount - fee }));
      setWalletB(prev => ({ ...prev, balance: prev.balance + amount }));
    } else {
      setWalletB(prev => ({ ...prev, balance: prev.balance - amount - fee }));
      setWalletA(prev => ({ ...prev, balance: prev.balance + amount }));
    }

    setShowTransactionModal(false);
    setTransactionData(null);
    setSendAmount('');
    setRecipient('');
    
    // Mark wallet completion
    if (onActionCompleted) {
      onActionCompleted('wallet');
    }
    
    showToast(
      `Successfully sent ${amount} ETH to Wallet ${targetWalletName}`,
      'success',
      'Transaction Completed! 💸'
    );
  };

  const WalletCard = ({ wallet, walletName, isActive }: { wallet: WalletState; walletName: 'A' | 'B'; isActive: boolean }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all ${
      isActive ? 'border-blue-500 shadow-xl' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Wallet {walletName}</h3>
        </div>
        <button
          onClick={() => setActiveWallet(walletName)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isActive ? 'Active' : 'Select'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 bg-gray-50 rounded border font-mono text-sm">
              {wallet.address}
            </div>
            <button
              onClick={() => copyToClipboard(wallet.address, `address-${walletName}`)}
              className="p-2 text-gray-500 hover:text-blue-600"
            >
              {copied === `address-${walletName}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
          <div className="text-2xl font-bold text-green-600">
            {wallet.balance.toFixed(4)} ETH
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Private Key</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 bg-gray-50 rounded border font-mono text-sm">
              {wallet.showPrivateKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
            </div>
            <button
              onClick={() => togglePrivateKey(walletName)}
              className="p-2 text-gray-500 hover:text-blue-600"
            >
              {wallet.showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {wallet.showPrivateKey && (
              <button
                onClick={() => copyToClipboard(wallet.privateKey, `key-${walletName}`)}
                className="p-2 text-gray-500 hover:text-blue-600"
              >
                {copied === `key-${walletName}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Crypto Wallet Demo</h1>
          <p className="text-gray-600">Experience MetaMask-style transactions in a safe sandbox environment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <WalletCard 
            wallet={walletA} 
            walletName="A" 
            isActive={activeWallet === 'A'} 
          />
          <WalletCard 
            wallet={walletB} 
            walletName="B" 
            isActive={activeWallet === 'B'} 
          />
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Send Transaction</span>
          </button>
        </div>

        {/* Send Transaction Modal */}
        {showTransactionModal && !transactionData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Send Transaction</h3>
                  <button
                    onClick={() => setShowTransactionModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Wallet</label>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-medium text-blue-900">Wallet {activeWallet}</div>
                      <div className="text-sm text-blue-700 font-mono">{currentWallet.address}</div>
                      <div className="text-sm text-blue-700">Balance: {currentWallet.balance.toFixed(4)} ETH</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder={targetWallet.address}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      Leave empty to send to Wallet {activeWallet === 'A' ? 'B' : 'A'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (ETH)</label>
                    <input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.0"
                      step="0.0001"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gas Price (Gwei)</label>
                      <input
                        type="number"
                        value={gasPrice}
                        onChange={(e) => setGasPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gas Limit</label>
                      <input
                        type="number"
                        value={gasLimit}
                        onChange={(e) => setGasLimit(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Estimated Gas Fee:</span>
                      <span className="font-medium">{calculateTransactionFee().toFixed(6)} ETH</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600">Total (Amount + Fee):</span>
                      <span className="font-bold text-lg">
                        {sendAmount ? (parseFloat(sendAmount || '0') + calculateTransactionFee()).toFixed(6) : calculateTransactionFee().toFixed(6)} ETH
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowTransactionModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={prepareTransaction}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Confirmation Modal */}
        {showTransactionModal && transactionData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Confirm Transaction</h3>
                  <button
                    onClick={() => {
                      setShowTransactionModal(false);
                      setTransactionData(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-sm text-yellow-800">
                      <strong>⚠️ Review carefully:</strong> This transaction cannot be undone once signed.
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-mono text-sm">{transactionData?.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-mono text-sm">{transactionData?.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold">{transactionData?.value} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gas Fee:</span>
                      <span>{transactionData?.fee} ETH</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-medium">Total:</span>
                      <span className="font-bold text-lg">{transactionData?.total} ETH</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Transaction Data:</h4>
                    <div className="text-xs font-mono bg-white p-2 rounded border">
                      <div>Nonce: {transactionData?.nonce}</div>
                      <div>Gas Price: {transactionData?.gasPrice} Gwei</div>
                      <div>Gas Limit: {transactionData?.gasLimit}</div>
                      <div>Data: {transactionData?.data}</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setTransactionData(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={signAndSendTransaction}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sign & Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <ToastComponent />
      </div>
    </div>
  );
};

export default WalletDemo;