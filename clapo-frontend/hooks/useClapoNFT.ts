import { useWriteContract, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/lib/constants";
import ClapoNFTABI from "@/lib/contracts/ClapoNFT.json";

export function useClapoNFT() {
  const { writeContract, isPending, isSuccess, data: hash } = useWriteContract();

  // Mint NFT
  const mint = async (to: `0x${string}`) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.ClapoNFT as `0x${string}`,
      abi: ClapoNFTABI.abi,
      functionName: "mint",
      args: [to],
    });
  };

  // Approve NFT for vault
  const approve = async (tokenId: bigint) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.ClapoNFT as `0x${string}`,
      abi: ClapoNFTABI.abi,
      functionName: "approve",
      args: [CONTRACT_ADDRESSES.NFTVault, tokenId],
      gas: BigInt(5000000), // Manually set higher gas limit for Monad
    });
  };

  return {
    mint,
    approve,
    isPending,
    isSuccess,
    hash,
  };
}

// Hook to read NFT owner
export function useNFTOwner(tokenId: bigint | undefined) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.ClapoNFT as `0x${string}`,
    abi: ClapoNFTABI.abi,
    functionName: "ownerOf",
    args: tokenId !== undefined ? [tokenId] : undefined,
  });

  return {
    owner: data as `0x${string}` | undefined,
    isLoading,
  };
}

// Hook to get user's NFT balance
export function useNFTBalance(address: `0x${string}` | undefined) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.ClapoNFT as `0x${string}`,
    abi: ClapoNFTABI.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return {
    balance: data as bigint | undefined,
    isLoading,
  };
}
