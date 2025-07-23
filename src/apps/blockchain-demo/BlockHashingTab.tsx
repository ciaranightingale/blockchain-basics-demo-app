import { useState, useEffect } from 'react';

interface BlockHashingTabProps {
  currentTab: string;
  calculateHash: (input: string) => Promise<string>;
}

function BlockHashingTab({ 
  currentTab, 
  calculateHash
}: BlockHashingTabProps) {
  
  // Block state
  const [blockData, setBlockData] = useState({
    blockNumber: 1,
    data: 'Hello World! This is some data in the block.',
    validator: 'You!',
    timestamp: Date.now()
  });
  
  const [currentHash, setCurrentHash] = useState<string>('');
  const [isHashExplicitlyCalculated, setIsHashExplicitlyCalculated] = useState<boolean>(false);

  // Calculate hash automatically whenever block data changes
  useEffect(() => {
    const calculateCurrentHash = async () => {
      if (calculateHash) {
        const input = `${blockData.blockNumber}${blockData.data}${blockData.validator}${blockData.timestamp}`;
        const hash = await calculateHash(input);
        setCurrentHash(hash);
        setIsHashExplicitlyCalculated(true);
      }
    };
    
    calculateCurrentHash();
  }, [blockData.blockNumber, blockData.data, blockData.validator, blockData.timestamp, calculateHash]);

  const handleHashBlock = async () => {
    if (!calculateHash) return;
    
    const input = `${blockData.blockNumber}${blockData.data}${blockData.validator}${blockData.timestamp}`;
    const hash = await calculateHash(input);
    setCurrentHash(hash);
    setIsHashExplicitlyCalculated(true);
  };

  const handleDataChange = (newData: string) => {
    setBlockData(prev => ({ ...prev, data: newData }));
    
    if (isHashExplicitlyCalculated) {
      setIsHashExplicitlyCalculated(false);
    }
  };

  return (
    <>
      {currentTab === 'block-hashing' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Block Hashing</h2>
            <p className="text-gray-600 dark:text-gray-300">See how block data is structured and hashed to create a unique fingerprint</p>
          </div>

          {/* Block Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-green-400 dark:border-green-500">
            {/* Block Info */}
            <div className="mb-6">
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
                
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Block proposer:
                  </label>
                  <input
                    type="text"
                    value={blockData.validator}
                    onChange={(e) => setBlockData(prev => ({ ...prev, validator: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div> */}

              </div>
            </div>

            {/* Block Data */}
            <div className="mb-6">              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data (try editing!):
                </label>
                <textarea
                  value={blockData.data}
                  onChange={(e) => handleDataChange(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono resize-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-blue-300 dark:hover:border-blue-400 focus:border-blue-500"
                  placeholder="Enter any data you want to include in this block..."
                />
              </div>
            </div>

            {/* Current Hash */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">Current Block Hash</h4>
              <div className="p-3 rounded-md font-mono text-sm break-all bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300">
                {currentHash || 'Calculating...'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Hash updates automatically as you edit block data
              </p>
            </div>

            {/* Hash Block Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">Block Hash Details</h4>
                <button
                  onClick={handleHashBlock}
                  className="px-4 py-2 font-medium rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  Re-calculate Hash
                </button>
              </div>
              
              {isHashExplicitlyCalculated ? (
                <div className="p-3 rounded-md font-mono text-sm break-all border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300">
                  {currentHash}
                </div>
              ) : (
                <div className="p-3 rounded-md text-sm border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-center">
                  Hash calculating automatically...
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This creates a unique fingerprint of all block data - any change will result in a completely different hash
              </p>
            </div>
          </div>

          {/* Educational Note */}
          <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">How Block Hashing Works:</h4>
            <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
              <p>• <strong>Block Components</strong>: All block data (block number and associated data) is combined</p>
              <p>• <strong>Deterministic Process</strong>: Same block data always produces the same hash</p>
              <p>• <strong>Avalanche Effect</strong>: Changing any data completely changes the hash</p>
              <p>• <strong>Fixed Output</strong>: Hash is always 256 bits (64 hex characters) regardless of input size</p>
              <p>• <strong>Unique Fingerprint</strong>: Each unique block gets a unique hash - no two different blocks can have the same hash</p>
              <p>• <strong>Next Step</strong>: Once hashed, this unique fingerprint can be cryptographically signed by the block proposer</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BlockHashingTab;