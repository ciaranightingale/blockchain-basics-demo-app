interface DecentralizedTabProps {
  currentTab: string;
  validators: any[];
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
}

function DecentralizedTab({ 
  currentTab, 
  validators, 
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
  blockchain
}: DecentralizedTabProps) {

  return (
    <>
      {currentTab === 'decentralized' && (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Decentralized Consensus</h2>
            <p className="text-gray-600">Multiple validators each maintain their blockchain view. Blocks need attestations to finalize.</p>
          </div>

          {/* Block Proposal Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-500 mb-8">
            <h3 className="text-xl font-bold mb-4 text-center text-green-700">Propose New Block</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Validator Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validator:
                </label>
                <select
                  value={selectedProposer}
                  onChange={(e) => setSelectedProposer(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="">Auto-select</option>
                  {validators.filter(v => v.isActive).map((validator, index) => (
                    <option key={index} value={`${validator.name} (${validator.address})`}>
                      {validator.name} - {validator.stake} ETH
                    </option>
                  ))}
                </select>
                <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <strong>Selected:</strong> {selectedProposer ? selectedProposer.split('(')[0] : autoSelectedValidator.split('(')[0]}
                </div>
              </div>

              {/* Block Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Block Info:
                </label>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 border rounded text-sm">
                    <strong>Block #:</strong> {blockchain.length + 1}
                  </div>
                </div>
              </div>

              {/* Transaction Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transactions ({selectedTransactions.length} selected):
                </label>
                <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto bg-gray-50">
                  {pendingTransactions.map(tx => (
                    <label key={tx.id} className="flex items-center space-x-2 p-1 hover:bg-white rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedTransactions.includes(tx.id)}
                        onChange={(e) => handleTxSelection(tx.id, e.target.checked)}
                        className="h-3 w-3 text-green-600"
                      />
                      <div className="flex-1 text-xs">
                        <div className="font-semibold">{tx.amount}</div>
                        <div className="font-mono text-gray-600 text-xs">{tx.from.substring(0, 8)}→{tx.to.substring(0, 8)}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Propose Button */}
              <div className="flex flex-col justify-center">
                <button
                  onClick={handleProposeBlockDecentralized}
                  disabled={pendingProposal || selectedTransactions.length === 0}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-4 px-4 rounded-lg transition-colors"
                >
                  {pendingProposal ? (
                    <span className="flex items-center justify-center">
                      Proposing...
                    </span>
                  ) : (
                    <span className="flex flex-col items-center">
                      <span>Propose Block</span>
                    </span>
                  )}
                </button>
                {selectedTransactions.length === 0 && (
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Select transactions first
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pending Proposal Section */}
          {pendingProposal && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-amber-900 mb-4">Pending Block Proposal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-amber-800">
                    <strong>Proposer:</strong> {pendingProposal.proposer.split('(')[0]}
                  </p>
                  <p className="text-sm text-amber-800">
                    <strong>Block:</strong> #{pendingProposal.blockNumber}
                  </p>
                  <p className="text-sm text-amber-800">
                    <strong>Transactions:</strong> {pendingProposal.transactions.length}
                  </p>
                  <p className="text-sm text-amber-800">
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
                        <p className="text-sm text-amber-800">
                          <strong>Votes:</strong> {votedCount}/{totalValidators} validators
                        </p>
                        <p className="text-sm text-amber-800">
                          <strong>YES:</strong> {yesStake.toFixed(1)} ETH ({yesPercentage}%)
                        </p>
                        <p className="text-sm text-amber-800">
                          <strong>NO:</strong> {noStake.toFixed(1)} ETH ({noPercentage}%)
                        </p>
                        <p className="text-sm text-amber-800">
                          <strong>Required:</strong> {requiredStake.toFixed(1)} ETH (66.7%)
                        </p>
                        <p className="text-sm text-amber-800">
                          <strong>Status:</strong> {votedCount === totalValidators ? (yesStake >= requiredStake ? 'Ready to Finalize' : 'Will be Rejected') : 'Awaiting Votes'}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Validators Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {validators.filter(v => v.isActive).map((validator, validatorIndex) => (
              <div key={validatorIndex} className={`bg-white rounded-lg shadow-md border-2 p-4 ${
                validator.isMalicious ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-gray-800">{validator.name}</h3>
                    {validator.isMalicious && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold">
                        MALICIOUS
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {validator.stake} ETH
                    </div>
                    <div className="text-xs text-gray-600">
                      {((validator.stake / validators.filter(v => v.isActive).reduce((sum, v) => sum + v.stake, 0)) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>

                {/* Validator's blockchain view */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Blockchain View:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {blockchain.length > 0 ? blockchain.map((block, blockIndex) => (
                      <div 
                        key={blockIndex} 
                        className={`p-2 rounded text-xs border ${
                          block.isMalicious
                            ? 'bg-red-100 border-red-400'
                            : block.finalized 
                            ? 'bg-green-50 border-green-200' 
                            : block.isValid === true
                            ? 'bg-blue-50 border-blue-200'
                            : block.isValid === false
                            ? 'bg-red-50 border-red-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Block #{block.block}</span>
                            {block.isMalicious && (
                              <span className="text-xs bg-red-600 text-white px-1 py-0.5 rounded font-bold">
                                MALICIOUS
                              </span>
                            )}
                          </div>
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            block.isMalicious
                              ? 'bg-red-200 text-red-800'
                              : block.finalized 
                              ? 'bg-green-200 text-green-800' 
                              : block.isValid === true
                              ? 'bg-blue-200 text-blue-800'
                              : block.isValid === false
                              ? 'bg-red-200 text-red-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            {block.isMalicious ? 'Malicious' : block.finalized ? 'Finalized' : block.isValid === true ? 'Signed' : block.isValid === false ? 'Invalid' : 'Unsigned'}
                          </span>
                        </div>
                        <div className="text-gray-600 mt-1 font-mono text-xs break-all">
                          {block.hash}
                        </div>
                      </div>
                    )) : <div className="text-gray-500 text-xs">No blocks yet</div>}
                  </div>
                </div>

                {/* Voting Buttons */}
                {pendingProposal && (
                  <div className="mt-4">
                    {!validatorVotes[validator.name] ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleVoteBlock(validator.name, 'approve')}
                          className="py-2 px-3 text-xs font-medium rounded transition-colors bg-green-500 hover:bg-green-600 text-white"
                        >
                          YES ({validator.stake} ETH)
                        </button>
                        <button
                          onClick={() => handleVoteBlock(validator.name, 'reject')}
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

          {/* Educational Note */}
          <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 mb-2">How Stake-Weighted Consensus Works:</h4>
            <div className="text-sm text-purple-800 space-y-1">
              <p>• <strong>Block Proposal</strong>: One validator proposes a new block to the network</p>
              <p>• <strong>Stake-Weighted Voting</strong>: All validators vote YES or NO with their staked ETH as voting power</p>
              <p>• <strong>2/3 Threshold</strong>: Block needs 66.7% of total staked ETH to vote YES to finalize</p>
              <p>• <strong>All Must Vote</strong>: Every active validator must cast a vote before the block can be finalized</p>
              <p>• <strong>Security Model</strong>: Larger stakes have more influence but also more to lose if slashed</p>
              <p>• <strong>Majority Attack</strong>: An attacker would need 2/3+ of all staked ETH to control consensus</p>
              <p>• <strong>Economic Security</strong>: Makes attacks extremely expensive and self-defeating</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DecentralizedTab;