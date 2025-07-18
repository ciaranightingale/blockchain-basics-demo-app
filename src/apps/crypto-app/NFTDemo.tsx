// src/demos/NFTDemo.jsx
import React, { useState } from 'react';
import { Image, Heart, Eye, ShoppingCart, Wallet, Filter, Search } from 'lucide-react';
import TransactionModal from './TransactionModal';
import { useToast } from './Toast';

const NFTDemo = () => {
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedNFTs, setLikedNFTs] = useState(new Set());
  const [transactionData, setTransactionData] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { showToast, ToastComponent } = useToast();

  // Mock NFT data
  const nftCollections = [
    {
      id: 1,
      name: 'Cosmic Cats #1337',
      image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Cosmic+Cat',
      price: '2.5 ETH',
      priceUSD: '$6,250',
      creator: 'CosmicCreator',
      owner: '0x742d35...73ac',
      category: 'art',
      rarity: 'Rare',
      views: 1240,
      likes: 89,
      description: 'A majestic cosmic cat floating through the digital universe.',
      attributes: [
        { trait_type: 'Background', value: 'Cosmic Purple' },
        { trait_type: 'Eyes', value: 'Galaxy' },
        { trait_type: 'Accessory', value: 'Star Crown' }
      ]
    },
    {
      id: 2,
      name: 'Digital Dreams #0042',
      image: 'https://via.placeholder.com/300x300/10b981/ffffff?text=Digital+Dream',
      price: '1.8 ETH',
      priceUSD: '$4,500',
      creator: 'DigitalArtist',
      owner: '0x8ba1f1...04b',
      category: 'art',
      rarity: 'Common',
      views: 856,
      likes: 67,
      description: 'Abstract digital art representing the future of creativity.',
      attributes: [
        { trait_type: 'Style', value: 'Abstract' },
        { trait_type: 'Colors', value: 'Neon' },
        { trait_type: 'Mood', value: 'Energetic' }
      ]
    },
    {
      id: 3,
      name: 'Pixel Warrior #2500',
      image: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=Pixel+Warrior',
      price: '0.75 ETH',
      priceUSD: '$1,875',
      creator: 'PixelMaster',
      owner: '0x2a5e34...91c',
      category: 'gaming',
      rarity: 'Epic',
      views: 2103,
      likes: 156,
      description: '8-bit warrior ready for battle in the metaverse.',
      attributes: [
        { trait_type: 'Class', value: 'Warrior' },
        { trait_type: 'Weapon', value: 'Pixel Sword' },
        { trait_type: 'Armor', value: 'Golden' }
      ]
    },
    {
      id: 4,
      name: 'Nature Spirit #0001',
      image: 'https://via.placeholder.com/300x300/059669/ffffff?text=Nature+Spirit',
      price: '3.2 ETH',
      priceUSD: '$8,000',
      creator: 'EcoArtist',
      owner: '0x9f1c23...45d',
      category: 'nature',
      rarity: 'Legendary',
      views: 892,
      likes: 134,
      description: 'Ancient forest spirit protecting the digital realm.',
      attributes: [
        { trait_type: 'Element', value: 'Earth' },
        { trait_type: 'Power', value: 'Growth' },
        { trait_type: 'Aura', value: 'Mystical' }
      ]
    },
    {
      id: 5,
      name: 'Cyber Punk #3000',
      image: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=Cyber+Punk',
      price: '1.2 ETH',
      priceUSD: '$3,000',
      creator: 'CyberCreator',
      owner: '0x4c0883...18a',
      category: 'art',
      rarity: 'Uncommon',
      views: 1567,
      likes: 98,
      description: 'Futuristic punk character from the digital underground.',
      attributes: [
        { trait_type: 'Style', value: 'Cyberpunk' },
        { trait_type: 'Augmentation', value: 'Neural' },
        { trait_type: 'Status', value: 'Rebel' }
      ]
    },
    {
      id: 6,
      name: 'Space Explorer #0777',
      image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Space+Explorer',
      price: '0.95 ETH',
      priceUSD: '$2,375',
      creator: 'SpaceArt',
      owner: '0x1a2b3c...89z',
      category: 'gaming',
      rarity: 'Rare',
      views: 734,
      likes: 45,
      description: 'Brave explorer charting unknown digital galaxies.',
      attributes: [
        { trait_type: 'Suit', value: 'Advanced' },
        { trait_type: 'Helmet', value: 'Quantum' },
        { trait_type: 'Mission', value: 'Explorer' }
      ]
    }
  ];

  const toggleLike = (nftId) => {
    const newLikedNFTs = new Set(likedNFTs);
    if (newLikedNFTs.has(nftId)) {
      newLikedNFTs.delete(nftId);
    } else {
      newLikedNFTs.add(nftId);
    }
    setLikedNFTs(newLikedNFTs);
  };

  const filteredNFTs = nftCollections.filter(nft => {
    const matchesFilter = filter === 'all' || nft.category === filter;
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.creator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBuyNFT = (nft) => {
    setSelectedNFT(nft);
    
    // Prepare transaction data
    const txData = {
      from: '0x742d35Cc7B4C4532C...a3eC73ac',
      to: nft.owner,
      action: `Purchase ${nft.name}`,
      price: nft.price,
      fee: '~$2.50',
      total: nft.price,
      details: [
        `Nonce: ${Math.floor(Math.random() * 1000000)}`,
        `Gas Price: 20 Gwei`,
        `Gas Limit: 85000`,
        `Creator Fee: 2.5%`,
        `Platform Fee: 2.5%`
      ],
      customContent: (
        <div className="flex items-center space-x-2 text-sm text-blue-800">
          <Wallet className="w-4 h-4" />
          <span>This NFT will be added to your wallet after purchase</span>
        </div>
      )
    };

    setTransactionData(txData);
    setShowBuyModal(true);
  };

  const executePurchase = () => {
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      setShowBuyModal(false);
      
      showToast(
        `${selectedNFT.name} has been added to your wallet!`,
        'success',
        'NFT Purchase Successful! 🖼️'
      );
      
      setSelectedNFT(null);
      setTransactionData(null);
    }, 2000);
  };

  const NFTCard = ({ nft }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative group">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors">
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => toggleLike(nft.id)}
              className={`bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors ${
                likedNFTs.has(nft.id) ? 'text-red-500' : 'text-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${likedNFTs.has(nft.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            nft.rarity === 'Legendary' ? 'bg-yellow-500 text-white' :
            nft.rarity === 'Epic' ? 'bg-purple-500 text-white' :
            nft.rarity === 'Rare' ? 'bg-blue-500 text-white' :
            nft.rarity === 'Uncommon' ? 'bg-green-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {nft.rarity}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{nft.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{nft.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500">
            by <span className="font-medium text-blue-600">{nft.creator}</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{nft.views}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{nft.likes}</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">{nft.price}</div>
            <div className="text-sm text-gray-500">{nft.priceUSD}</div>
          </div>
          <button
            onClick={() => handleBuyNFT(nft)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Image className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NFT Marketplace</h1>
          <p className="text-gray-600">Discover, collect, and sell extraordinary NFTs</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search NFTs, creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="art">Art</option>
                <option value="gaming">Gaming</option>
                <option value="nature">Nature</option>
              </select>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNFTs.map(nft => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No NFTs Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        <TransactionModal
          isOpen={showBuyModal}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedNFT(null);
            setTransactionData(null);
          }}
          onConfirm={executePurchase}
          title={`Purchase ${selectedNFT?.name || 'NFT'}`}
          transactionData={transactionData || {}}
          isProcessing={isPurchasing}
        />

        <ToastComponent />
      </div>
    </div>
  );
};

export default NFTDemo;