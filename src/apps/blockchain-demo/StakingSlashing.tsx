import { useState } from 'react';
import { useToast } from './Toast.jsx';

const StakingSlashing = ({ currentTab, validators, setValidators }) => {
  // Get toast functions from context
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  // Staking state
  const [newValidatorName, setNewValidatorName] = useState('');
  // Removed unused staking state variables
  const [withdrawalQueue, setWithdrawalQueue] = useState([
    { validator: 'Charlie', amount: 64.0, position: 1, estimatedTime: '2 days' },
    { validator: 'Bob', amount: 32.0, position: 2, estimatedTime: '4 days' }
  ]);

  // Slashing state
  const [slashingEvents, setSlashingEvents] = useState([
    { 
      validator: 'Diana', 
      offense: 'Double Voting', 
      penalty: '2.1 ETH', 
      timestamp: '2024-01-15 14:30:22',
      status: 'Executed'
    },
    {
      validator: 'Frank',
      offense: 'Surround Voting',
      penalty: '1.5 ETH',
      timestamp: '2024-01-10 09:15:44',
      status: 'Under Review'
    }
  ]);
  const [selectedSlashingValidator, setSelectedSlashingValidator] = useState('');
  const [slashingReason, setSlashingReason] = useState('');

  // Staking functions
  const handleAddValidator = () => {
    if (newValidatorName) {
      const newValidator = {
        address: `0x${Math.random().toString(16).substring(2, 8)}...`,
        name: newValidatorName,
        stake: 32.0, // Always exactly 32 ETH
        isActive: true,
        isMalicious: false,
        slashingRisk: 0,
        rewards: 0,
        uptime: 100
      };
      
      const updatedValidators = [...validators, newValidator];
      setValidators(updatedValidators);
      
      setNewValidatorName('');
      // No need to reset stake since it's fixed
      
      setTimeout(() => {
        showSuccess(
          `Validator "${newValidator.name}" created successfully!\n\nStake: ${newValidator.stake} ETH\nStatus: Active\n\nYou can now see this validator in the Blockchain tab for block proposal.`,
          'Validator Created'
        );
      }, 100);
    } else {
      showError('Please enter a valid validator name.', 'Invalid Input');
    }
  };

  // Toggle malicious status
  const toggleMaliciousStatus = (validatorName) => {
    const updatedValidators = validators.map(validator => 
      validator.name === validatorName
        ? { ...validator, isMalicious: !validator.isMalicious }
        : validator
    );
    setValidators(updatedValidators);
    
    const validator = validators.find(v => v.name === validatorName);
    const newStatus = !validator.isMalicious;
    
    setTimeout(() => {
      if (newStatus) {
        showError(
          `${validatorName} is now marked as malicious!\n\nThis validator will participate in attacks when proposing or attesting blocks.`,
          'Malicious Validator'
        );
      } else {
        showInfo(
          `${validatorName} is no longer malicious.\n\nThis validator will now behave honestly.`,
          'Honest Validator'
        );
      }
    }, 100);
  };

  const handleWithdraw = (validatorName, amount) => {
    const newWithdrawal = {
      validator: validatorName,
      amount: amount,
      position: withdrawalQueue.length + 1,
      estimatedTime: `${(withdrawalQueue.length + 1) * 2} days`
    };
    setWithdrawalQueue([...withdrawalQueue, newWithdrawal]);

    const updatedValidators = validators.map(validator => 
      validator.name === validatorName
        ? { ...validator, stake: Math.max(0, validator.stake - amount), isActive: validator.stake - amount >= 32 }
        : validator
    );
    setValidators(updatedValidators);
    
    setTimeout(() => {
      showWarning(
        `Validator "${validatorName}" has been permanently removed and added to withdrawal queue.\n\nThey will no longer be available for block proposal.`,
        'Validator Exited'
      );
    }, 100);
  };

  // Slashing functions
  const handleSlashValidator = () => {
    if (selectedSlashingValidator && slashingReason) {
      const penalty = slashingReason === 'Double Voting' ? 2.0 : 
                     slashingReason === 'Surround Voting' ? 1.5 : 
                     slashingReason === 'Proposer Slashing' ? 3.0 : 1.0;

      const newSlashingEvent = {
        validator: selectedSlashingValidator,
        offense: slashingReason,
        penalty: `${penalty} ETH`,
        timestamp: new Date().toLocaleString(),
        status: 'Executed'
      };
      setSlashingEvents([newSlashingEvent, ...slashingEvents]);

      const updatedValidators = validators.map(validator => 
        validator.name === selectedSlashingValidator
          ? { 
              ...validator, 
              slashingRisk: validator.slashingRisk + penalty,
              stake: Math.max(0, validator.stake - penalty),
              isActive: false
            }
          : validator
      );
      setValidators(updatedValidators);

      setTimeout(() => {
        showError(
          `Validator "${selectedSlashingValidator}" has been slashed!\n\nOffense: ${slashingReason}\nPenalty: ${penalty} ETH\nStatus: Deactivated\n\nThey can no longer propose blocks until reactivated.`,
          'Validator Slashed'
        );
      }, 100);

      setSelectedSlashingValidator('');
      setSlashingReason('');
    }
  };

  // Toggle validator active status
  const toggleValidatorStatus = (validatorName) => {
    const updatedValidators = validators.map(validator => 
      validator.name === validatorName
        ? { ...validator, isActive: !validator.isActive }
        : validator
    );
    setValidators(updatedValidators);
    
    const validator = validators.find(v => v.name === validatorName);
    const newStatus = !validator.isActive;
    
    setTimeout(() => {
      showInfo(
        `Validator "${validatorName}" ${newStatus ? 'activated' : 'deactivated'}!\n\nThey are now ${newStatus ? 'available' : 'unavailable'} for block proposal.`,
        `Validator ${newStatus ? 'Activated' : 'Deactivated'}`
      );
    }, 100);
  };

  // Calculate staking metrics
  const totalStaked = validators.reduce((sum, v) => sum + v.stake, 0);
  const activeValidators = validators.filter(v => v.isActive).length;

  return (
    <>
      {/* Staking Tab */}
      {currentTab === 'staking' && (
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-center mb-6">Ethereum Staking</h2>
          
          {/* Staking Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Staked</h3>
              <p className="text-3xl font-bold text-blue-600">{totalStaked.toFixed(1)} ETH</p>
              <p className="text-sm text-gray-600">Across {validators.length} validators</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Validators</h3>
              <p className="text-3xl font-bold text-green-600">{activeValidators}</p>
              <p className="text-sm text-gray-600">Currently validating</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Validator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Become a Validator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validator Name:
                  </label>
                  <input
                    type="text"
                    value={newValidatorName}
                    onChange={(e) => setNewValidatorName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter validator name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stake Amount:
                  </label>
                  <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                    32.0 ETH (Fixed)
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Each Ethereum validator requires exactly 32 ETH</p>
                </div>
                <button
                  onClick={handleAddValidator}
                  disabled={!newValidatorName}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Create Validator
                </button>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Requirements:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Exactly 32 ETH required (no more, no less)</li>
                    <li>• Run validator software 24/7</li>
                    <li>• Maintain internet connection</li>
                    <li>• Risk of slashing for misconduct</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Create Additional Validator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Create Additional Validator</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Real Ethereum Staking:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Each validator requires exactly 32 ETH</li>
                    <li>• To stake more, you must create multiple validators</li>
                    <li>• 64 ETH = 2 validators, 96 ETH = 3 validators, etc.</li>
                    <li>• Each validator earns rewards independently</li>
                  </ul>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">Want to stake more than 32 ETH?</p>
                  <p className="text-sm text-gray-600 mb-4">Create another validator with exactly 32 ETH</p>
                  <button
                    onClick={() => {
                      setNewValidatorName('');
                      document.querySelector('input[placeholder="Enter validator name"]').focus();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Create New Validator
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Validators */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Your Validators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {validators.map((validator, index) => (
                <div key={index} className={`border-2 rounded-lg p-4 ${
                  validator.isMalicious 
                    ? 'border-red-300 bg-red-50' 
                    : validator.isActive 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{validator.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      validator.isActive 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {validator.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Stake: {validator.stake} ETH</p>
                  <p className="text-sm text-gray-600 mb-2">Address: {validator.address}</p>
                  {validator.isMalicious && (
                    <p className="text-sm text-red-600 mb-2 font-medium">
                      Malicious Validator
                    </p>
                  )}
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleValidatorStatus(validator.name)}
                      className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                        validator.isActive 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      title={validator.isActive ? 'Temporarily stop validating (can reactivate later)' : 'Start validating and earning rewards'}
                    >
                      {validator.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => toggleMaliciousStatus(validator.name)}
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
                      onClick={() => handleWithdraw(validator.name, validator.stake)}
                      disabled={validator.stake === 0}
                      className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-sm rounded transition-colors"
                      title="Permanently leave the network and withdraw all ETH (cannot be undone)"
                    >
                      Exit & Withdraw All
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawal Queue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold">Withdrawal Queue</h3>
              <div className="ml-4 bg-yellow-100 border border-yellow-300 rounded px-3 py-1">
                <span className="text-sm text-yellow-800">⏰ Withdrawals are processed gradually to maintain network stability</span>
              </div>
            </div>
            {withdrawalQueue.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Queue Position</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Validator</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estimated Wait Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {withdrawalQueue.map((withdrawal, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">#{withdrawal.position}</td>
                        <td className="px-4 py-2 text-sm font-medium">{withdrawal.validator}</td>
                        <td className="px-4 py-2 text-sm">{withdrawal.amount} ETH</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{withdrawal.estimatedTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No pending withdrawals</p>
            )}
          </div>
        </div>
      )}

      {/* Slashing Tab */}
      {currentTab === 'slashing' && (
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-center mb-6">Slashing Conditions</h2>

          {/* Slashing Explainer */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">What is Slashing?</h3>
            <p className="text-red-800 mb-4">
              Slashing is an automatic penalty system that punishes validators for breaking network rules. 
              It helps keep Ethereum secure by discouraging malicious behavior.
            </p>
            <div className="bg-white rounded p-3">
              <h4 className="font-medium text-red-700 mb-2">When you get slashed:</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• You lose some of your staked ETH as a penalty</li>
                <li>• Your validator is immediately ejected from the network</li>
                <li>• You cannot validate again until you set up a new validator</li>
                <li>• The penalty is permanent and cannot be reversed</li>
              </ul>
            </div>
          </div>

          {/* Slashing Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Slashed</h3>
              <p className="text-3xl font-bold text-red-600">
                {validators.reduce((sum, v) => sum + v.slashingRisk, 0).toFixed(1)} ETH
              </p>
              <p className="text-sm text-gray-600">From all validators</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Slashing Events</h3>
              <p className="text-3xl font-bold text-orange-600">{slashingEvents.length}</p>
              <p className="text-sm text-gray-600">Total incidents</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Risk Level</h3>
              <p className="text-3xl font-bold text-yellow-600">Low</p>
              <p className="text-sm text-gray-600">Network security status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Slashing Conditions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Types of Slashable Offenses</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                  <h4 className="font-medium text-red-700">Double Voting</h4>
                  <p className="text-sm text-gray-600 mb-1">Voting for two different blocks at the same height</p>
                  <p className="text-xs text-red-600 font-medium">Why it's bad: Creates confusion about which block is correct</p>
                  <p className="text-sm font-medium text-red-600 mt-1">Penalty: ~2.0 ETH</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded">
                  <h4 className="font-medium text-orange-700">Surround Voting</h4>
                  <p className="text-sm text-gray-600 mb-1">Creating contradictory votes that surround previous votes</p>
                  <p className="text-xs text-orange-600 font-medium">Why it's bad: Tries to rewrite blockchain history</p>
                  <p className="text-sm font-medium text-orange-600 mt-1">Penalty: ~1.5 ETH</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-3 rounded">
                  <h4 className="font-medium text-yellow-700">Proposer Slashing</h4>
                  <p className="text-sm text-gray-600 mb-1">Proposing two different blocks for the same slot</p>
                  <p className="text-xs text-yellow-600 font-medium">Why it's bad: Tries to create competing blockchain versions</p>
                  <p className="text-sm font-medium text-yellow-600 mt-1">Penalty: ~3.0 ETH</p>
                </div>
              </div>
            </div>

            {/* Simulate Slashing */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Simulate Slashing Event</h3>
              <p className="text-sm text-gray-600 mb-4">
                This simulation shows what happens when a validator breaks the rules. 
                In reality, slashing is detected automatically by the network.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Validator to Slash:
                  </label>
                  <select
                    value={selectedSlashingValidator}
                    onChange={(e) => setSelectedSlashingValidator(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Choose a validator</option>
                    {validators.filter(v => v.isActive).map((validator, index) => (
                      <option key={index} value={validator.name}>
                        {validator.name} - {validator.stake} ETH staked
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Offense:
                  </label>
                  <select
                    value={slashingReason}
                    onChange={(e) => setSlashingReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select offense type</option>
                    <option value="Double Voting">Double Voting (-2.0 ETH)</option>
                    <option value="Surround Voting">Surround Voting (-1.5 ETH)</option>
                    <option value="Proposer Slashing">Proposer Slashing (-3.0 ETH)</option>
                  </select>
                </div>
                <button
                  onClick={handleSlashValidator}
                  disabled={!selectedSlashingValidator || !slashingReason}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Execute Slashing
                </button>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    Warning: Slashing is irreversible and will result in immediate penalty and validator ejection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slashing History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Slashing History</h3>
            {slashingEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Validator</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Offense</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Penalty</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">When</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {slashingEvents.map((event, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-medium">{event.validator}</td>
                        <td className="px-4 py-2 text-sm">{event.offense}</td>
                        <td className="px-4 py-2 text-sm font-medium text-red-600">{event.penalty}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{event.timestamp}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            event.status === 'Executed' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No slashing events recorded</p>
            )}
          </div>
          {/* Key Concepts Explainer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Understanding Validator Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded p-3 border-l-4 border-green-500">
                <h4 className="font-medium text-green-700 mb-1">Activate</h4>
                <p className="text-gray-700">Start validating and earning rewards. Your validator can propose blocks and vote on transactions.</p>
              </div>
              <div className="bg-white rounded p-3 border-l-4 border-yellow-500">
                <h4 className="font-medium text-yellow-700 mb-1">Deactivate</h4>
                <p className="text-gray-700">Temporarily stop validating. No rewards, but no slashing risk. Can reactivate anytime.</p>
              </div>
              <div className="bg-white rounded p-3 border-l-4 border-red-500">
                <h4 className="font-medium text-red-700 mb-1">Exit</h4>
                <p className="text-gray-700">Permanently leave the network and withdraw all your staked ETH. Cannot be undone.</p>
              </div>
              <div className="bg-white rounded p-3 border-l-4 border-purple-500">
                <h4 className="font-medium text-purple-700 mb-1">Slashing</h4>
                <p className="text-gray-700">Penalty for breaking rules. Lose ETH and get ejected from the network automatically.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StakingSlashing;