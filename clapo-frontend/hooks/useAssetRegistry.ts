import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, type AssetSymbol } from "@/lib/constants";
import AssetRegistryABI from "@/lib/contracts/AssetRegistry.json";
import { keccak256, encodePacked } from "viem";

export function useAssetRegistry() {
  // Validate portfolio
  const useValidatePortfolio = (assets: AssetSymbol[]) => {
    const assetBytes = assets.map((symbol) =>
      keccak256(encodePacked(["string"], [symbol]))
    );

    const { data, isLoading } = useReadContract({
      address: CONTRACT_ADDRESSES.AssetRegistry as `0x${string}`,
      abi: AssetRegistryABI.abi,
      functionName: "validatePortfolio",
      args: [assetBytes],
    });

    return {
      isValid: data ? (data as [boolean, bigint])[0] : false,
      totalCost: data ? (data as [boolean, bigint])[1] : BigInt(0),
      isLoading,
    };
  };

  // Get enabled assets
  const useEnabledAssets = () => {
    const { data, isLoading } = useReadContract({
      address: CONTRACT_ADDRESSES.AssetRegistry as `0x${string}`,
      abi: AssetRegistryABI.abi,
      functionName: "getEnabledAssets",
    });

    return {
      assets: data as `0x${string}`[] | undefined,
      isLoading,
    };
  };

  // Get asset details
  const useAsset = (symbol: AssetSymbol) => {
    const symbolBytes = keccak256(encodePacked(["string"], [symbol]));

    const { data, isLoading } = useReadContract({
      address: CONTRACT_ADDRESSES.AssetRegistry as `0x${string}`,
      abi: AssetRegistryABI.abi,
      functionName: "getAsset",
      args: [symbolBytes],
    });

    return {
      asset: data,
      isLoading,
    };
  };

  return {
    useValidatePortfolio,
    useEnabledAssets,
    useAsset,
  };
}
