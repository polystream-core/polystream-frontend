import { useState, useEffect } from "react";
import { Wallet, Contract, parseUnits, formatUnits, ethers, JsonRpcProvider} from "ethers";
import { useUserInfo } from "./useUserInfo";
import { MOCK_USDC_CA, MOCK_USDC_ABI } from "../contracts/MockUSDC.sol";
import {
  MOCK_COMBINED_VAULT_CA,
  MOCK_COMBINED_VAULT_ABI,
} from "../contracts/MockCombinedVault.sol";

export function useTransaction() {
  const {
    refreshUserInfo,
    setVaultBalance,
    smartAccountAddress,
    smartAccount,
  } = useUserInfo();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<Wallet | null>(null);
  const [usdcContract, setUsdcContract] = useState<Contract | null>(null);
  const [registryContract, setRegistryContract] = useState<Contract | null>(
    null
  );
  const [aaveAdapterContract, setAaveAdapterContract] =
    useState<Contract | null>(null);
  const [rewardManagerContract, setRewardManagerContract] =
    useState<Contract | null>(null);
  const [highRiskVaultContract, setHighRiskVaultContract] =
    useState<Contract | null>(null);

  // Initialize wallet and provider
  useEffect(() => {
    const initialiseProvider = async () => {
      if (isInitialized) return;

      try {
        const baseSepoliaProvider = new ethers.JsonRpcProvider(
          "https://sepolia.base.org",
          {
            chainId: 84532,
            name: "Base Sepolia",
          }
        );

        // Wait for the provider to connect
        await baseSepoliaProvider.ready;
        console.log(
          "Provider connected to network:",
          await baseSepoliaProvider.getNetwork()
        );
        setProvider(baseSepoliaProvider);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing wallet:", error);
      }
    };

    initialiseProvider();
  }, [isInitialized]);

  // And in your initialization code:
  useEffect(() => {
    const initializeContracts = async () => {
      if (!isInitialized || !provider || !signer) return;

      try {
        const usdcContract = new Contract(MOCK_USDC_CA, MOCK_USDC_ABI, provider);

        const mockCombinedVault = new Contract(
          MOCK_COMBINED_VAULT_CA,
          MOCK_COMBINED_VAULT_ABI,
          signer
        );

        setUsdcContract(usdcContract);
        setHighRiskVaultContract(mockCombinedVault);

        console.log("Contracts initialized");
      } catch (error) {
        console.error("Error initializing contracts:", error);
      }
    };

    initializeContracts();
  }, [isInitialized, provider]);

  async function transferWalletToVault(amount: number | undefined) {
    if (!amount || !smartAccount || !smartAccountAddress) {
      console.error("Missing amount or smart account not initialized");
      return;
    }

    try {
      console.log(`Transferring ${amount} USDC to vault...`);

      // Convert amount to the correct format (USDC has 6 decimals)
      const amountInWei = parseUnits(amount.toString(), 6);
      console.log(`Amount in wei (scaled with 6 decimals): ${amountInWei}`);

      // USDC and Vault contract addresses
      const usdcAddress = MOCK_USDC_CA;
      const vaultAddress = MOCK_COMBINED_VAULT_CA;

      // Create the USDC approve call data
      const usdcInterface = new ethers.Interface(MOCK_USDC_ABI);
      const approveCalldata = usdcInterface.encodeFunctionData("approve", [
        vaultAddress,
        amountInWei,
      ]);

      // Create the vault deposit call data
      const vaultInterface = new ethers.Interface(MOCK_COMBINED_VAULT_ABI);
      const depositCalldata = vaultInterface.encodeFunctionData("deposit", [
        smartAccountAddress,
        amountInWei,
      ]);

      // Send the transactions through the smart account
      console.log("Approving USDC spending...");
      const approveUserOpResponse = await smartAccount.sendTransaction({
        to: usdcAddress,
        data: approveCalldata,
      });

      console.log("Waiting for approval transaction to be mined...");
      console.log("Approval successful.");

      // Now deposit into the vault
      console.log("Depositing into vault...");
      const depositUserOp = await smartAccount.sendTransaction({
        to: vaultAddress,
        data: depositCalldata,
      });


      console.log(
        "Deposit successful.",
      );

      // Verify vault balance
      try {
        const usdc = new ethers.Contract(usdcAddress, MOCK_USDC_ABI, provider);
        const finalBalance = await usdc.balanceOf(smartAccountAddress);
        console.log(
          `Final wallet USDC balance: ${formatUnits(finalBalance, 6)}`
        );

        // Check vault balance
        const vault = new ethers.Contract(
          vaultAddress,
          MOCK_COMBINED_VAULT_ABI,
          provider
        );
        const vaultBalance = await vault.balanceOf(smartAccountAddress);
        const formattedBalance = formatUnits(vaultBalance, 6);
        console.log(`Vault balance: ${formattedBalance}`);

        setVaultBalance(Number(formattedBalance));
      } catch (e) {
        console.log("Could not retrieve balances:", e);
      }

      // Refresh user info after successful deposit
      await refreshUserInfo();

      return true;
    } catch (error) {
      console.error("Error transferring to vault:", error);
      throw error;
    }
  }

  async function transferVaultToWallet(amount: number | undefined) {
    if (!amount || !smartAccount || !smartAccountAddress) {
      console.error("Missing amount or smart account not initialized");
      return;
    }
  
    try {
      console.log(`Withdrawing ${amount} shares from vault...`);
  
      // Convert amount to the correct format (USDC has 6 decimals)
      const amountInWei = parseUnits(amount.toString(), 6);
      console.log(`Amount in wei (scaled with 6 decimals): ${amountInWei}`);
  
      // Vault contract address
      const vaultAddress = MOCK_COMBINED_VAULT_CA;
  
      // Create the vault withdraw call data
      const vaultInterface = new ethers.Interface(MOCK_COMBINED_VAULT_ABI);
      const withdrawCalldata = vaultInterface.encodeFunctionData("withdraw", [
        smartAccountAddress,
        amountInWei
      ]);
  
      // Send the transaction through the smart account
      console.log("Withdrawing from vault...");
      const withdrawUserOpResponse = await smartAccount.sendTransaction({
        to: vaultAddress,
        data: withdrawCalldata,
      });
      
      // Get the transaction hash and wait for it to be mined
      console.log("Waiting for withdrawal transaction to be mined...");
      console.log("Withdrawal successful");
  
      // Verify balances after withdrawal
      try {
        // Check USDC balance
        const usdc = new ethers.Contract(MOCK_USDC_CA, MOCK_USDC_ABI, provider);
        const finalBalance = await usdc.balanceOf(smartAccountAddress);
        console.log(`Final wallet USDC balance: ${formatUnits(finalBalance, 6)}`);
  
        // Check vault balance
        const vault = new ethers.Contract(vaultAddress, MOCK_COMBINED_VAULT_ABI, provider);
        const vaultBalance = await vault.balanceOf(smartAccountAddress);
        const formattedBalance = formatUnits(vaultBalance, 6);
        console.log(`Vault balance: ${formattedBalance}`);
      } catch (e) {
        console.log("Could not retrieve balances:", e);
      }
      
      // Refresh user info after successful withdrawal
      await refreshUserInfo();
  
      return true;
    } catch (error) {
      console.error("Error transferring from vault:", error);
      throw error;
    }
  }

  return {
    transferWalletToVault,
    transferVaultToWallet,
    isInitialized,
    isSetupComplete,
  };
}
