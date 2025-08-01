import { useState } from 'react';
import SeedPhraseGenerator from './SeedPhraseGenerator';
import MultiplePrivateKeys from './MultiplePrivateKeys';
import PublicKeyDerivation from './PublicKeyDerivation';
import AddressGenerator from './AddressGenerator';
import MessageSigner from './MessageSigner';
import SignatureVerifier from './SignatureVerifier';

interface PrivateKey {
  id: string;
  index: number;
  key: string;
  derivationPath: string;
}

interface PublicKey {
  id: string;
  key: string;
  compressed: boolean;
  privateKeyId: string;
}

interface Address {
  id: string;
  address: string;
  sourceKeyId: string;
}

function App() {
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [privateKeys, setPrivateKeys] = useState<PrivateKey[]>([]);
  const [publicKeys, setPublicKeys] = useState<PublicKey[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleSeedPhraseGenerated = (phrase: string) => {
    setSeedPhrase(phrase);
    // Reset everything when a new seed phrase is generated
    setPrivateKeys([]);
    setPublicKeys([]);
    setAddresses([]);
  };

  const handlePrivateKeysChange = (keys: PrivateKey[]) => {
    setPrivateKeys(keys);
    // Reset public keys when private keys change (new accounts added/removed)
    setPublicKeys(publicKeys.filter(pk => keys.some(privKey => privKey.id === pk.privateKeyId)));
  };

  const handlePublicKeysChange = (keys: PublicKey[]) => {
    setPublicKeys(keys);
  };

  const handleAddressesChange = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
  };

  const resetAll = () => {
    setSeedPhrase('');
    setPrivateKeys([]);
    setPublicKeys([]);
    setAddresses([]);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          ECDSA Signature Demo
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Learn about the <a href="https://www.cyfrin.io/blog/elliptic-curve-digital-signature-algorithm-and-signatures" className="text-blue-600">Elliptic Curve Digital Signature Algorithm (ECDSA)</a> through interactive demonstrations. 
          Generate seed phrases, derive multiple private keys, create signatures, and verify them step by step!
        </p>

        <div className="space-y-8">
          <SeedPhraseGenerator onSeedPhraseGenerated={handleSeedPhraseGenerated} />
          
          <MultiplePrivateKeys 
            seedPhrase={seedPhrase}
            onPrivateKeysChange={handlePrivateKeysChange}
          />
          
          <PublicKeyDerivation 
            privateKeys={privateKeys} 
            onPublicKeysChange={handlePublicKeysChange}
          />
          
          <AddressGenerator 
            publicKeys={publicKeys} 
            onAddressesChange={handleAddressesChange}
          />
          
          <MessageSigner privateKeys={privateKeys} />
          
          <SignatureVerifier addresses={addresses} />
        </div>

        {(seedPhrase || privateKeys.length > 0 || publicKeys.length > 0) && (
          <div className="mt-12 text-center">
            <button
              onClick={resetAll}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 border border-red-600 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reset All
            </button>
          </div>
        )}

        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About ECDSA</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-semibold dark:text-blue-white mb-2">What is ECDSA?</h3>
              <p>
                <a href="https://www.cyfrin.io/blog/elliptic-curve-digital-signature-algorithm-and-signatures" className='text-blue-600'>ECDSA (Elliptic Curve Digital Signature Algorithm)</a> is a cryptographic algorithm 
                used to create digital signatures. It's based on elliptic curve mathematics and 
                provides the same security as RSA with smaller key sizes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold dark:text-blue-white mb-2">How it works:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Seed phrase: 12 random words that generate all your keys</li>
                <li>Private keys: Derived from seed phrase using BIP44 standard</li>
                <li>Public keys: Derived from private keys using elliptic curve multiplication</li>
                <li>Signatures: Mathematical proof that you own the private key</li>
                <li>Verification: Anyone can verify signatures using the public key</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;