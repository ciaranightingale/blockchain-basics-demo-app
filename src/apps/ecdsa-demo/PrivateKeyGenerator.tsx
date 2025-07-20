import { useState } from 'react';
import { generatePrivateKey } from '../../utils/crypto';
import { AlertTriangle } from 'lucide-react';

interface PrivateKeyGeneratorProps {
  onPrivateKeyGenerated: (privateKey: string) => void;
}

export default function PrivateKeyGenerator({ onPrivateKeyGenerated }: PrivateKeyGeneratorProps) {
  const [privateKey, setPrivateKey] = useState<string>('');
  const [showWarning, setShowWarning] = useState(false);

  const handleGenerateKey = () => {
    setShowWarning(true);
    const newPrivateKey = generatePrivateKey();
    setPrivateKey(newPrivateKey);
    onPrivateKeyGenerated(newPrivateKey);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(privateKey);
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">1</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Generate Private Key</h2>
      </div>
      
      {showWarning && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-600 dark:text-red-400">Security Warning</p>
              <p className="text-sm">Never share your private key with anyone. This is for educational purposes only. Do not use for real cryptocurrency transactions.</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          <p>Generate a private key:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Private keys are 256-bit random numbers</li>
          </ul>
        </div>

        <button
          onClick={handleGenerateKey}
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Generate Random Private Key
        </button>

        {privateKey && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-blue-600 dark:text-blue-400">
              Generated Private Key:
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 font-mono text-sm break-all text-gray-700 dark:text-gray-300">
                {privateKey}
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-4 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-gray-600 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                title="Copy to clipboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Length: {privateKey.replace('0x', '').length / 2} bytes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}