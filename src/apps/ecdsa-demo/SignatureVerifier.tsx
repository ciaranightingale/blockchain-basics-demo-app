import { useState } from 'react';
import { verifySignature } from '../../utils/crypto';

interface SignatureVerifierProps {
  publicKeys: { id: string; key: string; compressed: boolean }[];
}

export default function SignatureVerifier({ publicKeys }: SignatureVerifierProps) {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    const publicKey = publicKeys[0]?.key;
    if (!message || !signature || !publicKey) return;
    
    setIsVerifying(true);
    try {
      const result = verifySignature(message, signature, publicKey);
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setMessage('');
    setSignature('');
    setVerificationResult(null);
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">5</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Verify Signature</h2>
      </div>

      {publicKeys.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-300">
          <p>Generate a public key first to verify signatures</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            <p>Verify signatures using the original message and public key:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Enter the exact message that was signed</li>
              <li>Provide the signature to verify</li>
              <li>Select the corresponding public key</li>
            </ul>
          </div>

          <div className="space-y-4">
          <label className="block text-sm font-medium text-blue-600 dark:text-blue-400">
            Original Message:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={4}
            placeholder="Enter the original message that was signed..."
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-blue-600 dark:text-blue-400">
            Signature:
          </label>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent font-mono text-sm text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter the signature to verify..."
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-blue-600 dark:text-blue-400">
            Public Key for Verification:
          </label>
          {publicKeys.length > 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="font-mono text-sm break-all text-gray-700 dark:text-gray-300">
                {publicKeys[0].key}
              </div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              No public key available. Generate a public key first.
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleVerify}
            disabled={!message || !signature || publicKeys.length === 0 || isVerifying}
            className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-blue-500 hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 disabled:hover:border-blue-500 dark:disabled:hover:bg-blue-600 dark:disabled:hover:border-blue-600"
          >
            {isVerifying ? 'Verifying...' : 'Verify Signature'}
          </button>
          <button
            onClick={resetVerification}
            className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-gray-500 hover:border-gray-600 dark:border-gray-600 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Reset
          </button>
        </div>

        {verificationResult !== null && (
          <div className={`p-4 rounded-lg border-2 ${
            verificationResult 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                verificationResult ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <span className="text-white font-bold">
                  {verificationResult ? '✓' : '✗'}
                </span>
              </div>
              <div>
                <p className={`font-bold text-lg ${
                  verificationResult ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {verificationResult ? 'Signature Valid!' : 'Signature Invalid!'}
                </p>
                <p className="text-sm">
                  {verificationResult 
                    ? 'The signature was created by the holder of the corresponding private key.' 
                    : 'The signature does not match the message and public key combination.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium mb-1 text-blue-600 dark:text-blue-400">How signature verification works:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>The message is hashed using keccak256</li>
                <li>The signature is verified against the hash and public key</li>
                <li>Only the holder of the corresponding private key could have created a valid signature</li>
                <li>This proves authenticity and non-repudiation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}