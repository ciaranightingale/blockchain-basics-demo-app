// src/components/CompletionModal.tsx
import { Trophy, CheckCircle, Sparkles, Star } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompletionModal = ({ isOpen, onClose }: CompletionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          {/* Celebration Header */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <div className="absolute -top-4 -left-4">
              <Star className="w-5 h-5 text-orange-400 animate-bounce" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Congratulations! 🎉
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            You've successfully completed the entire DeFi Demo Suite!
          </p>

          {/* Completion Checklist */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-3">What you accomplished:</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Sent a crypto transaction between wallets</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Performed a token swap on the DEX</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Staked tokens and claimed rewards</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>🚀 You're now ready for real DeFi!</strong><br />
              You've experienced the core interactions that power decentralized finance.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg"
          >
            Amazing! 🌟
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;