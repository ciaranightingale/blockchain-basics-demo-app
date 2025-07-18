// src/components/TransactionModal.jsx
const TransactionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  transactionData,
  isProcessing = false 
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm text-yellow-800">
                <strong>⚠️ Review carefully:</strong> This transaction cannot be undone once signed.
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              {transactionData.from && (
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-mono text-sm">{transactionData.from}</span>
                </div>
              )}
              {transactionData.to && (
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-mono text-sm">{transactionData.to}</span>
                </div>
              )}
              {transactionData.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold">{transactionData.amount}</span>
                </div>
              )}
              {transactionData.action && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Action:</span>
                  <span className="font-bold">{transactionData.action}</span>
                </div>
              )}
              {transactionData.price && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold">{transactionData.price}</span>
                </div>
              )}
              {transactionData.fee && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee:</span>
                  <span>{transactionData.fee}</span>
                </div>
              )}
              {transactionData.total && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600 font-medium">Total:</span>
                  <span className="font-bold text-lg">{transactionData.total}</span>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {transactionData.details && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Transaction Details:</h4>
                <div className="text-xs font-mono bg-white p-2 rounded border space-y-1">
                  {transactionData.details.map((detail, index) => (
                    <div key={index}>{detail}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom content */}
            {transactionData.customContent && (
              <div className="bg-blue-50 rounded-lg p-4">
                {transactionData.customContent}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
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