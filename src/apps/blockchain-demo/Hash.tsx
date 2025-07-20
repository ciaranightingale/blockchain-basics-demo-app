interface HashProps {
  currentTab: string;
  hashData: string;
  computedHash: string;
  setHashData: (data: string) => void;
}

const Hash = ({ currentTab, hashData, computedHash, setHashData }: HashProps) => {
  return (
    <>
        {currentTab === 'hash' && (
            <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Keccak256 Hash</h2>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data:
                    </label>
                    <textarea
                    value={hashData}
                    onChange={(e) => setHashData(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                    placeholder="Enter data to hash..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hash:
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-600 border dark:border-gray-600 rounded-md font-mono text-sm break-all text-gray-900 dark:text-white">
                    {computedHash || ''}
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}
     </>
)};

export default Hash;