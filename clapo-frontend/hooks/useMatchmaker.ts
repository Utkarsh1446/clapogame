import { useWriteContract, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, Role, type AssetSymbol } from "@/lib/constants";
import MatchmakerABI from "@/lib/contracts/Matchmaker.json";
import { keccak256, encodePacked } from "viem";

export function useMatchmaker() {
  const { writeContract, data: hash, isPending, isSuccess } = useWriteContract();

  // Helper to create commitment hash
  const createCommitHash = (
    assets: AssetSymbol[],
    roles: Role[],
    salt: string
  ): `0x${string}` => {
    // Convert assets to bytes32 array (keccak256 of symbol)
    const assetBytes = assets.map((symbol) =>
      keccak256(encodePacked(["string"], [symbol]))
    );

    // Encode and hash
    const encoded = encodePacked(
      ["bytes32[]", "uint8[]", "bytes32"],
      [assetBytes as `0x${string}`[], roles.map(r => r), keccak256(encodePacked(["string"], [salt]))]
    );

    return keccak256(encoded);
  };

  // Create a new match
  const createMatch = async (
    nftContract: `0x${string}`,
    nftTokenId: bigint,
    assets: AssetSymbol[],
    roles: Role[],
    salt: string
  ) => {
    const commitHash = createCommitHash(assets, roles, salt);

    return writeContract({
      address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
      abi: MatchmakerABI.abi,
      functionName: "createMatch",
      args: [nftContract, nftTokenId, commitHash],
      gas: BigInt(10000000), // Increased gas limit for Monad
    });
  };

  // Join an existing match
  const joinMatch = async (
    matchId: bigint,
    nftContract: `0x${string}`,
    nftTokenId: bigint,
    assets: AssetSymbol[],
    roles: Role[],
    salt: string
  ) => {
    const commitHash = createCommitHash(assets, roles, salt);

    return writeContract({
      address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
      abi: MatchmakerABI.abi,
      functionName: "joinMatch",
      args: [matchId, nftContract, nftTokenId, commitHash],
      gas: BigInt(10000000), // Increased gas limit for Monad
    });
  };

  // Start a match
  const startMatch = async (matchId: bigint) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
      abi: MatchmakerABI.abi,
      functionName: "startMatch",
      args: [matchId],
      gas: BigInt(10000000), // Increased gas limit for Monad
    });
  };

  // Reveal and settle
  const revealAndSettle = async (
    matchId: bigint,
    assets: AssetSymbol[],
    roles: Role[],
    salt: string
  ) => {
    // Convert assets to bytes32 array
    const assetBytes = assets.map((symbol) =>
      keccak256(encodePacked(["string"], [symbol]))
    );

    return writeContract({
      address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
      abi: MatchmakerABI.abi,
      functionName: "revealAndSettle",
      args: [matchId, assetBytes, roles, keccak256(encodePacked(["string"], [salt]))],
      gas: BigInt(20000000), // Very high gas for price oracle calls and settlement
    });
  };

  // Cancel match
  const cancelMatch = async (matchId: bigint) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
      abi: MatchmakerABI.abi,
      functionName: "cancelMatch",
      args: [matchId],
      gas: BigInt(10000000), // Increased gas limit for Monad
    });
  };

  // Clear stuck match - allows player to leave expired/abandoned matches
  const clearStuckMatch = async () => {
    return writeContract({
      address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
      abi: MatchmakerABI.abi,
      functionName: "clearStuckMatch",
      args: [],
      gas: BigInt(10000000), // Increased gas limit for Monad
    });
  };

  // Force expire match - anyone can cancel matches that expired (120+ seconds old)
  const forceExpireMatch = async (matchId: bigint) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
      abi: MatchmakerABI.abi,
      functionName: "forceExpireMatch",
      args: [matchId],
      gas: BigInt(10000000), // Increased gas limit for Monad
    });
  };

  return {
    createMatch,
    joinMatch,
    startMatch,
    revealAndSettle,
    cancelMatch,
    clearStuckMatch,
    forceExpireMatch,
    isPending,
    isSuccess,
    hash,
  };
}

// Hook to read match data
export function useMatch(matchId: bigint | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
    abi: MatchmakerABI.abi,
    functionName: "getMatch",
    args: matchId !== undefined ? [matchId] : undefined,
  });

  return {
    match: data,
    isLoading,
    error,
  };
}

// Hook to read player's active match
export function usePlayerActiveMatch(address: `0x${string}` | undefined) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.Matchmaker as `0x${string}`,
    abi: MatchmakerABI.abi,
    functionName: "getPlayerActiveMatch",
    args: address ? [address] : undefined,
  });

  return {
    matchId: data as bigint | undefined,
    isLoading,
  };
}
