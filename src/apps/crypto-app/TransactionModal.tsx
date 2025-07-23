// src/components/TransactionModal.jsx
interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  transactionData: any;
  isProcessing?: boolean;
}

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  transactionData,
  isProcessing = false 
}: TransactionModalProps) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>⚠️ Review carefully:</strong> This transaction cannot be undone once signed.
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              {transactionData.from && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">From:</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">{transactionData.from}</span>
                </div>
              )}
              {transactionData.to && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">To:</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">{transactionData.to}</span>
                </div>
              )}
              {transactionData.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{transactionData.amount}</span>
                </div>
              )}
              {transactionData.action && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Action:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{transactionData.action}</span>
                </div>
              )}
              {transactionData.price && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{transactionData.price}</span>
                </div>
              )}
              {transactionData.fee && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Network Fee:</span>
                  <span className="text-gray-900 dark:text-white">{transactionData.fee}</span>
                </div>
              )}
              {transactionData.total && (
                <div className="flex justify-between border-t dark:border-gray-600 pt-2">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Total:</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{transactionData.total}</span>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {transactionData.details && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Transaction Details:</h4>
                <div className="text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-600 space-y-1">
                  {transactionData.details.map((detail: string, index: number) => (
                    <div key={index} className="text-gray-900 dark:text-white">{detail}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom content */}
            {transactionData.customContent && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                {transactionData.customContent}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
            >
              {isProcessing ? 'Processing...' : 'Sign & Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;