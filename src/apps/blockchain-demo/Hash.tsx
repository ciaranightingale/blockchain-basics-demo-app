const Hash = ({ currentTab, hashData, computedHash, setHashData }) => {
  return (
    <>
        {currentTab === 'hash' && (
            <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Keccak256 Hash</h2>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data:
                    </label>
                    <textarea
                    value={hashData}
                    onChange={(e) => setHashData(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Enter data to hash..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hash:
                    </label>
                    <div className="p-3 bg-gray-50 border rounded-md font-mono text-sm break-all">
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