import { useState } from 'react';
import { signMessage, createEthereumTransaction } from '../../utils/crypto';
import { Copy } from 'lucide-react';

interface PrivateKey {
  id: string;
  index: number;
  key: string;
  derivationPath: string;
}

interface MessageSignerProps {
  privateKeys: PrivateKey[];
}

export default function MessageSigner({ privateKeys }: MessageSignerProps) {
  const [selectedPrivateKeyId, setSelectedPrivateKeyId] = useState('');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [messageType, setMessageType] = useState<'custom' | 'ethereum'>('custom');
  const [ethereumTx, setEthereumTx] = useState({
    to: '0x742d35Cc6634C0532925a3b8D',
    value: '0.1',
    nonce: 0,
    gasLimit: '21000',
    gasPrice: '20'
  });

  const resetAll = () => {
    setSelectedPrivateKeyId('');
    setMessage('');
    setSignature('');
    setMessageType('custom');
    setEthereumTx({
      to: '0x742d35Cc6634C0532925a3b8D',
      value: '0.1',
      nonce: 0,
      gasLimit: '21000',
      gasPrice: '20'
    });
  };

  const handleSignMessage = () => {
    if (!selectedPrivateKeyId || !message) return;
    
    const selectedPrivateKey = privateKeys.find(pk => pk.id === selectedPrivateKeyId);
    if (!selectedPrivateKey) return;
    
    try {
      const sig = signMessage(message, selectedPrivateKey.key);
      setSignature(sig);
    } catch (error) {
      console.error('Signing failed:', error);
      setSignature('Error: Failed to sign message');
    }
  };

  const handleCreateEthereumTx = () => {
    const txMessage = createEthereumTransaction(
      ethereumTx.to,
      ethereumTx.value,
      ethereumTx.nonce,
      ethereumTx.gasLimit,
      ethereumTx.gasPrice
    );
    setMessage(txMessage);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        5. Sign Messages
      </h2>

      {privateKeys.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Generate private keys first to sign messages
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            <p>Sign messages using your private keys:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Select which account (private key) to use for signing</li>
              <li>Custom messages can be any text you want to sign</li>
              <li>Ethereum transactions follow a specific format</li>
              <li>Signatures prove ownership of the selected private key</li>
            </ul>
          </div>

          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Account to Sign With:
            </label>
            <select
              value={selectedPrivateKeyId}
              onChange={(e) => setSelectedPrivateKeyId(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-700 dark:text-white"
            >
              <option value="">Select an account...</option>
              {privateKeys.map((privateKey) => (
                <option key={privateKey.id} value={privateKey.id}>
                  Account {privateKey.index}
                </option>
              ))}
            </select>
          </div>

          <div className={`flex gap-2 mb-6 ${!selectedPrivateKeyId ? 'opacity-50 pointer-events-none' : ''}`}>
            <button
              onClick={() => setMessageType('custom')}
              disabled={!selectedPrivateKeyId}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 border ${
                messageType === 'custom'
                  ? 'bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Custom Message
            </button>
            <button
              onClick={() => setMessageType('ethereum')}
              disabled={!selectedPrivateKeyId}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 border ${
                messageType === 'ethereum'
                  ? 'bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Ethereum Transaction
            </button>
          </div>

          {messageType === 'custom' ? (
            <div className={`space-y-4 ${!selectedPrivateKeyId ? 'opacity-50' : ''}`}>
              <label className="block text-sm font-medium text-blue-600 dark:text-blue-400">
                Message to Sign:
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!selectedPrivateKeyId}
                  className="w-full p-4 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={4}
                  placeholder={selectedPrivateKeyId ? "Enter your message here..." : "Select an account first..."}
                />
                {message && (
                  <button
                    onClick={() => copyToClipboard(message)}
                    disabled={!selectedPrivateKeyId}
                    className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={`space-y-4 ${!selectedPrivateKeyId ? 'opacity-50' : ''}`}>
              <label className="block text-sm font-medium text-blue-600 dark:text-blue-400">
                Ethereum Transaction Details:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">To Address:</label>
                  <input
                    type="text"
                    value={ethereumTx.to}
                    onChange={(e) => setEthereumTx({...ethereumTx, to: e.target.value})}
                    disabled={!selectedPrivateKeyId}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Value (ETH):</label>
                  <input
                    type="text"
                    value={ethereumTx.value}
                    onChange={(e) => setEthereumTx({...ethereumTx, value: e.target.value})}
                    disabled={!selectedPrivateKeyId}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Nonce:</label>
                  <input
                    type="number"
                    value={ethereumTx.nonce}
                    onChange={(e) => setEthereumTx({...ethereumTx, nonce: parseInt(e.target.value)})}
                    disabled={!selectedPrivateKeyId}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Gas Limit:</label>
                  <input
                    type="text"
                    value={ethereumTx.gasLimit}
                    onChange={(e) => setEthereumTx({...ethereumTx, gasLimit: e.target.value})}
                    disabled={!selectedPrivateKeyId}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">Gas Price (Gwei):</label>
                  <input
                    type="text"
                    value={ethereumTx.gasPrice}
                    onChange={(e) => setEthereumTx({...ethereumTx, gasPrice: e.target.value})}
                    disabled={!selectedPrivateKeyId}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex justify-start
            ">
                <button
                  onClick={handleCreateEthereumTx}
                  disabled={!selectedPrivateKeyId}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 disabled:hover:border-blue-500 dark:disabled:hover:bg-blue-600 dark:disabled:hover:border-blue-600"
                >
                  Generate Transaction Message
                </button>
              </div>
              {message && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Generated Message:</label>
                  <div className="relative">
                    <pre className="bg-gray-50 dark:bg-gray-700 p-4 pr-12 rounded-lg text-xs overflow-x-auto border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                      {message}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(message)}
                      className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSignMessage}
              disabled={!message || !selectedPrivateKeyId}
              className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 disabled:hover:border-blue-500 dark:disabled:hover:bg-blue-600 dark:disabled:hover:border-blue-600"
            >
              Sign Message
            </button>
            <button
              onClick={resetAll}
              className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-gray-500 hover:border-gray-600 dark:border-gray-600 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Reset
            </button>
          </div>

          {signature && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-blue-600 dark:text-blue-400">
                Signature:
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Digital Signature</span>
                  <button
                    onClick={() => copyToClipboard(signature)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-2 font-mono text-sm break-all text-gray-700 dark:text-gray-300">
                  {signature}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Length: {signature.length} characters
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}