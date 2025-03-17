import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import {
  MOCK_COMBINED_MEDIUM_RISK_VAULT_ABI,
  MOCK_COMBINED_MEDIUM_RISK_VAULT_CA,
  MOCK_COMBINED_HIGH_RISK_VAULT_CA,
  MOCK_COMBINED_LOW_RISK_VAULT_CA,
} from "../contracts/MockCombinedVault.sol";
import { MOCK_USDC_CA } from "../contracts/MockUSDC.sol";
import { env } from "../constants/AppConfig";

// Define vault configurations
const VAULTS = {
  LOW_RISK: {
    name: "Low Risk",
    address: MOCK_COMBINED_LOW_RISK_VAULT_CA,
  },
  MEDIUM_RISK: {
    name: "Medium Risk",
    address: MOCK_COMBINED_MEDIUM_RISK_VAULT_CA,
  },
  HIGH_RISK: {
    name: "High Risk",
    address: MOCK_COMBINED_HIGH_RISK_VAULT_CA,
  },
};

export function useApy() {
  const [apyData, setApyData] = useState({
    lowRiskApy: 0,
    mediumRiskApy: 0,
    highRiskApy: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchApys() {
      setIsLoading(true);
      setError(null);

      try {
        // Create a provider
        const provider = new ethers.JsonRpcProvider(env.BASE_SEPOLIA_RPC, {
          chainId: 84532,
          name: "Base Sepolia",
        });

        console.log("Provider connected to Base Sepolia");

        // Create standard interfaces we'll reuse
        const vaultAbi = MOCK_COMBINED_MEDIUM_RISK_VAULT_ABI; // Assuming all vaults have the same ABI
        const registryInterface = new ethers.Interface([
          "function getAdapter(uint256 protocolId, address asset) external view returns (address)",
          "function getActiveProtocolId() external view override returns (uint256)",
        ]);
        const adapterInterface = new ethers.Interface([
          "function getAPY(address) external view returns (uint256)",
        ]);

        // Create a function to fetch APY for a specific vault
        async function getVaultApy(vaultAddress, vaultName) {
          // Create vault contract instance
          const vaultContract = new Contract(vaultAddress, vaultAbi, provider);
          
          // Get registry address
          const registryAddress = await vaultContract.registry();
          console.log(`${vaultName} Registry address:`, registryAddress);
          
          // Create registry contract instance
          const registry = new Contract(registryAddress, registryInterface, provider);
          
          // Get active protocol ID
          const activeProtocolId = await registry.getActiveProtocolId();
          console.log(`${vaultName} Active protocol ID:`, Number(activeProtocolId));
          
          // Get adapter address
          const adapterAddress = await registry.getAdapter(activeProtocolId, MOCK_USDC_CA);
          console.log(`${vaultName} Adapter address:`, adapterAddress);
          
          // Create adapter contract instance
          const adapter = new Contract(adapterAddress, adapterInterface, provider);
          
          // Get APY
          const apyBigInt = await adapter.getAPY(MOCK_USDC_CA);
          const apy = Number(apyBigInt) / 100;
          console.log(`${vaultName} APY:`, apy);
          
          return apy;
        }

        // Fetch APY for all vaults in parallel
        const [lowRiskApy, mediumRiskApy, highRiskApy] = await Promise.all([
          getVaultApy(VAULTS.LOW_RISK.address, VAULTS.LOW_RISK.name),
          getVaultApy(VAULTS.MEDIUM_RISK.address, VAULTS.MEDIUM_RISK.name),
          getVaultApy(VAULTS.HIGH_RISK.address, VAULTS.HIGH_RISK.name),
        ]);

        // Update state with all APYs
        setApyData({
          lowRiskApy,
          mediumRiskApy,
          highRiskApy,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching APYs:", error);
        setError("Failed to fetch APY data");
        setIsLoading(false);
      }
    }

    fetchApys();

    // Optional: Set up interval to periodically refresh APY data
    const intervalId = setInterval(fetchApys, 5 * 60 * 1000); // every 5 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    ...apyData,
    isLoading,
    error,
    refreshApys: () => {
      setIsLoading(true);
      setError(null);
      fetchApys();
    },
  };
}