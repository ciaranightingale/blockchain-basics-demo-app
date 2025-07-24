// src/demos/WalletDemo.jsx
import { useState } from 'react';
import { Wallet, Send, Eye, EyeOff, Copy, Check, Plus } from 'lucide-react';
import { useToast } from './Toast';

interface WalletState {
  id: string;
  name: string;
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
  // Generate random ethereum address and private key
  const generateWallet = (name: string): WalletState => {
    const randomHex = () => Math.floor(Math.random() * 16).toString(16);
    const address = '0x' + Array.from({ length: 40 }, randomHex).join('');
    const privateKey = '0x' + Array.from({ length: 64 }, randomHex).join('');
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      address,
      balance: 2.5, // All wallets start with 2.5 ETH
      privateKey,
      showPrivateKey: false
    };
  };

  // Initialize with 2 wallets
  const [wallets, setWallets] = useState<WalletState[]>([
    {
      id: 'wallet-1',
      name: 'Wallet 1',
      address: '0x742d35Cc7B4C4532CaCd8beCcBE3e5e4A78B14da3eC73ac',
      balance: 2.5,
      privateKey: '0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f',
      showPrivateKey: false
    },
    {
      id: 'wallet-2', 
      name: 'Wallet 2',
      address: '0x8ba1f109551bD432E27b2F90CE97F2608c6BcF04b',
      balance: 2.5,
      privateKey: '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318',
      showPrivateKey: false
    }
  ]);

  // Transaction states
  const [sendAmount, setSendAmount] = useState<string>('');
  const [recipientWalletId, setRecipientWalletId] = useState<string>('');
  const [gasPrice, setGasPrice] = useState<string>('20');
  const [gasLimit, setGasLimit] = useState<string>('21000');
  const [activeWalletId, setActiveWalletId] = useState<string>('wallet-1');
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [copied, setCopied] = useState<string>('');

  const { showToast, ToastComponent } = useToast();

  const currentWallet = wallets.find(w => w.id === activeWalletId) || wallets[0];
  const availableRecipients = wallets.filter(w => w.id !== activeWalletId);

  const createNewWallet = () => {
    if (wallets.length >= 8) {
      showToast('Maximum of 8 wallets allowed', 'error');
      return;
    }
    
    const walletNumber = wallets.length + 1;
    const newWallet = generateWallet(`Wallet ${walletNumber}`);
    setWallets(prev => [...prev, newWallet]);
    showToast(`Created ${newWallet.name}!`, 'success', 'New Wallet Created 🎉');
  };

  const togglePrivateKey = (walletId: string) => {
    setWallets(prev => prev.map(wallet => 
      wallet.id === walletId 
        ? { ...wallet, showPrivateKey: !wallet.showPrivateKey }
        : wallet
    ));
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const calculateTransactionFee = () => {
    // Gas price is in Gwei (1 Gwei = 10^9 wei)
    // Total fee in wei = gasPrice (Gwei) * gasLimit * 10^9
    // Convert to ETH by dividing by 10^18
    return (parseFloat(gasPrice) * parseFloat(gasLimit)) / 1000000000; // This gives us 0.00042 ETH for 20 Gwei * 21000
  };

  const prepareTransaction = () => {
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (!recipientWalletId) {
      showToast('Please select a recipient wallet', 'error');
      return;
    }

    if (parseFloat(sendAmount) > currentWallet.balance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    const fee = calculateTransactionFee();
    const total = parseFloat(sendAmount) + fee;

    if (total > currentWallet.balance) {
      showToast('Insufficient balance for transaction + gas fees', 'error');
      return;
    }

    const recipientWallet = wallets.find(w => w.id === recipientWalletId);
    if (!recipientWallet) {
      showToast('Recipient wallet not found', 'error');
      return;
    }
    
    const txData = {
      from: currentWallet.address,
      to: recipientWallet.address,
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
    
    const recipientWallet = wallets.find(w => w.id === recipientWalletId);
    if (!recipientWallet) {
      showToast('Recipient wallet not found', 'error');
      return;
    }

    // Update wallet balances
    setWallets(prev => prev.map(wallet => {
      if (wallet.id === activeWalletId) {
        // Deduct from sender
        return { ...wallet, balance: wallet.balance - amount - fee };
      } else if (wallet.id === recipientWalletId) {
        // Add to recipient
        return { ...wallet, balance: wallet.balance + amount };
      }
      return wallet;
    }));

    setShowTransactionModal(false);
    setTransactionData(null);
    setSendAmount('');
    setRecipientWalletId('');
    
    // Mark wallet completion
    if (onActionCompleted) {
      onActionCompleted('wallet');
    }
    
    showToast(
      `Successfully sent ${amount} ETH to ${recipientWallet.name}`,
      'success',
      'Transaction Completed! 💸'
    );
  };

  const WalletCard = ({ wallet, isActive }: { wallet: WalletState; isActive: boolean }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 transition-all ${
      isActive ? 'border-blue-500 shadow-xl' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{wallet.name}</h3>
        </div>
        <button
          onClick={() => setActiveWalletId(wallet.id)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          {isActive ? 'Active' : 'Select'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-600 rounded border dark:border-gray-600 font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all">
              {wallet.address}
            </div>
            <button
              onClick={() => copyToClipboard(wallet.address, `address-${wallet.id}`)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex-shrink-0"
            >
              {copied === `address-${wallet.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Balance</label>
          <div className="text-2xl font-bold text-green-600">
            {wallet.balance.toFixed(4)} ETH
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Private Key</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-600 rounded border dark:border-gray-600 font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all overflow-hidden min-w-0">
              {wallet.showPrivateKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
            </div>
            <button
              onClick={() => togglePrivateKey(wallet.id)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex-shrink-0"
            >
              {wallet.showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {wallet.showPrivateKey && (
              <button
                onClick={() => copyToClipboard(wallet.privateKey, `key-${wallet.id}`)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex-shrink-0"
              >
                {copied === `key-${wallet.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Wallets Grid - Always 2 columns */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {wallets.map((wallet) => (
            <WalletCard 
              key={wallet.id}
              wallet={wallet} 
              isActive={wallet.id === activeWalletId} 
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Send Transaction</span>
          </button>
          <button
            onClick={createNewWallet}
            disabled={wallets.length >= 8}
            className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{wallets.length >= 8 ? 'Max Wallets (8)' : 'Create New Wallet'}</span>
          </button>
        </div>

        {/* Send Transaction Modal */}
        {showTransactionModal && !transactionData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Send Transaction</h3>
                  <button
                    onClick={() => setShowTransactionModal(false)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Wallet</label>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="font-medium text-blue-900 dark:text-blue-200">{currentWallet.name}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 font-mono">{currentWallet.address}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Balance: {currentWallet.balance.toFixed(4)} ETH</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipient Wallet</label>
                    <select
                      value={recipientWalletId}
                      onChange={(e) => setRecipientWalletId(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select recipient wallet...</option>
                      {availableRecipients.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                          {wallet.name} - {wallet.balance.toFixed(4)} ETH
                        </option>
                      ))}
                    </select>
                    {recipientWalletId && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="font-mono text-xs">
                          {wallets.find(w => w.id === recipientWalletId)?.address}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (ETH)</label>
                    <input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.0"
                      step="0.0001"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gas Price (Gwei)</label>
                      <input
                        type="number"
                        value={gasPrice}
                        onChange={(e) => setGasPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gas Limit</label>
                      <input
                        type="number"
                        value={gasLimit}
                        onChange={(e) => setGasLimit(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Estimated Gas Fee:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{calculateTransactionFee().toFixed(6)} ETH</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-300">Total (Amount + Fee):</span>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {sendAmount ? (parseFloat(sendAmount || '0') + calculateTransactionFee()).toFixed(6) : calculateTransactionFee().toFixed(6)} ETH
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowTransactionModal(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Confirm Transaction</h3>
                  <button
                    onClick={() => {
                      setShowTransactionModal(false);
                      setTransactionData(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">
                      <strong>⚠️ Review carefully:</strong> This transaction cannot be undone once signed.
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">From:</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">{transactionData?.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">To:</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">{transactionData?.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{transactionData?.value} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Gas Fee:</span>
                      <span className="text-gray-900 dark:text-white">{transactionData?.fee} ETH</span>
                    </div>
                    <div className="flex justify-between border-t dark:border-gray-600 pt-2">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">Total:</span>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">{transactionData?.total} ETH</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-gray-800 dark:text-white">Transaction Data:</h4>
                    <div className="text-xs font-mono bg-white dark:bg-gray-600 p-2 rounded border dark:border-gray-600 text-gray-900 dark:text-white">
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
                    className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
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