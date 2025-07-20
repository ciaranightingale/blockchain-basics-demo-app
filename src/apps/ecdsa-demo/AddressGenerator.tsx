import { useState, useEffect } from 'react';
import { getEthereumAddress } from '../../utils/crypto';

interface PublicKey {
  id: string;
  key: string;
  compressed: boolean;
}

interface Address {
  id: string;
  address: string;
  sourceKeyId: string;
}

interface AddressGeneratorProps {
  publicKeys: PublicKey[];
}

export default function AddressGenerator({ publicKeys }: AddressGeneratorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (publicKeys.length === 0) {
      setAddresses([]);
    }
  }, [publicKeys.length]);

  const generateAddresses = () => {
    const newAddresses: Address[] = [];
    
    publicKeys.forEach(publicKey => {
      const ethereumAddress = getEthereumAddress(publicKey.key);
      
      newAddresses.push({
        id: `ethereum-${publicKey.id}`,
        address: ethereumAddress,
        sourceKeyId: publicKey.id
      });
    });
    
    setAddresses(newAddresses);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSourceKeyInfo = (sourceKeyId: string) => {
    const sourceKey = publicKeys.find(key => key.id === sourceKeyId);
    return sourceKey ? 'Public Key' : 'Unknown';
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">3</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Derive Address</h2>
      </div>

      {publicKeys.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-300">
          <p>Generate a public key first to create an address</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            <p>Generate an Ethereum address from your public key:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Ethereum addresses are derived from the keccak256 hash of the public key</li>
              <li>The address is the last 20 bytes of the hash</li>
            </ul>
          </div>

          <button
            onClick={generateAddresses}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Generate Address
          </button>

          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 dark:bg-purple-500/30 text-purple-700 dark:text-purple-300">
                      Ethereum Address
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      from {getSourceKeyInfo(address.sourceKeyId)}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(address.address)}
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-3 rounded-md text-sm transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-gray-600 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    title="Copy to clipboard"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <div className="font-mono text-sm break-all bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  {address.address}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Length: {address.address.replace('0x', '').length / 2} bytes
                </p>
              </div>
            ))}
          </div>

          {addresses.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              <p>No address generated yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}