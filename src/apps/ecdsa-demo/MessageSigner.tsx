import { useState } from 'react';
import { signMessage, createEthereumTransaction } from '../../utils/crypto';

interface MessageSignerProps {
  privateKey: string;
}

export default function MessageSigner({ privateKey }: MessageSignerProps) {
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
    if (!privateKey || !message) return;
    
    try {
      const sig = signMessage(message, privateKey);
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
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">4</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Sign Message</h2>
      </div>

      {!privateKey ? (
        <div className="text-center py-8 text-gray-600">
          <p>Generate a private key first to sign messages</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 mb-4">
            <p>Sign messages using your private key:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Custom messages can be any text you want to sign</li>
              <li>Ethereum transactions follow a specific format</li>
              <li>Signatures prove ownership of the private key</li>
            </ul>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMessageType('custom')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 border ${
                messageType === 'custom'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              Custom Message
            </button>
            <button
              onClick={() => setMessageType('ethereum')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 border ${
                messageType === 'ethereum'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              Ethereum Transaction
            </button>
          </div>

          {messageType === 'custom' ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-blue-600">
                Message to Sign:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-500"
                rows={4}
                placeholder="Enter your message here..."
              />
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-blue-600">
                Ethereum Transaction Details:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600">To Address:</label>
                  <input
                    type="text"
                    value={ethereumTx.to}
                    onChange={(e) => setEthereumTx({...ethereumTx, to: e.target.value})}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Value (ETH):</label>
                  <input
                    type="text"
                    value={ethereumTx.value}
                    onChange={(e) => setEthereumTx({...ethereumTx, value: e.target.value})}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Nonce:</label>
                  <input
                    type="number"
                    value={ethereumTx.nonce}
                    onChange={(e) => setEthereumTx({...ethereumTx, nonce: parseInt(e.target.value)})}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Gas Limit:</label>
                  <input
                    type="text"
                    value={ethereumTx.gasLimit}
                    onChange={(e) => setEthereumTx({...ethereumTx, gasLimit: e.target.value})}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600">Gas Price (Gwei):</label>
                  <input
                    type="text"
                    value={ethereumTx.gasPrice}
                    onChange={(e) => setEthereumTx({...ethereumTx, gasPrice: e.target.value})}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
                  />
                </div>
              </div>
              <div className="flex justify-start
            ">
                <button
                  onClick={handleCreateEthereumTx}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Generate Transaction Message
                </button>
              </div>
              {message && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Generated Message:</label>
                  <div className="flex items-start gap-3">
                    <pre className="flex-1 bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto border border-gray-200 text-gray-700">
                      {message}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(message)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-4 rounded-md transition-colors duration-200 border border-gray-500 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex-shrink-0"
                      title="Copy message to clipboard"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSignMessage}
              disabled={!message}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 disabled:hover:border-blue-500"
            >
              Sign Message
            </button>
            <button
              onClick={resetAll}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-gray-500 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>

          {signature && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-blue-600">
                Signature:
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm break-all text-gray-700">
                  {signature}
                </div>
                <button
                  onClick={() => copyToClipboard(signature)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-4 rounded-md transition-colors duration-200 border border-gray-500 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Length: {signature.length} characters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}