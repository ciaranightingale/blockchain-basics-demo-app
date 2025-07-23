import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Lock, X, CheckCircle, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Challenge {
  id: number;
  title: string;
  description: string;
  scenario: string;
  recipient: {
    name: string;
    location: string;
    type: 'person' | 'charity' | 'business';
  };
  amount: string;
  failureReason: string;
  failureMessage: string;
  completed: boolean;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Send Money to a Friend Abroad",
    description: "Your friend Maria urgently needs $50 for medical expenses.",
    scenario: "Maria has no fixed address, so she can't open a bank account. Try to send her money quickly.",
    recipient: {
      name: "Maria",
      location: "No Fixed Address",
      type: "person"
    },
    amount: "$50",
    failureReason: "No Bank Account Available",
    failureMessage: "Transaction blocked: Recipient has no bank account on file. Banks require permanent address and identification documents for account opening. Alternative money transfer services also require recipient to have government ID and proof of address.",
    completed: false
  },
  {
    id: 2,
    title: "Donate to Global Charity",
    description: "Support clean water projects in Sub-Saharan Africa through a local charity.",
    scenario: "You want to donate $25 to help build wells in remote villages.",
    recipient: {
      name: "Water for Life Initiative",
      location: "Chad, Central Africa",
      type: "charity"
    },
    amount: "$25",
    failureReason: "Service Denied",
    failureMessage: "Transaction blocked: This organization appears on our internal risk list due to operating in a sanctioned region. Your account has been flagged for suspicious activity. Banking services may be suspended pending review. No reason or appeal process provided.",
    completed: false
  },
  {
    id: 3,
    title: "Buy Oranges During Hyperinflation",
    description: "Purchase oranges from a local market, but prices are changing rapidly due to hyperinflation.",
    scenario: "You want to buy oranges that cost Z$10 when you looked at the prices that morning, you take your Z$100 cash to the market after your day of work. Try to buy some oranges",
    recipient: {
      name: "Fresh Fruit Market",
      location: "Harare, Zimbabwe",
      type: "business"
    },
    amount: "Z$100",
    failureReason: "Hyperinflation",
    failureMessage: "Payment rejected: Price has increased to Z$200 while you were at work. Currency instability makes real-time pricing impossible. Your savings have lost 50% of their value in the past day. This actually happened in the real-world: learn more about Zimbabwe's hyperinflation: https://en.wikipedia.org/wiki/Hyperinflation_in_Zimbabwe",
    completed: false
  },
  {
    id: 4,
    title: "Pay Freelancer Instantly",
    description: "Your developer in Ukraine completed urgent work and needs immediate payment.",
    scenario: "It's Friday evening and your freelancer needs payment to cover weekend expenses, but banks are closed.",
    recipient: {
      name: "Bob",
      location: "Kyiv, Ukraine",
      type: "person"
    },
    amount: "$200",
    failureReason: "Banking Hours",
    failureMessage: "Transaction failed: International transfers are not processed outside business hours. Your payment will be processed on the next business day (Monday).",
    completed: false
  },
  {
    id: 5,
    title: "Trustless Escrow Agreement",
    description: "Buy a rare collectible from a stranger online without using a middleman service.",
    scenario: "You found a vintage guitar worth $2,000 from a seller across the country, but neither of you trusts the other to send money/item first.",
    recipient: {
      name: "Alex (Vintage Guitar Seller)",
      location: "Unknown Location",
      type: "person"
    },
    amount: "$2,000",
    failureReason: "Trust Requirements",
    failureMessage: "Transaction cancelled: Buyer and seller require trusted escrow service. Traditional escrow services charge 3-5% fees and take 7-14 days to process. Seller demands payment first, buyer refuses without guarantees.",
    completed: false
  },
  {
    id: 6,
    title: "Automated Insurance Claim",
    description: "File a flight delay insurance claim that should pay out automatically when your flight is delayed.",
    scenario: "Your flight is delayed 4+ hours, clearly triggering your insurance policy payout. However, the insurance company finds ways to deny your valid claim.",
    recipient: {
      name: "TravelSafe Insurance",
      location: "Insurance Company",
      type: "business"
    },
    amount: "$300",
    failureReason: "Claim Denied",
    failureMessage: "Claim denied: After review, the airline classified this as 'extraordinary circumstances' due to air traffic control issues. Additionally, our updated terms of service (effective last month) now exclude delays on Fridays during peak travel season. No payout will be issued.",
    completed: false
  },
  {
    id: 7,
    title: "Withdraw Cash in Nigeria",
    description: "You need to withdraw cash for daily expenses, but strict government limits restrict your access to your own money.",
    scenario: "You need N50,000 (about $120) for rent and groceries this week, withdraw your money to pay your rent!",
    recipient: {
      name: "Local ATM/Bank",
      location: "Lagos, Nigeria",
      type: "business"
    },
    amount: "N50,000",
    failureReason: "Government Cash Withdrawal Limits",
    failureMessage: "Transaction blocked: Weekly cash withdrawal limit of N20,000 ($45) exceeded. Your account is frozen from further cash withdrawals until next week. Learn more about Nigeria's cash withdrawal policy: https://www.ubagroup.com/nigeria/cbn-cash-withdrawal-policy/",
    completed: false
  },
  {
    id: 8,
    title: "Donate to Opposition Political Party",
    description: "Support the Pink Party's campaign for democratic reforms and civil liberties protection.",
    scenario: "You believe strongly in the Pink Party's platform of protecting voting rights and civil liberties. You want to make a donation of $50 to support their campaign before the election.",
    recipient: {
      name: "The Pink Party Campaign",
      location: "Political Opposition",
      type: "charity"
    },
    amount: "$50",
    failureReason: "FBI Investigation",
    failureMessage: "Transaction blocked: The government has blocked your $50 donation to an opposition political party. The FBI showed up at your door asking questions about your political activities and affiliations. Your donation has been flagged as suspicious activity. Learn more about threats to civil liberties: https://www.npr.org/2024/10/21/nx-s1-5134924/trump-election-2024-kamala-harris-elizabeth-cheney-threat-civil-liberties and mysterious deaths of political opponents: https://www.rferl.org/a/enemies-kremlin-deaths-prigozhin-list/32562583.html",
    completed: false
  }
];

const WhyBlockchainApp: React.FC = () => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [challengeStates, setChallengeStates] = useState<Challenge[]>(challenges);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [processingChallenges, setProcessingChallenges] = useState<Set<number>>(new Set());

  const completedChallenges = challengeStates.filter(c => c.completed).length;
  const totalChallenges = challengeStates.length;
  const currentChallenge = challengeStates[currentChallengeIndex];

  const handleNextChallenge = () => {
    if (currentChallengeIndex < challengeStates.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    }
  };

  const handlePrevChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
    }
  };

  const handleAttemptTransfer = (challenge: Challenge) => {
    setProcessingChallenges(prev => new Set(prev).add(challenge.id));
    
    // Simulate processing time
    setTimeout(() => {
      setProcessingChallenges(prev => {
        const newSet = new Set(prev);
        newSet.delete(challenge.id);
        return newSet;
      });
      setSelectedChallenge(challenge);
      setShowFailureModal(true);
      
      // Mark challenge as completed (attempted)
      setChallengeStates(prev => 
        prev.map(c => c.id === challenge.id ? { ...c, completed: true } : c)
      );
    }, 2000);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'person': return '👤';
      case 'charity': return '🏥';
      case 'business': return '🏢';
      default: return '💼';
    }
  };

  const getColorForChallenge = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  const renderMessageWithLinks = (message: string) => {
    // Simple approach: replace specific patterns with links
    let result = message;
    
    // Handle "Learn more about threats to civil liberties: URL"
    result = result.replace(
      /(Learn more about threats to civil liberties): (https?:\/\/[^\s]+)/g,
      (_, linkText, url) => `LINK1:${linkText}|${url}`
    );
    
    // Handle "mysterious deaths of political opponents: URL"
    result = result.replace(
      /(mysterious deaths of political opponents): (https?:\/\/[^\s]+)/g,
      (_, linkText, url) => `LINK2:${linkText}|${url}`
    );
    
    // Split and render
    const parts = result.split(/(LINK[12]:[^|]+\|[^\s]+)/g);
    
    return parts.map((part, index) => {
      const linkMatch = part.match(/LINK[12]:([^|]+)\|(.+)/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const url = linkMatch[2];
        
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {linkText}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title and Introduction */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Blockchain
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the real-world problems with traditional financial systems. 
            Try to complete these everyday transactions and discover why blockchain technology matters.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Challenge {currentChallengeIndex + 1} of {totalChallenges}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentChallengeIndex + 1) / totalChallenges) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Challenge */}
        <div className="max-w-2xl mx-auto">
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Challenge Header */}
            <div className={`${getColorForChallenge(currentChallengeIndex)} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{currentChallenge.title}</h3>
                {currentChallenge.completed && (
                  <CheckCircle size={20} className="text-white" />
                )}
              </div>
            </div>

            {/* Challenge Content */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {currentChallenge.description}
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  {currentChallenge.scenario}
                </p>
              </div>

              {/* Recipient Info */}
              <div className="flex items-center space-x-3 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-2xl">{getIconForType(currentChallenge.recipient.type)}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentChallenge.recipient.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentChallenge.recipient.location}
                  </p>
                </div>
              </div>

              {/* Amount and Action */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <DollarSign size={20} className="text-green-600" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentChallenge.amount}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAttemptTransfer(currentChallenge)}
                  disabled={processingChallenges.has(currentChallenge.id) || currentChallenge.completed}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    currentChallenge.completed
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : processingChallenges.has(currentChallenge.id)
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {currentChallenge.completed 
                    ? 'Attempted' 
                    : processingChallenges.has(currentChallenge.id)
                    ? 'Processing...' 
                    : 'Send Money'
                  }
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handlePrevChallenge}
                  disabled={currentChallengeIndex === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentChallengeIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2">
                  {challengeStates.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentChallengeIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentChallengeIndex
                          ? 'bg-blue-600'
                          : challengeStates[index].completed
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextChallenge}
                  disabled={currentChallengeIndex === challengeStates.length - 1 || !currentChallenge.completed}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentChallengeIndex === challengeStates.length - 1 || !currentChallenge.completed
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {completedChallenges === totalChallenges && (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="text-center">
              <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                All Challenges Attempted!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                You've experienced the limitations of traditional financial systems. 
                Blockchain technology solves these problems by enabling peer-to-peer transactions 
                without geographic restrictions, banking hours, or centralized control.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Failure Modal */}
      {showFailureModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Lock size={24} className="text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transaction Failed
                </h3>
              </div>
              <button
                onClick={() => setShowFailureModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle size={16} className="text-red-600" />
                <span className="font-medium text-red-600">
                  {selectedChallenge.failureReason}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {renderMessageWithLinks(selectedChallenge.failureMessage)}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>With Blockchain:</strong> {
                  selectedChallenge.id <= 3 
                    ? "This transaction would be completed in minutes, 24/7, without geographic restrictions or intermediary approval."
                    : selectedChallenge.id === 4
                    ? "This payment would be completed instantly, outside banking hours, enabling global freelancer payments 24/7."
                    : selectedChallenge.id === 5
                    ? "Smart contracts enable trustless escrow - funds are automatically released when both parties fulfill conditions, with no fees or delays."
                    : selectedChallenge.id === 6
                    ? "Smart contracts automatically execute payouts when conditions are met (flight delay data from oracles), eliminating manual reviews and reducing claim denial rates to near zero."
                    : selectedChallenge.id === 7
                    ? "You control your own money without government withdrawal limits or banking restrictions. Your funds, your choice."
                    : selectedChallenge.id === 8
                    ? "Anonymous donations protect political donors from government surveillance and retaliation. Democracy thrives with financial privacy."
                    : "Blockchain enables financial freedom without intermediary control or government restrictions."
                }
              </p>
            </div>

            <button
              onClick={() => setShowFailureModal(false)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyBlockchainApp;