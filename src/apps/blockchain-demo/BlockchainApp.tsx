import { useState, useEffect } from 'react';
import { keccak256, toUtf8Bytes } from 'ethers';
import Hash from './Hash';
import BlockHashingTab from './BlockHashingTab';
import BlockchainTab from './BlockchainTab';
import DecentralizedTab from './DecentralizedTab';
import BlockSigningTab from './BlockSigningTab';
import { ToastProvider, useToast } from './Toast';

// Type definitions
interface Transaction {
  id: number;
  from: string;
  to: string;
  amount: string;
  fee: string;
}

export interface Validator {
  id: string;
  address: string;
  name: string;
  stake: number;
  isActive: boolean;
  isMalicious: boolean;
  slashingRisk: number;
  rewards: number;
  uptime: number;
}

interface Block {
  block: number;
  data: string;
  prevHash: string;
  hash: string;
  signedHash: string;
  validator: string;
  attestations: number;
  finalized: boolean;
  isValid: boolean | 'unsigned';
  attested?: boolean;
  isMalicious?: boolean;
  transactions?: Transaction[];
  consensusPercentage?: number;
}

interface Proposal {
  blockNumber: number;
  proposer: string;
  transactions: Transaction[];
  data: string;
  prevHash: string;
  hash: string;
  attestations: Vote[];
  timestamp: number;
  block?: number;
  validator?: string;
  votes?: Record<string, 'approve' | 'reject' | null>;
  status?: 'pending' | 'approved' | 'rejected';
}

interface Vote {
  validatorName: string;
  stake: number;
  isMalicious: boolean;
  voteType: 'approve' | 'reject';
}

interface DecentralizedBlockchain {
  [key: string]: Block[];
}

const EthereumPoSDemo = () => {
  const [currentTab, setCurrentTab] = useState<string>('hash');
  
  // Get toast functions from context
  const { showSuccess, showError, showWarning } = useToast();
  
  // Hash Tab State
  const [hashData, setHashData] = useState<string>('');
  const [computedHash, setComputedHash] = useState<string>('');
  
  // Block Tab State - removed blockNumber and prevHash states
  // const [blockData, setBlockData] = useState<string>(''); // Unused
  
  // Transaction selection state
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  
  // Pending transactions data
  const pendingTransactions: Transaction[] = [
    { id: 1, from: '0xalice...', to: '0xbob...', amount: '2.5 ETH', fee: '0.001 ETH' },
    { id: 2, from: '0xcharlie...', to: '0xdiana...', amount: '100 USDC', fee: '0.002 ETH' },
    { id: 3, from: '0xeve...', to: '0xfrank...', amount: '0.8 ETH', fee: '0.0015 ETH' },
    { id: 4, from: '0xgrace...', to: '0xhenry...', amount: '50 DAI', fee: '0.0012 ETH' },
    { id: 5, from: '0xivan...', to: '0xjulia...', amount: '1.2 ETH', fee: '0.0008 ETH' },
    { id: 6, from: '0xkate...', to: '0xliam...', amount: '200 USDT', fee: '0.0018 ETH' },
  ];
  
  // Validators State
  const [validators, setValidators] = useState<Validator[]>([
    { id: 'alice', address: '0x1a2b3c...', name: 'Alice', stake: 32.0, isActive: true, isMalicious: false, slashingRisk: 0, rewards: 0, uptime: 100 },
    { id: 'bob', address: '0x4d5e6f...', name: 'Bob', stake: 32.0, isActive: true, isMalicious: false, slashingRisk: 0, rewards: 0, uptime: 100 },
    { id: 'charlie', address: '0x7g8h9i...', name: 'Charlie', stake: 32.0, isActive: true, isMalicious: false, slashingRisk: 0, rewards: 0, uptime: 100 },
  ]);

  // Initialize blockchain state with properly calculated hashes
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  
  // Decentralized consensus state
  const [decentralizedBlockchains, setDecentralizedBlockchains] = useState<DecentralizedBlockchain>({});
  const [pendingProposal, setPendingProposal] = useState<Proposal | null>(null);
  const [selectedProposer, setSelectedProposer] = useState<string>('');
  const [validatorVotes, setValidatorVotes] = useState<Record<string, Vote | null>>({});
  const [autoSelectedValidator, setAutoSelectedValidator] = useState<string>('');
  
  // Initialize blockchain with correct hashes on component mount
  useEffect(() => {
    const initializeBlockchain = async () => {
      const genesisHash = '0x' + '0'.repeat(64);
      
      const block1Data = '0xalice... → 0xbob...: 1.5 ETH\n0xcharlie... → 0xdiana...: 50 USDC';
      const block1Hash = await calculateBlockHash(1, block1Data, genesisHash, 'Alice (0x1a2b3c...)');
      
      const block2Data = '0xeve... → 0xfrank...: 0.8 ETH\n0xgrace... → 0xhenry...: 200 DAI';
      const block2Hash = await calculateBlockHash(2, block2Data, block1Hash, 'Bob (0x4d5e6f...)');
      
      const block3Data = '0xivan... → 0xjulia...: 1.2 ETH\n0xkate... → 0xliam...: 100 USDT';
      const block3Hash = await calculateBlockHash(3, block3Data, block2Hash, 'Charlie (0x7g8h9i...)');
      
      const block4Data = '0xmike... → 0xnina...: 2.0 ETH';
      const block4Hash = await calculateBlockHash(4, block4Data, block3Hash, 'Alice (0x1a2b3c...)');
      
      const initialBlockchain = [
        {
          block: 1,
          data: block1Data,
          prevHash: genesisHash,
          hash: block1Hash,
          signedHash: block1Hash, // Initially signed
          validator: 'Alice (0x1a2b3c...)',
          attestations: 89,
          finalized: true,
          isValid: true
        },
        {
          block: 2,
          data: block2Data,
          prevHash: block1Hash,
          hash: block2Hash,
          signedHash: block2Hash, // Initially signed
          validator: 'Bob (0x4d5e6f...)',
          attestations: 92,
          finalized: true,
          isValid: true
        },
        {
          block: 3,
          data: block3Data,
          prevHash: block2Hash,
          hash: block3Hash,
          signedHash: block3Hash, // Initially signed
          validator: 'Charlie (0x7g8h9i...)',
          attestations: 95,
          finalized: true,
          isValid: true
        },
        {
          block: 4,
          data: block4Data,
          prevHash: block3Hash,
          hash: block4Hash,
          signedHash: block4Hash, // Initially signed
          validator: 'Alice (0x1a2b3c...)',
          attestations: 87,
          finalized: true,
          isValid: true
        }
      ];
      
      setBlockchain(initialBlockchain);
      
      // Initialize empty blockchains for each validator
      const initialDecentralizedBlockchains: DecentralizedBlockchain = {};
      validators.filter(v => v.isActive).forEach(validator => {
        initialDecentralizedBlockchains[validator.name] = [];
      });
      setDecentralizedBlockchains(initialDecentralizedBlockchains);
      
      // Set initial auto-selected validator
      setAutoSelectedValidator(selectValidatorForSlot(Math.floor(Math.random() * 1000)));
    };
    
    initializeBlockchain();
  }, []);
  
  
  // Transaction selection handler
  const handleTxSelection = (txId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTransactions(prev => [...prev, txId]);
    } else {
      setSelectedTransactions(prev => prev.filter(id => id !== txId));
    }
  };
  
  // Utility function to calculate Keccak-256 hash (Ethereum standard)
  const calculateHash = async (input: string) => {
    // Use ethers.js keccak256 - the proper Ethereum implementation
    return keccak256(toUtf8Bytes(input));
  };
  
  // Utility function to calculate block hash (PoS style)
  const calculateBlockHash = async (block: number, data: string, prevHash: string, validator: string) => {
    const input = `${block}${data}${prevHash}${validator}`;
    return await calculateHash(input);
  };
  
  // Select validator based on stake (simplified algorithm)
  const selectValidatorForSlot = (slotNumber: number) => {
    const activeValidators = validators.filter(v => v.isActive);
    const totalStake = activeValidators.reduce((sum, v) => sum + v.stake, 0);
    
    // Pseudo-random selection weighted by stake
    const seed = slotNumber * 1337; // Simple seed
    const random = (seed % 1000) / 1000;
    let cumulativeStake = 0;
    
    for (const validator of activeValidators) {
      cumulativeStake += validator.stake / totalStake;
      if (random < cumulativeStake) {
        return `${validator.name} (${validator.address})`;
      }
    }
    
    return activeValidators[0] ? `${activeValidators[0].name} (${activeValidators[0].address})` : 'No Active Validator';
  };
  
  
  // Update hash when data changes
  useEffect(() => {
    const updateHash = async () => {
      if (currentTab === 'hash') {
        if (hashData.trim() === '') {
          setComputedHash('');
          return;
        }
        const hash = await calculateHash(hashData);
        setComputedHash(hash);
      }
    };
    updateHash();
  }, [hashData, currentTab]);
  
  
  const handleBlockchainDataChange = async (index: number, newData: string) => {
    const updatedBlockchain = [...blockchain];
    
    // Update the data in the changed block
    updatedBlockchain[index] = {
      ...updatedBlockchain[index],
      data: newData
    };
    
    // Recalculate hash for the changed block and propagate changes
    for (let i = index; i < updatedBlockchain.length; i++) {
      const block = updatedBlockchain[i];
      
      // For the first changed block, recalculate its hash with new data
      if (i === index) {
        const newHash = await calculateBlockHash(
          block.block,
          newData,
          block.prevHash,
          block.validator
        );
        updatedBlockchain[i].hash = newHash;
        // Don't update signedHash - this makes it "unsigned"
      } else {
        // For subsequent blocks, update their prevHash and recalculate their hash
        const newPrevHash = updatedBlockchain[i - 1].hash;
        updatedBlockchain[i].prevHash = newPrevHash;
        
        const newHash = await calculateBlockHash(
          block.block,
          block.data,
          newPrevHash,
          block.validator
        );
        updatedBlockchain[i].hash = newHash;
        // Don't update signedHash - this makes them all "unsigned"
      }
      
    }
    
    // Revalidate all blocks individually based on their own signing status
    for (let i = 0; i < updatedBlockchain.length; i++) {
      const block = updatedBlockchain[i];
      if (!block.signedHash) {
        block.isValid = 'unsigned'; // Yellow - no signature
      } else if (block.signedHash === block.hash) {
        block.isValid = true; // Green - valid signature
      } else {
        block.isValid = false; // Red - invalid signature
      }
    }
    
    setBlockchain(updatedBlockchain);
  };

  // Handle block signing - only sign the specific block clicked
  const handleValidateBlock = async (index: number) => {
    const updatedBlockchain = [...blockchain];
    const blockToSign = updatedBlockchain[index];
    
    // Recalculate the block's hash with current data
    const correctHash = await calculateBlockHash(
      blockToSign.block,
      blockToSign.data,
      blockToSign.prevHash,
      blockToSign.validator
    );
    
    // Update ONLY this block's hash and sign it
    updatedBlockchain[index] = {
      ...blockToSign,
      hash: correctHash,
      signedHash: correctHash, // This represents "signing" ONLY this block
      isValid: true
    };
    
    // Update subsequent blocks' hashes but DON'T sign them
    for (let i = index + 1; i < updatedBlockchain.length; i++) {
      const currentBlock = updatedBlockchain[i];
      const expectedPrevHash = updatedBlockchain[i - 1].hash;
      
      // Update this block's prevHash to match the correct chain
      updatedBlockchain[i] = {
        ...currentBlock,
        prevHash: expectedPrevHash
      };
      
      // Recalculate this block's hash with the corrected prevHash
      const newHash = await calculateBlockHash(
        currentBlock.block,
        currentBlock.data,
        expectedPrevHash,
        currentBlock.validator
      );
      
      updatedBlockchain[i].hash = newHash;
      // DON'T update signedHash - this makes them "unsigned/invalid"
    }
    
    // Revalidate all blocks individually based on their own signing status
    for (let i = 0; i < updatedBlockchain.length; i++) {
      const block = updatedBlockchain[i];
      if (!block.signedHash) {
        block.isValid = 'unsigned'; // Yellow - no signature
      } else if (block.signedHash === block.hash) {
        block.isValid = true; // Green - valid signature
      } else {
        block.isValid = false; // Red - invalid signature
      }
    }
    
    setBlockchain(updatedBlockchain);
  };


  // Decentralized consensus functions
  const handleProposeBlockDecentralized = async () => {
    if (selectedTransactions.length === 0) {
      showError('Please select some transactions to include in the block', 'No Transactions Selected');
      return;
    }

    if (pendingProposal) {
      showError('There is already a pending proposal. Wait for it to be finalized.', 'Proposal Pending');
      return;
    }

    // Create block data from selected transactions
    const selectedTxs = pendingTransactions.filter(tx => selectedTransactions.includes(tx.id));
    const blockContent = selectedTxs.map(tx => `${tx.from} → ${tx.to}: ${tx.amount}`).join('\n');
    
    const validator = selectedProposer || autoSelectedValidator;
    const currentBlockNumber = blockchain.length + 1;
    const prevHash = blockchain.length === 0 ? '0x' + '0'.repeat(64) : 
      blockchain[blockchain.length - 1]?.hash || '0x' + '0'.repeat(64);
    
    const hash = await calculateBlockHash(currentBlockNumber, blockContent, prevHash, validator);
    
    const proposal = {
      blockNumber: currentBlockNumber,
      proposer: validator,
      transactions: selectedTxs,
      data: blockContent,
      prevHash: prevHash,
      hash: hash,
      attestations: [],
      timestamp: Date.now()
    };

    setPendingProposal(proposal);
    setSelectedTransactions([]);
    setSelectedProposer('');
    // Generate new auto-selected validator for next time
    setAutoSelectedValidator(selectValidatorForSlot(Math.floor(Math.random() * 1000)));
    
    showSuccess(
      `Block ${currentBlockNumber} proposed by ${validator.split('(')[0]}!\n\nTransactions: ${selectedTxs.length}\nValidator: ${validator.split('(')[0]}\nHash: ${hash.substring(0, 16)}...\n\nWaiting for attestations from other validators...`,
      'Block Proposed'
    );
  };

  const handleVoteBlock = (validatorName: string, voteType: 'approve' | 'reject') => {
    if (!pendingProposal) return;
    
    if (validatorVotes[validatorName]) {
      showWarning('This validator has already voted on this block', 'Already Voted');
      return;
    }

    // Find the validator and their stake
    const validator = validators.find(v => v.name === validatorName);
    if (!validator) return;

    const vote = {
      validatorName: validatorName,
      stake: validator.stake,
      isMalicious: validator.isMalicious,
      voteType: voteType // 'yes' or 'no'
    };

    // Update validator votes
    const updatedVotes = { ...validatorVotes, [validatorName]: vote };
    setValidatorVotes(updatedVotes);

    // Calculate vote results
    const activeValidators = validators.filter(v => v.isActive);
    const totalStake = activeValidators.reduce((sum, v) => sum + v.stake, 0);
    const allVotes = Object.values(updatedVotes).filter((v): v is Vote => v !== null);
    const yesVotes = allVotes.filter(v => v.voteType === 'approve');
    const noVotes = allVotes.filter(v => v.voteType === 'reject');
    const yesStake = yesVotes.reduce((sum, v) => sum + v.stake, 0);
    const noStake = noVotes.reduce((sum, v) => sum + v.stake, 0);
    // const votedStake = yesStake + noStake;

    // Check if majority of YES votes are malicious
    const maliciousYesStake = yesVotes
      .filter(v => v.isMalicious)
      .reduce((sum, v) => sum + v.stake, 0);
    // const maliciousNoStake = noVotes
    //   .filter(v => v.isMalicious)
    //   .reduce((sum, v) => sum + v.stake, 0);
    const proposerValidator = validators.find(v => `${v.name} (${v.address})` === pendingProposal.proposer);
    const proposerMalicious = proposerValidator?.isMalicious || false;
    
    // If proposer is malicious and we have yes votes, count their stake too
    const totalMaliciousYesStake = maliciousYesStake + (proposerMalicious && yesStake > 0 ? (proposerValidator?.stake || 0) : 0);
    const isMajorityMalicious = totalMaliciousYesStake > (yesStake + (proposerMalicious && yesStake > 0 ? (proposerValidator?.stake || 0) : 0)) / 2;

    const yesPercentage = ((yesStake / totalStake) * 100).toFixed(1);
    const noPercentage = ((noStake / totalStake) * 100).toFixed(1);
    
    // Only show attack detection when majority is malicious - not individual votes
    
    // Don't show individual vote toasts - only show result toasts

    // Check if everyone has voted
    if (allVotes.length === activeValidators.length) {
      const requiredStake = (totalStake * 2) / 3; // 2/3 of total stake
      if (yesStake >= requiredStake) {
        // Attack detection will be shown in finalizeBlock instead
        setTimeout(() => finalizeBlock(pendingProposal, isMajorityMalicious), 1000);
      } else {
        setTimeout(() => {
          // Check if malicious validators are blocking the block
          const maliciousNoStake = noVotes
            .filter(v => v.isMalicious)
            .reduce((sum, v) => sum + v.stake, 0);
          const totalHonestStake = totalStake - validators.filter(v => v.isMalicious && v.isActive).reduce((sum, v) => sum + v.stake, 0);
          const isMaliciousBlocking = maliciousNoStake > (noStake / 2) && noStake > (totalHonestStake / 2);
          
          if (isMaliciousBlocking) {
            showError(
              `MALICIOUS BLOCK REJECTION!\n\nMalicious validators blocked this block with NO votes!\n\nMalicious NO Stake: ${maliciousNoStake} ETH\nTotal NO Stake: ${noStake} ETH (${noPercentage}%)\n\nThis is an attack on consensus!`,
              'Malicious Block Rejection'
            );
          } else {
            showError(
              `Block rejected!\n\nYES votes: ${yesStake} ETH (${yesPercentage}%)\nNO votes: ${noStake} ETH (${noPercentage}%)\n\nRequired: ${requiredStake.toFixed(1)} ETH (66.7%) to pass`,
              'Block Rejected'
            );
          }
          setPendingProposal(null);
          setValidatorVotes({});
        }, 1000);
      }
    }
  };

  const finalizeBlock = async (proposal: Proposal, isMalicious: boolean = false) => {
    // Calculate consensus percentage based on YES votes
    const activeValidators = validators.filter(v => v.isActive);
    const totalStake = activeValidators.reduce((sum, v) => sum + v.stake, 0);
    const yesVotes = Object.values(validatorVotes).filter((v): v is Vote => v !== null && v.voteType === 'approve');
    const yesStake = yesVotes.reduce((sum, v) => sum + v.stake, 0);
    const consensusPercentage = Math.round((yesStake / totalStake) * 100);

    // Add the finalized block to all validator blockchains
    const newBlock = {
      block: proposal.blockNumber,
      data: proposal.data,
      prevHash: proposal.prevHash,
      hash: proposal.hash,
      signedHash: proposal.hash,
      validator: proposal.proposer,
      attestations: yesVotes.length,
      finalized: true,
      attested: true,
      isValid: true,
      isMalicious: isMalicious,
      transactions: proposal.transactions,
      consensusPercentage: consensusPercentage
    };

    // Update decentralized blockchains
    const updatedBlockchains = { ...decentralizedBlockchains };
    Object.keys(updatedBlockchains).forEach(validatorName => {
      updatedBlockchains[validatorName] = [...updatedBlockchains[validatorName], newBlock];
    });
    setDecentralizedBlockchains(updatedBlockchains);

    // Also add to main blockchain state (for Blockchain tab)
    const mainBlockchainBlock = {
      block: proposal.blockNumber,
      data: proposal.data,
      prevHash: proposal.prevHash,
      hash: proposal.hash,
      signedHash: proposal.hash,
      validator: proposal.proposer,
      attestations: consensusPercentage, // Now this is the actual consensus percentage
      finalized: true,
      isValid: true,
      isMalicious: isMalicious
    };
    
    setBlockchain(prev => [...prev, mainBlockchainBlock]);
    setPendingProposal(null);
    setValidatorVotes({});
    
    if (isMalicious) {
      showError(
        'Malicious Block Finalized!\n\nThis block was approved by malicious validators and represents a successful 51% attack.\n\nIn a real network, this could allow double-spending or censorship.',
        'Attack Successful'
      );
    } else {
      showSuccess(
        'Block Finalized'
      );
    }
  };

  const tabs = [
    { id: 'hash', label: 'Hash' },
    { id: 'block-hashing', label: 'Block Hashing' },
    { id: 'block-signing', label: 'Block Signing' },
    { id: 'blockchain', label: 'PoS Blockchain' },
    { id: 'validators', label: 'Validators' }
  ];
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Ethereum Proof of Stake Demo
        </h1>
        <p className="text-center text-gray-600 dark:text-slate-300 mb-8">
          Interactive demonstration of Ethereum's PoS consensus mechanism
        </p>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <nav className="flex flex-wrap justify-center space-x-1 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-3 rounded-md font-medium transition-all text-sm ${
                  currentTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Hash Tab */}
        <Hash 
          currentTab={currentTab} 
          hashData={hashData} 
          computedHash={computedHash} 
          setHashData={setHashData} 
        />

        {/* Block Hashing Tab */}
        <BlockHashingTab
          currentTab={currentTab}
          calculateHash={calculateHash}
        />

        {/* Block Signing Tab */}
        <BlockSigningTab
          currentTab={currentTab}
          calculateHash={calculateHash}
        />

        {/* Blockchain Visualization Tab */}
        <BlockchainTab
          validators={validators}
          currentTab={currentTab}
          blockchain={blockchain}
          handleBlockchainDataChange={handleBlockchainDataChange}
          handleValidateBlock={handleValidateBlock}
        />

        {/* Validators Tab */}
        <DecentralizedTab
          currentTab={currentTab}
          validators={validators}
          setValidators={setValidators}
          pendingProposal={pendingProposal}
          handleProposeBlockDecentralized={handleProposeBlockDecentralized}
          handleVoteBlock={handleVoteBlock}
          validatorVotes={validatorVotes}
          selectedProposer={selectedProposer}
          setSelectedProposer={setSelectedProposer}
          autoSelectedValidator={autoSelectedValidator}
          pendingTransactions={pendingTransactions}
          selectedTransactions={selectedTransactions}
          handleTxSelection={handleTxSelection}
          blockchain={blockchain}
          calculateHash={calculateHash}
          handleDataChange={handleBlockchainDataChange}
          handleValidateBlock={handleValidateBlock}
        />
      </div>
    </div>
  );
};

// Wrapper component to provide toast context
const App = () => {
  return (
    <ToastProvider>
      <EthereumPoSDemo />
    </ToastProvider>
  );
};

export default App;