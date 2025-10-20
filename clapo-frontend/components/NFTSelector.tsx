"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/lib/constants";
import ClapoNFTABI from "@/lib/contracts/ClapoNFT.json";

interface NFTSelectorProps {
  onSelect: (tokenId: string) => void;
  onClose: () => void;
}

interface NFT {
  tokenId: number;
  collection: string;
  collectionName: string;
}

export function NFTSelector({ onSelect, onClose }: NFTSelectorProps) {
  const { address } = useAccount();
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  // Get user's NFT balance
  const { data: balance } = useReadContracts({
    contracts: [{
      address: CONTRACT_ADDRESSES.ClapoNFT as `0x${string}`,
      abi: ClapoNFTABI.abi as any,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
    }],
  });

  const nftBalance = balance?.[0]?.result ? Number(balance[0].result) : 0;

  // Check ownership of token IDs 0-20
  const { data: ownershipResults } = useReadContracts({
    contracts: Array.from({ length: 20 }, (_, i) => ({
      address: CONTRACT_ADDRESSES.ClapoNFT as `0x${string}`,
      abi: ClapoNFTABI.abi as any,
      functionName: "ownerOf",
      args: [BigInt(i)],
    })),
  });

  // Process results to find owned NFTs
  useEffect(() => {
    if (!address || !ownershipResults) {
      setIsScanning(true);
      return;
    }

    const nfts: NFT[] = [];

    ownershipResults.forEach((result, tokenId) => {
      if (result.status === "success" && result.result) {
        const owner = result.result as string;
        if (owner.toLowerCase() === address.toLowerCase()) {
          nfts.push({
            tokenId,
            collection: CONTRACT_ADDRESSES.ClapoNFT,
            collectionName: "Clapo Game NFT",
          });
        }
      }
    });

    setOwnedNFTs(nfts);
    setIsScanning(false);
  }, [address, ownershipResults]);

  const handleSelect = () => {
    if (selectedTokenId !== null) {
      onSelect(selectedTokenId.toString());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Select Your NFT</h2>
              <p className="text-purple-100">Choose which NFT to stake in this match</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {isScanning ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg mb-2">Scanning for your NFTs...</p>
              <p className="text-gray-500 text-sm">
                This may take a few seconds
              </p>
            </div>
          ) : ownedNFTs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😕</div>
              <p className="text-gray-400 text-lg mb-2">No NFTs found</p>
              <p className="text-gray-500 text-sm mb-4">
                You need a Clapo Game NFT to play.
              </p>
              <div className="bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-gray-400 text-sm mb-2">
                  Connected wallet: <span className="text-white font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  NFT balance detected: <span className="text-white">{nftBalance}</span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">
                You own {ownedNFTs.length} NFT{ownedNFTs.length !== 1 ? "s" : ""}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ownedNFTs.map((nft) => (
                  <button
                    key={nft.tokenId}
                    onClick={() => setSelectedTokenId(nft.tokenId)}
                    className={`relative bg-gray-800 rounded-xl p-4 border-2 transition-all hover:scale-105 ${
                      selectedTokenId === nft.tokenId
                        ? "border-purple-500 shadow-lg shadow-purple-500/50"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {/* NFT Image Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-3 flex items-center justify-center">
                      <div className="text-6xl">🎮</div>
                    </div>

                    {/* NFT Info */}
                    <div className="text-left">
                      <div className="text-sm text-gray-400 mb-1">
                        {nft.collectionName}
                      </div>
                      <div className="text-lg font-bold text-white mb-1">
                        #{nft.tokenId}
                      </div>
                      <div className="text-xs text-gray-500 font-mono truncate">
                        {nft.collection.slice(0, 6)}...{nft.collection.slice(-4)}
                      </div>
                    </div>

                    {/* Selected Checkmark */}
                    {selectedTokenId === nft.tokenId && (
                      <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-6 bg-gray-900/50">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={selectedTokenId === null || isScanning}
              className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                selectedTokenId !== null && !isScanning
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isScanning
                ? "Scanning..."
                : selectedTokenId !== null
                ? `Select NFT #${selectedTokenId}`
                : "Select an NFT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
