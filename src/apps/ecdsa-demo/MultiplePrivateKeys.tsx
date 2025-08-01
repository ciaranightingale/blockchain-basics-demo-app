import { useState } from "react";
import { ethers } from "ethers";
import { Plus, Copy, Eye, EyeOff, Trash2 } from "lucide-react";

interface PrivateKey {
  id: string;
  index: number;
  key: string;
  derivationPath: string;
}

interface MultiplePrivateKeysProps {
  seedPhrase: string;
  onPrivateKeysChange: (keys: PrivateKey[]) => void;
}

export default function MultiplePrivateKeys({
  seedPhrase,
  onPrivateKeysChange,
}: MultiplePrivateKeysProps) {
  const [privateKeys, setPrivateKeys] = useState<PrivateKey[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copySuccess, setCopySuccess] = useState<string>("");

  const derivePrivateKey = () => {
    if (!seedPhrase) return;

    try {
      const nextIndex = privateKeys.length;
      // Use BIP44 derivation path for Ethereum: m/44'/60'/0'/0/index
      const derivationPath = `m/44'/60'/0'/0/${nextIndex}`;

      // Create HD wallet from mnemonic
      const hdNode = ethers.HDNodeWallet.fromPhrase(
        seedPhrase,
        undefined,
        derivationPath
      );

      const newKey: PrivateKey = {
        id: `key-${nextIndex}`,
        index: nextIndex,
        key: hdNode.privateKey,
        derivationPath,
      };

      const updatedKeys = [...privateKeys, newKey];
      setPrivateKeys(updatedKeys);
      onPrivateKeysChange(updatedKeys);
    } catch (error) {
      console.error("Error deriving private key:", error);
    }
  };

  const removePrivateKey = (keyId: string) => {
    const updatedKeys = privateKeys.filter((key) => key.id !== keyId);
    setPrivateKeys(updatedKeys);
    onPrivateKeysChange(updatedKeys);

    // Remove from visible keys set
    const newVisibleKeys = new Set(visibleKeys);
    newVisibleKeys.delete(keyId);
    setVisibleKeys(newVisibleKeys);
  };

  const toggleVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (visibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyPrivateKey = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopySuccess(keyId);
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const isVisible = (keyId: string) => visibleKeys.has(keyId);

  if (!seedPhrase) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          2. Derive Private Keys
        </h2>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Generate a seed phrase first to derive multiple private keys.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        2. Derive Private Keys
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Derive multiple private keys from your seed phrase.
        creates multiple accounts.
      </p>

      <div className="space-y-4">
        <button
          onClick={derivePrivateKey}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-green-600 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Plus size={20} />
          <span>Add Private Key (Account {privateKeys.length})</span>
        </button>

        {privateKeys.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Derived Private Keys ({privateKeys.length})
            </h3>

            {privateKeys.map((privateKey) => (
              <div
                key={privateKey.id}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Account {privateKey.index}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisibility(privateKey.id)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title={
                        isVisible(privateKey.id)
                          ? "Hide private key"
                          : "Show private key"
                      }
                    >
                      {isVisible(privateKey.id) ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        copyPrivateKey(privateKey.key, privateKey.id)
                      }
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Copy private key"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => removePrivateKey(privateKey.id)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Remove private key"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-3 py-2">
                  <span className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                    {isVisible(privateKey.id) ? privateKey.key : "•".repeat(66)}
                  </span>
                </div>

                {copySuccess === privateKey.id && (
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium mt-2">
                    ✓ Private key copied to clipboard!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {privateKeys.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <div className="text-yellow-600 dark:text-yellow-400 text-sm">
                <strong>Important:</strong> Store private keys securely. Anyone with access to it can control all associated funds.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
