import { useState, useEffect } from 'react';
import { getPublicKey } from '../../utils/crypto';
import { Copy } from 'lucide-react';

interface PrivateKey {
  id: string;
  index: number;
  key: string;
  derivationPath: string;
}

interface PublicKey {
  id: string;
  key: string;
  compressed: boolean;
  privateKeyId: string;
}

interface PublicKeyDerivationProps {
  privateKeys: PrivateKey[];
  onPublicKeysChange: (publicKeys: PublicKey[]) => void;
}

export default function PublicKeyDerivation({ privateKeys, onPublicKeysChange }: PublicKeyDerivationProps) {
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);

  useEffect(() => {
    if (privateKeys.length === 0) {
      setPublicKeys([]);
      onPublicKeysChange([]);
    }
  }, [privateKeys, onPublicKeysChange]);

  const generateAllPublicKeys = () => {
    if (privateKeys.length === 0) return;
    
    const newPublicKeys: PublicKey[] = privateKeys.map((privateKey) => {
      const publicKeyHex = getPublicKey(privateKey.key);
      return {
        id: `public-${privateKey.id}`,
        key: publicKeyHex,
        compressed: false,
        privateKeyId: privateKey.id
      };
    });
    
    setPublicKeys(newPublicKeys);
    onPublicKeysChange(newPublicKeys);
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        3. Derive Public Keys
      </h2>

      {privateKeys.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Generate private keys first to derive public keys
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            <p>Generate public keys from your private keys using elliptic curve cryptography:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Each private key generates a unique public key</li>
              <li>Public keys can be safely shared and used to verify signatures</li>
              <li>The relationship between private and public keys is one-way (irreversible)</li>
            </ul>
          </div>

          <button
            onClick={generateAllPublicKeys}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Generate All Public Keys ({privateKeys.length})
          </button>

          {privateKeys.map((privateKey) => {
            const correspondingPublicKey = publicKeys.find(pk => pk.privateKeyId === privateKey.id);
            return (
              <div key={privateKey.id} className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-4">
                <div className="mb-3">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Account {privateKey.index} Public Key
                  </span>
                </div>
                
                {correspondingPublicKey ? (
                  <div className="space-y-2">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Public Key</span>
                        <button
                          onClick={() => copyToClipboard(correspondingPublicKey.key)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <div className="font-mono text-sm break-all text-gray-800 dark:text-gray-200">
                        {correspondingPublicKey.key}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Length: {correspondingPublicKey.key.replace('0x', '').length / 2} bytes
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No public key generated yet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}