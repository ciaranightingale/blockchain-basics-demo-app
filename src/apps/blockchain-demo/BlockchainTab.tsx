import React from 'react';
import { useToast } from './Toast';

// Type definitions
interface Validator {
  id: string;
  name: string;
  isActive: boolean;
  stake?: number;
}

interface Block {
  block: number;
  data: string;
  hash: string;
  prevHash: string;
  validator: string;
  isValid: boolean | 'unsigned';
  isMalicious?: boolean;
  finalized?: boolean;
  attestations?: number;
}

interface BlockchainTabProps {
  validators: Validator[];
  currentTab: string;
  blockchain: Block[];
  handleBlockchainDataChange?: (blockIndex: number, newData: string) => void;
  handleValidateBlock?: (blockIndex: number) => void;
}

const BlockchainTab: React.FC<BlockchainTabProps> = ({ 
  validators, 
  currentTab, 
  blockchain,
  handleBlockchainDataChange,
  handleValidateBlock
}) => {
  // Get toast functions from context
  const { showError } = useToast();

  // Enhanced handler with toast notifications for blockchain changes
  const handleDataChange = (blockIndex: number, newData: string): void => {
    if (!handleBlockchainDataChange) {
      showError('Blockchain data change handler not available', '❌ Error');
      return;
    }

    // Store original data to compare
    // const originalData = blockchain[blockIndex]?.data;
    
    // Call the parent handler
    handleBlockchainDataChange(blockIndex, newData);
  };

  return (
    <>
      {currentTab === 'blockchain' && (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Ethereum PoS Blockchain</h2>
            <p className="text-gray-600 dark:text-gray-300">View the blockchain and experiment with hash validation and signing</p>
          </div>

          {/* Hash Validation Explainer */}
          <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Try This: Edit Transaction Data</h4>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Click on any transaction data in the blocks below and change it. Watch how it breaks the blockchain! 
              All blocks after the changed one will turn red because their "previous hash" no longer matches.
            </p>
          </div>

          {/* Horizontal Blockchain View */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-blue-500 dark:border-blue-400">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">Blockchain</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {blockchain.length} blocks • Scroll right to see latest →
              </div>
            </div>
            
            {/* Horizontal Scrollable Blockchain */}
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max">
                {blockchain.map((block, index) => (
                  <div key={index} className="flex items-center">
                    {/* Block */}
                    <div 
                      className={`w-80 h-[28rem] flex-shrink-0 border-2 rounded-lg p-4 transition-colors relative ${
                        block.isMalicious
                          ? 'border-red-600 bg-red-100 dark:bg-red-900/20 dark:border-red-500 shadow-red-200 shadow-lg'
                          : block.isValid === false
                          ? 'border-red-400 bg-red-50 dark:bg-red-900/10 dark:border-red-400' 
                          : block.isValid === true
                          ? 'border-green-400 bg-green-50 dark:bg-green-900/10 dark:border-green-400' 
                          : 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-400'
                      }`}
                    >
                      <div className="h-full flex flex-col">
                        {/* Block Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-gray-900 dark:text-white">Block {block.block}</span>
                            {block.isMalicious && (
                              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold">
                                MALICIOUS
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              block.isValid === false
                                ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                : block.isValid === true
                                ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' 
                                : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                            }`}>
                              {block.isValid === false ? 'Unsigned' : block.isValid === true ? 'Signed' : 'Unsigned'}
                            </span>
                            {block.finalized && (
                              <span className="text-xs bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                                {block.attestations}% consensus
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Validator */}
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          <strong>Validator:</strong> {block.validator.split('(')[0]}
                        </div>

                        {/* Transactions */}
                        <div className="mb-2 flex-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Transactions (try editing!):
                          </label>
                          <textarea
                            value={block.data}
                            onChange={(e) => handleDataChange(index, e.target.value)}
                            className={`w-full h-20 p-2 border rounded text-xs font-mono resize-none transition-colors ${
                              block.isValid === false
                                ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300' 
                                : block.isValid === 'unsigned'
                                ? 'border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-300'
                                : 'border-gray-300 hover:border-blue-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-blue-400 dark:focus:border-blue-400'
                            }`}
                            placeholder="No transactions"
                          />
                        </div>

                        {/* Hashes */}
                        <div className="space-y-2 mt-auto">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Previous Hash:</label>
                            <div className={`text-xs font-mono break-all p-1 rounded overflow-auto max-h-20 ${
                              block.isValid === false && index > 0
                                ? 'text-red-800 bg-red-100 border border-red-300 dark:text-red-300 dark:bg-red-900/20 dark:border-red-500'
                                : block.isValid === 'unsigned' && index > 0
                                ? 'text-yellow-800 bg-yellow-100 border border-yellow-300 dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-500'
                                : 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700'
                            }`}>
                              {block.prevHash}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Block Hash:</label>
                            <div className={`text-xs font-mono break-all p-1 rounded overflow-auto max-h-20 ${
                              block.isValid === false
                                ? 'text-red-800 bg-red-100 border border-red-300 dark:text-red-300 dark:bg-red-900/20 dark:border-red-500' 
                                : block.isValid === 'unsigned'
                                ? 'text-yellow-800 bg-yellow-100 border border-yellow-300 dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-500'
                                : 'text-gray-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/20'
                            }`}>
                              {block.hash}
                            </div>
                          </div>
                          
                          {/* Sign Block Button */}
                          <div className="pt-2">
                            <button
                              onClick={() => handleValidateBlock && handleValidateBlock(index)}
                              className={`w-full px-3 py-2 text-xs font-medium rounded transition-colors ${
                                block.isValid === false
                                  ? 'bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700'
                                  : block.isValid === 'unsigned'
                                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700'
                                  : 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700'
                              }`}
                            >
                              {block.isValid === false ? 'Sign Block' : block.isValid === 'unsigned' ? 'Sign Block' : 'Signed'}
                            </button>
                          </div>
                        </div>
                        {block.isValid === 'unsigned' && (
                          <div className="absolute bottom-2 left-2 right-2 bg-yellow-100 border border-yellow-300 rounded px-2 py-1 z-10 dark:bg-yellow-900/30 dark:border-yellow-600">
                            <p className="text-xs text-yellow-700 font-medium text-center dark:text-yellow-300">
                              Unsigned - Needs signature
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow connecting blocks */}
                    {index < blockchain.length - 1 && (
                      <div className="flex-shrink-0 mx-2">
                        <div className={`text-2xl transition-colors ${
                          blockchain[index + 1].isValid === false ? 'text-red-400' : 
                          blockchain[index + 1].isValid === 'unsigned' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>→</div>
                      </div>
                    )}
                  </div>
                ))}

              </div>
            </div>

            {blockchain.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-6xl mb-4">CHAIN</div>
                <p className="text-lg font-medium">Genesis Block</p>
                <p className="text-sm">Propose the first block to start the chain!</p>
              </div>
            )}

            {/* Educational Note */}
            {/* <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🧠 How Blockchain Hash Validation Works:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>Each block contains</strong> the hash (fingerprint) of the previous block</p>
                <p>• <strong>If you change any data</strong> in a block, its hash changes completely</p>
                <p>• <strong>This breaks the chain</strong> - all following blocks become invalid (red)</p>
                <p>• <strong>This is why blockchain is secure</strong> - you can't secretly change old transactions!</p>
              </div>
            </div> */}
          </div>

          {/* Bottom Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{blockchain.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Blocks</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {blockchain.filter(b => b.finalized).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Finalized</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {blockchain.filter(b => b.isValid === false).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Invalid Blocks</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {validators.filter(v => v.isActive).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Validators</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlockchainTab;