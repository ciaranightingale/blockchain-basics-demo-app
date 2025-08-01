import { useState, useEffect } from 'react';
import { getEthereumAddress } from '../../utils/crypto';
import { Copy } from 'lucide-react';

interface PublicKey {
  id: string;
  key: string;
  compressed: boolean;
  privateKeyId: string;
}

interface Address {
  id: string;
  address: string;
  sourceKeyId: string;
}

interface AddressGeneratorProps {
  publicKeys: PublicKey[];
  onAddressesChange: (addresses: Address[]) => void;
}

export default function AddressGenerator({ publicKeys, onAddressesChange }: AddressGeneratorProps) {
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
    onAddressesChange(newAddresses);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSourceKeyInfo = (sourceKeyId: string) => {
    const sourceKey = publicKeys.find(key => key.id === sourceKeyId);
    if (sourceKey && sourceKey.privateKeyId) {
      const accountIndex = sourceKey.privateKeyId.replace('key-', '');
      return `Account ${accountIndex}`;
    }
    return sourceKey ? 'Public Key' : 'Unknown';
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        4. Generate Addresses
      </h2>

      {publicKeys.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Generate public keys first to create addresses
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            <p>Generate Ethereum addresses from your public keys:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Each public key generates a unique Ethereum address</li>
              <li>Addresses are derived from the keccak256 hash of the public key</li>
              <li>The address is the last 20 bytes of the hash, formatted with 0x prefix</li>
            </ul>
          </div>

          <button
            onClick={generateAddresses}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Generate All Addresses ({publicKeys.length})
          </button>

          {addresses.map((address) => (
            <div key={address.id} className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-4">
              <div className="mb-3">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {getSourceKeyInfo(address.sourceKeyId)} Address
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ethereum Address</span>
                    <button
                      onClick={() => copyToClipboard(address.address)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="font-mono text-sm break-all text-gray-800 dark:text-gray-200">
                    {address.address}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Length: {address.address.replace('0x', '').length / 2} bytes
                  </p>
                </div>
              </div>
            </div>
          ))}

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