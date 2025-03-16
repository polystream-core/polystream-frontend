import { useEffect, useState, useCallback } from "react";
import { Contract, ethers } from "ethers";
import {
  MOCK_COMBINED_MEDIUM_RISK_VAULT_ABI,
  MOCK_COMBINED_MEDIUM_RISK_VAULT_CA,
} from "../contracts/MockCombinedVault.sol";
import { MOCK_USDC_CA } from "../contracts/MockUSDC.sol";

// Protocol IDs for different risk levels
const PROTOCOL_IDS = {
  LOW_RISK: 1,
  MEDIUM_RISK: 2,
};

export function useApy() {
  // State for APY values
  const [lowRiskApy, setLowRiskApy] = useState<number | null>(null);
  const [mediumRiskApy, setMediumRiskApy] = useState<number | null>(null);
  const [highRiskApy, setHighRiskApy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Create a provider
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org", {
    chainId: 84532,
    name: "Base Sepolia",
  });

  // Fetch APY for a specific risk level
  const fetchApy = useCallback(
    async (protocolId: number, assetAddress: string) => {
      try {
        // Create instance of the CombinedVault contract
        const vaultContract = new Contract(
          MOCK_COMBINED_MEDIUM_RISK_VAULT_CA,
          MOCK_COMBINED_MEDIUM_RISK_VAULT_ABI,
          provider
        );

        // Get the registry address from the vault contract
        const registryAddress = await vaultContract.registry();

        // Create an interface for the Registry contract based on the function signatures
        const registryInterface = new ethers.Interface([
          "function getAdapter(uint256 protocolId, address asset) external view returns (address)",
        ]);

        // Create a contract instance for the registry
        const registry = new Contract(
          registryAddress,
          registryInterface,
          provider
        );

        // Get the adapter address
        const adapterAddress = await registry.getAdapter(
          protocolId,
          assetAddress
        );

        // Create an interface for the Protocol Adapter
        const adapterInterface = new ethers.Interface([
          "function getAPY() external view returns (uint256)",
        ]);

        // Create a contract instance for the adapter
        const adapter = new Contract(
          adapterAddress,
          adapterInterface,
          provider
        );

        // Get APY from the adapter
        const apyBigInt = await adapter.getAPY();

        // Convert from basis points (assuming APY is returned in basis points, e.g. 500 = 5%)
        // If the APY is returned differently, adjust this conversion accordingly
        const apyValue = Number(apyBigInt) / 100;

        return apyValue;
      } catch (error) {
        console.error(`Error fetching APY for protocol ${protocolId}:`, error);
        throw error;
      }
    },
    [provider]
  );

  // Fetch all APYs
  const fetchAllApys = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch APY for low risk vault
      const lowApy = await fetchApy(PROTOCOL_IDS.LOW_RISK, MOCK_USDC_CA);
      setLowRiskApy(lowApy);

      // Medium risk is a blended rate (example: average of low and high)
      // You can adjust this calculation based on your actual medium risk definition
      const highApy = await fetchApy(PROTOCOL_IDS.MEDIUM_RISK, MOCK_USDC_CA);
      setHighRiskApy(highApy);

      // Calculate medium risk APY as an average (or any other formula you prefer)
      const mediumApy = (lowApy + highApy) / 2;
      setMediumRiskApy(mediumApy);

      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch APY data");
      setIsLoading(false);
      console.error("Error fetching APYs:", error);
    }
  }, [fetchApy]);

  // Refresh APY data
  const refreshApys = useCallback(() => {
    fetchAllApys();
  }, [fetchAllApys]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchAllApys();

    // Optional: Set up interval to periodically refresh APY data
    const intervalId = setInterval(() => {
      fetchAllApys();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchAllApys]);

  return {
    lowRiskApy,
    mediumRiskApy,
    highRiskApy,
    isLoading,
    error,
    refreshApys,
  };
}
