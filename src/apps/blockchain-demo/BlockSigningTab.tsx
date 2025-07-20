import { useState, useEffect } from 'react';
import { useToast } from './Toast.jsx';

interface BlockSigningTabProps {
  currentTab: string;
  calculateHash: (input: string) => Promise<string>;
}

function BlockSigningTab({ 
  currentTab, 
  calculateHash
}: BlockSigningTabProps) {
  const { showSuccess, showWarning } = useToast();
  
  // Block state
  const [blockData, setBlockData] = useState({
    blockNumber: 1,
    data: '0xalice... → 0xbob...: 1.5 ETH\n0xcharlie... → 0xdiana...: 50 USDC',
    validator: 'Alice (0x1a2b3c...)',
    timestamp: Date.now()
  });
  
  const [currentHash, setCurrentHash] = useState<string>('');
  const [signature, setSignature] = useState<any>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  // Calculate hash whenever block data changes
  useEffect(() => {
    const calculateCurrentHash = async () => {
      if (calculateHash) {
        const input = `${blockData.blockNumber}${blockData.data}${blockData.validator}`;
        const hash = await calculateHash(input);
        setCurrentHash(hash);
        
        // Check if signature is still valid
        if (signature) {
          setIsValid(signature.hash === hash);
        }
      }
    };
    
    calculateCurrentHash();
  }, [blockData, calculateHash, signature]);

  const handleSignBlock = async () => {
    if (!calculateHash) return;
    
    const input = `${blockData.blockNumber}${blockData.data}${blockData.validator}`;
    const hash = await calculateHash(input);
    
    const newSignature = {
      hash: hash,
      blockNumber: blockData.blockNumber,
      data: blockData.data,
      validator: blockData.validator,
      timestamp: Date.now(),
      signedAt: new Date().toISOString()
    };
    
    setSignature(newSignature);
    setIsValid(true);
    
    showSuccess(
      `Block ${blockData.blockNumber} signed successfully!\n\nHash: ${hash.substring(0, 24)}...\nSigned by: ${blockData.validator.split('(')[0]}`,
      'Block Signed'
    );
  };

  const handleDataChange = (newData: string) => {
    setBlockData(prev => ({ ...prev, data: newData }));
    
    if (signature) {
      showWarning(
        'Block data changed! The signature is now invalid.\n\nClick "Sign Block" to create a new valid signature.',
        'Signature Invalid'
      );
    }
  };

  return (
    <>
      {currentTab === 'block-signing' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Block Signing</h2>
            <p className="text-gray-600 dark:text-gray-300">Sign individual blocks and see how data changes affect signatures</p>
          </div>

          {/* Block Display */}
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 transition-colors ${
            isValid 
              ? 'border-green-400 dark:border-green-500' 
              : 'border-red-400 dark:border-red-500'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Block Info */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Block Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Block Number:
                    </label>
                    <input
                      type="number"
                      value={blockData.blockNumber}
                      onChange={(e) => setBlockData(prev => ({ ...prev, blockNumber: parseInt(e.target.value) || 1 }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Validator:
                    </label>
                    <input
                      type="text"
                      value={blockData.validator}
                      onChange={(e) => setBlockData(prev => ({ ...prev, validator: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Transaction Data */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Transaction Data</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transactions (try editing!):
                  </label>
                  <textarea
                    value={blockData.data}
                    onChange={(e) => handleDataChange(e.target.value)}
                    className={`w-full h-32 p-3 border rounded-md text-sm font-mono resize-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      isValid 
                        ? 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 focus:border-blue-500' 
                        : 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                    }`}
                    placeholder="Enter transaction data..."
                  />
                </div>
              </div>
            </div>

            {/* Current Hash */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">Current Block Hash</h4>
              <div className={`p-3 rounded-md font-mono text-sm break-all ${
                isValid 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300'
              }`}>
                {currentHash || 'Calculating...'}
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">Block Signature</h4>
                <button
                  onClick={handleSignBlock}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    isValid && signature
                      ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                  }`}
                >
                  {isValid && signature ? 'Re-sign Block' : 'Sign Block'}
                </button>
              </div>

              {signature ? (
                <div className={`p-4 rounded-lg border ${
                  isValid 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className={`font-medium ${isValid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                        <strong>Status:</strong> {isValid ? 'Valid Signature' : 'Invalid Signature'}
                      </p>
                      <p className={isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                        <strong>Signed Hash:</strong>
                      </p>
                      <p className={`font-mono text-xs break-all ${isValid ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {signature.hash}
                      </p>
                    </div>
                    <div>
                      <p className={isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                        <strong>Signed At:</strong> {new Date(signature.timestamp).toLocaleTimeString()}
                      </p>
                      <p className={isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                        <strong>Signed Data:</strong>
                      </p>
                      <p className={`text-xs ${isValid ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        Block #{signature.blockNumber}
                      </p>
                      <p className={`text-xs ${isValid ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        Validator: {signature.validator.split('(')[0]}
                      </p>
                    </div>
                  </div>
                  
                  {!isValid && (
                    <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded">
                      <p className="text-xs text-red-700 dark:text-red-300">
                        <strong>Warning:</strong> The block data has been modified since signing. 
                        The current hash ({currentHash.substring(0, 16)}...) does not match the signed hash 
                        ({signature.hash.substring(0, 16)}...).
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-center text-gray-600 dark:text-gray-300">
                  <p>No signature yet. Click "Sign Block" to create a cryptographic signature.</p>
                </div>
              )}
            </div>
          </div>

          {/* Educational Note */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How Block Signing Works:</h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p>• <strong>Hash Calculation</strong>: Block hash is calculated from block number, transaction data, and validator</p>
              <p>• <strong>Signing Process</strong>: The validator cryptographically signs the calculated hash</p>
              <p>• <strong>Verification</strong>: Any change to block data changes the hash, invalidating the signature</p>
              <p>• <strong>Security</strong>: This prevents tampering - any modification is immediately detectable</p>
              <p>• <strong>Ethereum Reality</strong>: Real validators sign block hashes using their private keys</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BlockSigningTab;