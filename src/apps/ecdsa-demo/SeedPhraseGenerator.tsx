import { useState } from 'react';
import { ethers } from 'ethers';
import { RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';

interface SeedPhraseGeneratorProps {
  onSeedPhraseGenerated: (seedPhrase: string) => void;
}

export default function SeedPhraseGenerator({ onSeedPhraseGenerated }: SeedPhraseGeneratorProps) {
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const generateSeedPhrase = () => {
    // Generate a new random mnemonic using ethers
    const mnemonic = ethers.Wallet.createRandom().mnemonic;
    if (mnemonic) {
      const phrase = mnemonic.phrase;
      setSeedPhrase(phrase);
      onSeedPhraseGenerated(phrase);
      setIsVisible(true);
    }
  };

  const copySeedPhrase = () => {
    if (seedPhrase) {
      navigator.clipboard.writeText(seedPhrase);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        1. Generate Seed Phrase
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Generate a 12-word seed phrase that will be used to derive multiple private keys.
      </p>

      <div className="space-y-4">
        <button
          onClick={generateSeedPhrase}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-blue-600 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw size={20} />
          <span>Generate New Seed Phrase</span>
        </button>

        {seedPhrase && (
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Seed Phrase (12 words)
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleVisibility}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title={isVisible ? 'Hide seed phrase' : 'Show seed phrase'}
                  >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={copySeedPhrase}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {seedPhrase.split(' ').map((word: string, index: number) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-center text-sm font-mono"
                  >
                    <span className="text-gray-500 dark:text-gray-400 text-xs mr-1">{index + 1}.</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {isVisible ? word : '••••••'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {copySuccess && (
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                ✓ Seed phrase copied to clipboard!
              </div>
            )}

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <div className="flex items-start space-x-2">
                <div className="text-yellow-600 dark:text-yellow-400 text-sm">
                  <strong>Important:</strong> Store seed phrases securely. Anyone with access to it can control all derived private keys and associated funds.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}