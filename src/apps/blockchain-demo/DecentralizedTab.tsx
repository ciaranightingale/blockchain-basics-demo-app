import { useState, useEffect } from 'react';
import { useToast } from './Toast';

interface DecentralizedTabProps {
  currentTab: string;
  validators: any[];
  setValidators: (validators: any[]) => void;
  pendingProposal: any;
  handleProposeBlockDecentralized: () => void;
  handleVoteBlock: (validatorName: string, voteType: 'approve' | 'reject') => void;
  validatorVotes: Record<string, any>;
  selectedProposer: string;
  setSelectedProposer: (proposer: string) => void;
  autoSelectedValidator: string;
  pendingTransactions: any[];
  selectedTransactions: number[];
  handleTxSelection: (txId: number, isSelected: boolean) => void;
  blockchain: any[];
  calculateHash: (input: string) => Promise<string>;
  handleDataChange: (blockIndex: number, newData: string) => void;
  handleValidateBlock: (blockIndex: number) => void;
}

function DecentralizedTab({ 
  currentTab, 
  validators, 
  setValidators,
  pendingProposal,
  handleProposeBlockDecentralized,
  handleVoteBlock,
  validatorVotes,
  selectedProposer,
  setSelectedProposer,
  autoSelectedValidator,
  pendingTransactions,
  selectedTransactions,
  handleTxSelection,
  blockchain,
  calculateHash,
  handleDataChange,
  handleValidateBlock
}: DecentralizedTabProps) {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [newValidatorName, setNewValidatorName] = useState('');
  const [newValidatorStake, setNewValidatorStake] = useState(32);
  const [selectedValidator, setSelectedValidator] = useState('');
  const [additionalStake, setAdditionalStake] = useState(32);
  
  // Block proposal hash and signature state
  const [currentHash, setCurrentHash] = useState<string>('');
  const [signature, setSignature] = useState<any>(null);

  // Calculate hash automatically when selected transactions change
  useEffect(() => {
    const calculateBlockHash = async () => {
      if (calculateHash && selectedTransactions.length > 0) {
        const blockNumber = blockchain.length + 1;
        const proposer = selectedProposer || autoSelectedValidator;
        const transactionData = selectedTransactions
          .map(txId => pendingTransactions.find(tx => tx.id === txId))
          .filter(tx => tx)
          .map(tx => `${tx.from}→${tx.to}: ${tx.amount}`)
          .join('\n');
        
        const input = `${blockNumber}${transactionData}${proposer}`;
        const hash = await calculateHash(input);
        setCurrentHash(hash);
        
        // Reset signature when transaction data changes
        setSignature(null);
      } else if (!pendingProposal && selectedTransactions.length === 0) {
        // Only clear hash if there's no pending proposal
        setCurrentHash('');
        setSignature(null);
      }
    };
    
    calculateBlockHash();
  }, [selectedTransactions, selectedProposer, autoSelectedValidator, blockchain.length, calculateHash, pendingTransactions, pendingProposal]);

  const handleSignAndProposeBlock = async () => {
    if (!currentHash) return;
    
    const proposer = selectedProposer || autoSelectedValidator;
    
    // Create signature
    const newSignature = {
      hash: currentHash,
      blockNumber: blockchain.length + 1,
      proposer: proposer,
      transactionCount: selectedTransactions.length,
      timestamp: Date.now(),
      signedAt: new Date().toISOString()
    };
    
    setSignature(newSignature);
    
    // Call the original proposal handler
    handleProposeBlockDecentralized();
  };

  const handleAddValidator = () => {
    if (newValidatorName) {
      if (newValidatorStake < 32) {
        showError(
          'Insufficient stake! Validators must have at least 32 ETH to participate in consensus.',
          'Minimum Stake Required'
        );
        return;
      }
      
      const newValidator = {
        id: Math.random().toString(16).substring(2, 8),
        address: `0x${Math.random().toString(16).substring(2, 8)}...`,
        name: newValidatorName,
        stake: newValidatorStake,
        isActive: true,
        isMalicious: false,
        slashingRisk: 0,
        rewards: 0,
        uptime: 100
      };
      
      const updatedValidators = [...validators, newValidator];
      setValidators(updatedValidators);
      
      setNewValidatorName('');
      setNewValidatorStake(32);
      
      setTimeout(() => {
        showSuccess(
          `Validator "${newValidator.name}" created successfully!\n\nStake: ${newValidator.stake} ETH\nStatus: Active\n\nYou can now see this validator participating in consensus.`,
          'Validator Created'
        );
      }, 100);
    } else {
      showError('Please enter a valid validator name.', 'Invalid Input');
    }
  };

  const handleAddStakeToValidator = () => {
    if (selectedValidator && additionalStake > 0) {
      const updatedValidators = validators.map(validator => 
        validator.name === selectedValidator
          ? { ...validator, stake: Math.min(2048, validator.stake + additionalStake) }
          : validator
      );
      setValidators(updatedValidators);
      
      const validator = validators.find(v => v.name === selectedValidator);
      const newStake = Math.min(2048, (validator?.stake || 0) + additionalStake);
      
      setSelectedValidator('');
      setAdditionalStake(32);
      
      setTimeout(() => {
        showSuccess(
          `Added ${additionalStake} ETH stake to validator "${selectedValidator}"!\n\nNew total stake: ${newStake} ETH\nVoting power increased proportionally.`,
          'Stake Added'
        );
      }, 100);
    } else {
      showError('Please select a validator and enter a valid stake amount.', 'Invalid Input');
    }
  };

  // Toggle validator active status
  const toggleValidatorStatus = (validatorName: string) => {
    const validator = validators.find(v => v.name === validatorName);
    if (!validator) return;
    
    if (!validator.isActive && validator.stake < 32) {
      setTimeout(() => {
        showError(
          `Cannot activate validator "${validatorName}" - insufficient stake!\n\nMinimum required: 32 ETH\nCurrent stake: ${validator.stake} ETH\n\nPlease add more stake to reactivate this validator.`,
          'Insufficient Stake'
        );
      }, 100);
      return;
    }
    
    const updatedValidators = validators.map(v => 
      v.name === validatorName
        ? { ...v, isActive: !v.isActive }
        : v
    );
    setValidators(updatedValidators);
    
    const newStatus = !validator.isActive;
    
    setTimeout(() => {
      showInfo(
        `Validator "${validatorName}" ${newStatus ? 'activated' : 'deactivated'}!\n\nThey are now ${newStatus ? 'available' : 'unavailable'} for block proposal.`,
        `Validator ${newStatus ? 'Activated' : 'Deactivated'}`
      );
    }, 100);
  };

  const handleMaliciousVote = (validatorName: string, voteType: 'approve' | 'reject') => {
    handleVoteBlock(validatorName, voteType);
  };

  // Track when blocks are finalized to handle slashing
  const [processedBlocks, setProcessedBlocks] = useState<Set<number>>(new Set());
  const [lastVotes, setLastVotes] = useState<Record<string, any>>({});
  
  // Capture votes before they get cleared
  useEffect(() => {
    if (Object.keys(validatorVotes).length > 0) {
      setLastVotes({ ...validatorVotes });
    }
  }, [validatorVotes]);
  
  useEffect(() => {
    if (blockchain.length === 0) return;
    
    const latestBlock = blockchain[blockchain.length - 1];
    
    // Only process if this is a new block we haven't seen before
    if (latestBlock.finalized && !processedBlocks.has(latestBlock.block)) {
      setProcessedBlocks(prev => new Set([...prev, latestBlock.block]));
      
      // Check if any malicious validators participated in this block's consensus
      const handleSlashing = () => {
        const allVotes = Object.values(lastVotes || {});
        
        const maliciousVotes = allVotes.filter(vote => {
          const voter = validators.find(v => v.name === vote?.validatorName);
          return voter?.isMalicious && vote !== null;
        });
        
        // Only slash if malicious validators actually voted
        if (maliciousVotes.length === 0) return;
        
        // Check for coordinated attack (multiple malicious validators voting the same way)
        const maliciousApproveVotes = maliciousVotes.filter(v => v.voteType === 'approve');
        const maliciousRejectVotes = maliciousVotes.filter(v => v.voteType === 'reject');
        const isCoordinatedAttack = maliciousApproveVotes.length > 1 || maliciousRejectVotes.length > 1;
        
        if (isCoordinatedAttack) {
          // Slash all malicious validators who voted the same way 100%
          const coordAttackValidators = isCoordinatedAttack ? 
            (maliciousApproveVotes.length > 1 ? maliciousApproveVotes : maliciousRejectVotes) : [];
            
          const updatedValidators = validators.map(v => {
            const isInCoordAttack = coordAttackValidators.some(vote => vote.validatorName === v.name);
            if (isInCoordAttack) {
              return { ...v, stake: 0, isActive: false };
            }
            return v;
          });
          setValidators(updatedValidators);
          
          const maliciousNames = coordAttackValidators.map(v => v.validatorName).join(', ');
          setTimeout(() => {
            showError(
              `Coordinated attack detected! All participating malicious validators slashed 100% of their stake and deactivated.\n\nMalicious validators: ${maliciousNames}\n\nTotal validators slashed: ${coordAttackValidators.length}`,
              'Coordinated Attack Slashing'
            );
          }, 500);
        } else {
          // Slash individual malicious validators 50%
          const updatedValidators = validators.map(v => {
            const maliciousVote = maliciousVotes.find(vote => vote.validatorName === v.name);
            if (maliciousVote) {
              const newStake = Math.max(0, v.stake * 0.5);
              const willBeDeactivated = newStake < 32;
              return { ...v, stake: newStake, isActive: !willBeDeactivated && v.isActive };
            }
            return v;
          });
          setValidators(updatedValidators);
          
          maliciousVotes.forEach((vote, index) => {
            const validator = validators.find(v => v.name === vote.validatorName);
            if (validator) {
              const newStake = Math.max(0, validator.stake * 0.5);
              const willBeDeactivated = newStake < 32;
              setTimeout(() => {
                showWarning(
                  `Malicious validator "${vote.validatorName}" slashed 50% of stake for malicious voting!\n\nStake reduced from ${validator.stake} ETH to ${newStake} ETH${willBeDeactivated ? ' and deactivated due to insufficient stake' : ''}`,
                  'Malicious Behavior Slashing'
                );
              }, 500 + (index * 1000));
            }
          });
        }
      };
      
      // Only trigger slashing if there were malicious votes in the consensus
      const allVotes = Object.values(lastVotes || {});
      const hasMaliciousVotes = allVotes.some(vote => {
        const voter = validators.find(v => v.name === vote?.validatorName);
        return voter?.isMalicious && vote !== null;
      });
      
      if (hasMaliciousVotes) {
        setTimeout(handleSlashing, 1000);
      }
    }
  }, [blockchain, validators, lastVotes, setValidators, showError, showWarning, processedBlocks]);

  const handleWithdraw = (validatorName: string, amount: number) => {
    const validator = validators.find(v => v.name === validatorName);
    if (!validator) return;
    
    const newStake = Math.max(0, validator.stake - amount);
    const willBeDeactivated = newStake < 32;
    
    const updatedValidators = validators.map(v => 
      v.name === validatorName
        ? { ...v, stake: newStake, isActive: !willBeDeactivated && v.isActive }
        : v
    );
    setValidators(updatedValidators);
    
    setTimeout(() => {
      showWarning(
        `Validator "${validatorName}" has withdrawn ${amount} ETH${willBeDeactivated ? ' and been deactivated' : ''}.\n\n${willBeDeactivated ? 'They will no longer be available for block proposal.' : `New stake: ${newStake} ETH`}`,
        'Stake Withdrawn'
      );
    }, 100);
  };

  return (
    <>
      {currentTab === 'validators' && (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Validators</h2>
            <p className="text-gray-600 dark:text-gray-300">Manage validators and see how they participate in consensus. Stake up to 2048 ETH per validator.</p>
          </div>

          {/* Step-by-Step Guide */}
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-4">
              Try this:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <div className="font-medium text-amber-900 dark:text-amber-200">Select Transactions</div>
                  <div className="text-amber-800 dark:text-amber-300">Choose transactions from the pending block on the right</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <div className="font-medium text-amber-900 dark:text-amber-200">Propose Block</div>
                  <div className="text-amber-800 dark:text-amber-300">Click "Sign & Propose Block" to submit your proposal</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <div className="font-medium text-amber-900 dark:text-amber-200">Validators Attest</div>
                  <div className="text-amber-800 dark:text-amber-300">Scroll down to have each validator attest YES/NO</div>
                </div>
              </div>
            </div>
            {/* {!pendingProposal && selectedTransactions.length === 0 && ( */}
              <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-600">
                <div className="text-amber-800 dark:text-amber-300">
                  <strong>Challenge:</strong> Can you also make 2/3 of validators malicious and then finalize a malicious block?
                </div>
              </div>
            {/* )} */}
            {pendingProposal && (
              <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-600">
                <div className="text-amber-800 dark:text-amber-300">
                  <strong>Next step:</strong> Scroll down to the validators section and have each validator attest to the proposal!
                </div>
              </div>
            )}
          </div>

          {/* PoS Blockchain Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 border-blue-500 dark:border-blue-400 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">PoS Blockchain</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {blockchain.length} blocks • Pending block on right →
              </div>
            </div>
            
            {/* Horizontal Scrollable Blockchain */}
            <div className="overflow-x-auto pb-4" 
                 ref={(el) => {
                   if (el) {
                     el.scrollLeft = el.scrollWidth;
                   }
                 }}>
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
                              {block.isValid === false ? 'Invalid' : block.isValid === true ? 'Valid' : 'Unsigned'}
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
                          <strong>Proposer:</strong> {block.validator.split('(')[0]}
                        </div>

                        {/* Transactions */}
                        <div className="mb-2 flex-1">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Transactions:
                          </label>
                          <textarea 
                            value={block.data || ''}
                            onChange={(e) => handleDataChange(index, e.target.value)}
                            className={`w-full h-20 p-2 border rounded text-xs font-mono resize-none ${
                              block.isValid === false
                                ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300' 
                                : block.isValid === 'unsigned'
                                ? 'border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-300'
                                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                            }`}
                            placeholder="No transactions"
                          />
                        </div>

                        {/* Hashes */}
                        <div className="space-y-2 mt-auto">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Previous Hash:</label>
                            <div className={`text-xs font-mono break-all p-1 rounded overflow-auto max-h-16 ${
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
                            <div className={`text-xs font-mono break-all p-1 rounded overflow-auto max-h-16 ${
                              block.isValid === false
                                ? 'text-red-800 bg-red-100 border border-red-300 dark:text-red-300 dark:bg-red-900/20 dark:border-red-500' 
                                : block.isValid === 'unsigned'
                                ? 'text-yellow-800 bg-yellow-100 border border-yellow-300 dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-500'
                                : 'text-gray-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/20'
                            }`}>
                              {block.hash}
                            </div>
                          </div>
                        </div>
                        
                        {/* Sign Block Button */}
                        <div className="pt-2">
                          <button 
                            onClick={() => handleValidateBlock(index)}
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
                    </div>
                    
                    {/* Arrow between blocks */}
                    <div className="flex-shrink-0 px-2">
                      <div className="text-gray-400 dark:text-gray-600">→</div>
                    </div>
                  </div>
                ))}

                {/* Pending Block - Always Present */}
                <div className="flex items-center">
                  <div className="w-80 h-[28rem] flex-shrink-0 border-2 rounded-lg p-4 border-orange-400 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-500">
                    <div className="h-full flex flex-col">
                      {/* Block Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-gray-900 dark:text-white">Block {blockchain.length + 1}</span>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200">
                            Pending
                          </span>
                        </div>
                      </div>

                      {/* Proposer Selection */}
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Proposer: {selectedProposer ? selectedProposer.split('(')[0] : autoSelectedValidator.split('(')[0]}</label>
                        <select
                          value={selectedProposer}
                          onChange={(e) => setSelectedProposer(e.target.value)}
                          className="w-full p-1 border border-orange-300 dark:border-orange-500 rounded text-xs bg-orange-50 dark:bg-orange-900/20 text-gray-900 dark:text-white"
                        >
                          <option value="">Auto-select</option>
                          {validators.filter(v => v.isActive).map((validator, index) => (
                            <option key={index} value={`${validator.name} (${validator.address})`}>
                              {validator.name} - {validator.stake} ETH
                            </option>
                          ))}
                        </select>
                        {/* <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                          Selected: 
                        </div> */}
                      </div>

                      {/* Transaction Selection */}
                      <div className="mb-2 flex-1">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Transactions:
                        </label>
                        <div className="w-full h-20 p-2 border border-orange-300 bg-orange-50 dark:border-orange-500 dark:bg-orange-900/20 rounded text-xs overflow-y-auto">
                          {pendingTransactions.map(tx => (
                            <label key={tx.id} className="flex items-center space-x-2 p-1 hover:bg-orange-100 dark:hover:bg-orange-800/20 rounded cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={selectedTransactions.includes(tx.id)}
                                onChange={(e) => handleTxSelection(tx.id, e.target.checked)}
                                className="h-3 w-3 text-orange-600"
                              />
                              <div className="flex-1 text-xs text-orange-800 dark:text-orange-300">
                                <div className="font-semibold">{tx.amount}</div>
                                <div className="text-orange-600 dark:text-orange-400">{tx.from.substring(0, 8)}→{tx.to.substring(0, 8)}</div>
                              </div>
                            </label>
                          ))}
                          {pendingTransactions.length === 0 && (
                            <div className="text-xs text-orange-600 dark:text-orange-400 text-center py-2">
                              No pending transactions
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Hashes */}
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Previous Hash:</label>
                          <div className="text-xs font-mono break-all p-1 rounded overflow-auto max-h-16 text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700">
                            {blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : '0x0000...'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Block Hash:</label>
                          <div className="text-xs font-mono break-all p-1 rounded overflow-auto max-h-16 text-orange-800 bg-orange-100 border border-orange-300 dark:text-orange-300 dark:bg-orange-900/20 dark:border-orange-500">
                            {currentHash || 'Select transactions to calculate...'}
                          </div>
                        </div>
                        <div>
                          {signature && (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Signature:</label>
                              <div className="text-xs font-mono break-all p-1 rounded overflow-auto max-h-16 text-orange-800 bg-orange-100 border border-orange-300 dark:text-orange-300 dark:bg-orange-900/20 dark:border-orange-500">
                                Signed at {new Date(signature.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          )}
                          <div className="pt-2">
                            <button
                              onClick={handleSignAndProposeBlock}
                              disabled={pendingProposal || selectedTransactions.length === 0}
                              className="w-full px-3 py-2 font-medium rounded transition-colors bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-xs"
                            >
                              {pendingProposal 
                                ? 'Proposing...' 
                                : selectedTransactions.length === 0 
                                ? 'Select Transactions' 
                                : 'Sign & Propose Block'
                              }
                            </button>
                            {selectedTransactions.length === 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {blockchain.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    No blocks in the blockchain yet. Use the pending block on the right to propose the first block!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Proposal Section */}
          {pendingProposal && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-4">Pending Block Proposal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>Proposer:</strong> {pendingProposal.proposer.split('(')[0]}
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>Block:</strong> #{pendingProposal.blockNumber}
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>Transactions:</strong> {pendingProposal.transactions.length}
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>Hash:</strong> {pendingProposal.hash}
                  </p>
                </div>
                <div>
                  {(() => {
                    const activeValidators = validators.filter(v => v.isActive);
                    const totalStake = activeValidators.reduce((sum, v) => sum + v.stake, 0);
                    const allVotes = Object.values(validatorVotes || {});
                    const yesVotes = allVotes.filter(v => v.voteType === 'approve');
                    const noVotes = allVotes.filter(v => v.voteType === 'reject');
                    const yesStake = yesVotes.reduce((sum, v) => sum + v.stake, 0);
                    const noStake = noVotes.reduce((sum, v) => sum + v.stake, 0);
                    const requiredStake = (totalStake * 2) / 3;
                    const yesPercentage = ((yesStake / totalStake) * 100).toFixed(1);
                    const noPercentage = ((noStake / totalStake) * 100).toFixed(1);
                    const votedCount = allVotes.length;
                    const totalValidators = activeValidators.length;
                    
                    return (
                      <>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          <strong>Votes:</strong> {votedCount}/{totalValidators} validators
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          <strong>YES:</strong> {yesStake.toFixed(1)} ETH ({yesPercentage}%)
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          <strong>NO:</strong> {noStake.toFixed(1)} ETH ({noPercentage}%)
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          <strong>Required:</strong> {requiredStake.toFixed(1)} ETH (66.7%)
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          <strong>Status:</strong> {votedCount === totalValidators ? (yesStake >= requiredStake ? 'Ready to Finalize' : 'Will be Rejected') : 'Awaiting Attestations'}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Validators Section */}
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 ${
            pendingProposal ? 'ring-2 ring-amber-400 ring-opacity-50 border-amber-300' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold dark:text-white">Your Validators</h3>
              {pendingProposal && (
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                  Awaiting Attestations
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {validators.map((validator, validatorIndex) => (
                <div key={validatorIndex} className={`border-2 rounded-lg p-4 ${
                  validator.isMalicious 
                    ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : validator.isActive 
                    ? 'border-green-300 dark:border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium dark:text-white">{validator.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      validator.isActive 
                        ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {validator.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Stake: {validator.stake} ETH
                    {validator.stake < 32 && (
                      <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-medium">
                        (Below minimum)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Address: {validator.address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Attestation Power: {validator.isActive ? ((validator.stake / validators.filter(v => v.isActive).reduce((sum, v) => sum + v.stake, 0)) * 100).toFixed(1) : '0'}%
                  </p>
                  
                  {/* {validator.isMalicious && (
                    <p className="text-sm text-red-600 dark:text-red-400 mb-2 font-medium">
                      Malicious Validator
                    </p>
                  )} */}
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleValidatorStatus(validator.name)}
                      className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                        validator.isActive 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : validator.stake < 32
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      title={validator.isActive ? 'Temporarily stop validating (can reactivate later)' : validator.stake < 32 ? 'Insufficient stake - need 32 ETH minimum' : 'Start validating and earning rewards'}
                    >
                      {validator.isActive ? 'Deactivate' : validator.stake < 32 ? 'Insufficient Stake' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        const updatedValidators = validators.map(v => 
                          v.name === validator.name
                            ? { ...v, isMalicious: !v.isMalicious }
                            : v
                        );
                        setValidators(updatedValidators);
                        
                        const newStatus = !validator.isMalicious;
                        setTimeout(() => {
                          if (newStatus) {
                            showError(
                              `${validator.name} is now marked as malicious!\n\nThis validator will participate in attacks when proposing or attesting blocks.`,
                              'Malicious Validator'
                            );
                          } else {
                            showInfo(
                              `${validator.name} is no longer malicious.\n\nThis validator will now behave honestly.`,
                              'Honest Validator'
                            );
                          }
                        }, 100);
                      }}
                      className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                        validator.isMalicious 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-gray-500 hover:bg-gray-600 text-white'
                      }`}
                      title={validator.isMalicious ? 'Stop malicious behavior' : 'Make this validator malicious (for 51% attack demo)'}
                    >
                      {validator.isMalicious ? 'Malicious' : 'Make Malicious'}
                    </button>
                    <button
                      onClick={() => handleWithdraw(validator.name, Math.min(32, validator.stake))}
                      disabled={validator.stake < 32}
                      className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm rounded transition-colors"
                      title="Withdraw 32 ETH (minimum stake amount)"
                    >
                      Withdraw 32 ETH
                    </button>
                    <button
                      onClick={() => handleWithdraw(validator.name, validator.stake)}
                      disabled={validator.stake === 0}
                      className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-sm rounded transition-colors"
                      title="Permanently leave the network and withdraw all ETH (cannot be undone)"
                    >
                      Exit & Withdraw All
                    </button>
                  </div>

                  {/* Voting Buttons - only show for active validators when there's a pending proposal */}
                  {pendingProposal && validator.isActive && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Attest to proposal:</p>
                      {!validatorVotes[validator.name] ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleMaliciousVote(validator.name, 'approve')}
                            className="py-2 px-3 text-xs font-medium rounded transition-colors bg-green-500 hover:bg-green-600 text-white"
                          >
                            YES ({validator.stake} ETH)
                          </button>
                          <button
                            onClick={() => handleMaliciousVote(validator.name, 'reject')}
                            className="py-2 px-3 text-xs font-medium rounded transition-colors bg-red-500 hover:bg-red-600 text-white"
                          >
                            NO ({validator.stake} ETH)
                          </button>
                        </div>
                      ) : (
                        <div className={`w-full py-2 px-3 text-xs font-medium rounded text-center ${
                          validatorVotes[validator.name].voteType === 'approve'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                          VOTED {validatorVotes[validator.name].voteType.toUpperCase()} ({validator.stake} ETH)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Become a Validator Section */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-white">Become a Validator</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create Additional Validator */}
              <div className="border-2 border-green-300 dark:border-green-600 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                <h4 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-300">Create Additional Validator</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Validator Name:
                    </label>
                    <input
                      type="text"
                      value={newValidatorName}
                      onChange={(e) => setNewValidatorName(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter validator name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Initial Stake (ETH):
                    </label>
                    <input
                      type="number"
                      min="32"
                      max="2048"
                      step="32"
                      value={newValidatorStake}
                      onChange={(e) => setNewValidatorStake(Math.max(32, Math.min(2048, parseInt(e.target.value) || 32)))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum: 32 ETH, Maximum: 2048 ETH</p>
                  </div>
                  <button
                    onClick={handleAddValidator}
                    disabled={!newValidatorName}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
                  >
                    Create Validator
                  </button>
                </div>
              </div>

              {/* Add Stake to Existing Validator */}
              <div className="border-2 border-blue-300 dark:border-blue-600 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">Add Stake to Existing Validator</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Validator:
                    </label>
                    <select
                      value={selectedValidator}
                      onChange={(e) => setSelectedValidator(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Choose a validator</option>
                      {validators.filter(v => v.stake < 2048).map((validator, index) => (
                        <option key={index} value={validator.name}>
                          {validator.name} - {validator.stake} ETH {!validator.isActive ? '(INACTIVE) ' : ''}(can add up to {2048 - validator.stake} ETH)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Stake (ETH):
                    </label>
                    <input
                      type="number"
                      min="32"
                      max={selectedValidator ? 2048 - (validators.find(v => v.name === selectedValidator)?.stake || 0) : 2048}
                      step="32"
                      value={additionalStake}
                      onChange={(e) => {
                        const maxAdd = selectedValidator ? 2048 - (validators.find(v => v.name === selectedValidator)?.stake || 0) : 2048;
                        setAdditionalStake(Math.max(32, Math.min(maxAdd, parseInt(e.target.value) || 32)));
                      }}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedValidator ? `Can add up to ${2048 - (validators.find(v => v.name === selectedValidator)?.stake || 0)} ETH more` : 'Select a validator first'}
                    </p>
                  </div>
                  <button
                    onClick={handleAddStakeToValidator}
                    disabled={!selectedValidator || additionalStake <= 0}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
                  >
                    Add Stake
                  </button>
                </div>
              </div>
            </div>

            {/* Information Box */}
            <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Staking Features:</h5>
                  <div className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                    <p>• <strong>Flexible Staking</strong>: Stake 32-2048 ETH per validator</p>
                    <p>• <strong>Proportional Power</strong>: Higher stake = more attestation power</p>
                    <p>• <strong>Economic Security</strong>: More skin in the game with higher personal slashing risk</p>
                    <p>• <strong>Malicious Testing</strong>: Toggle validators malicious to test attack scenarios</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Consensus Process:</h5>
                  <div className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
                    <p>• <strong>Block Proposal</strong>: One validator proposes a new block</p>
                    <p>• <strong>Stake-Weighted Voting</strong>: All validators attest YES/NO with staked ETH</p>
                    <p>• <strong>2/3 Threshold</strong>: Block needs 66.7% of total staked ETH to finalize</p>
                    <p>• <strong>Majority Attack</strong>: Attacker needs 2/3+ of all staked ETH to control consensus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DecentralizedTab;