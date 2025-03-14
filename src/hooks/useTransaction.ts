import { useState, useEffect } from "react";
import {
  JsonRpcProvider,
  Wallet,
  Contract,
  parseUnits,
  formatUnits,
} from "ethers";
import { anvilConfig } from "../configs/AnvilConfig";
import { useUserInfo } from "./useUserInfo";
import { vaultAbi, vaultCA, rewardManagerCA} from "../contracts/Vault.sol";
import { scrollUSDCCA, scrollUSDCCABI } from "../contracts/Scroll_USDC.sol";

export function useTransaction() {
  const { refreshUserInfo, setVaultBalance } =
    useUserInfo();
  const [isInitialized, setIsInitialized] = useState(false);
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<Wallet | null>(null);

  // TODO: Now using Anvil's pre-funded account to sign the transaction and gas fees, need to wait for gasless function
  useEffect(() => {
    const initializeWallet = async () => {
      if (isInitialized) return;

      try {
        // Create direct connection to Anvil
        const localProvider = new JsonRpcProvider(anvilConfig.ANVIL_HOST_IP);

        // Use the first Anvil pre-funded account private key
        const devWallet = new Wallet(
          anvilConfig.ANVIL_PRE_FUNDED_WALLET_PRIVATE_KEY,
          localProvider
        );

        console.log("Initialized wallet:", devWallet.address);
        setProvider(localProvider);
        setSigner(devWallet);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing wallet:", error);
      }
    };

    initializeWallet();
  }, [isInitialized]);

  async function transferWalletToVault(amount: number | undefined) {
    if (!amount || !signer) {
      console.error("Missing amount or signer not initialized");
      return;
    }

    try {
      console.log("Transferring from wallet to vault:", amount);

      // Create contract instances
      const usdcContract = new Contract(scrollUSDCCA, scrollUSDCCABI, signer);

      const vaultContract = new Contract(vaultCA, vaultAbi, signer);

      // Convert amount to USDC units (6 decimals)
      const amountInWei = amount;

      // First approve USDC spending by the vault
      console.log("Approving USDC...");
      const approveTx = await usdcContract.approve(vaultCA, amountInWei);
      const approveReceipt = await approveTx.wait();
      console.log("Approval complete:", approveReceipt.hash);

      // Then deposit to vault
      console.log("Depositing to vault...");
      const userAddress = await signer.getAddress(); // Get the user's address
      const depositTx = await vaultContract.deposit(userAddress, amountInWei);
      const depositReceipt = await depositTx.wait();
      console.log("Deposit complete:", depositReceipt.hash);

      return depositReceipt;
    } catch (error) {
      console.error("Error transferring to vault:", error);
      throw error;
    }
  }

  async function transferVaultToWallet(amount: number | undefined) {
    if (!amount || !signer) {
      console.error("Missing amount or signer not initialized");
      return;
    }

    try {
      console.log("Transferring from vault to wallet:", amount);

      // Create vault contract instance
      const vaultContract = new Contract(vaultCA, vaultAbi, signer);

      // Convert amount to appropriate units
      const amountInWei = amount

      // Execute withdrawal transaction
      console.log("Withdrawing from vault...");
      const userAddress = await signer.getAddress();

      // need to call this function to set the reward manager address, only once
      // await vaultContract.setRewardManager(rewardManagerCA);

      // get user's share balance
      const userShareBalance = await vaultContract.balanceOf(userAddress);
      console.log("User share balance:", userShareBalance.toString());

      const withdrawTx = await vaultContract.withdraw(userAddress, amountInWei);
      const withdrawReceipt = await withdrawTx.wait();
      console.log("Withdrawal complete:", withdrawReceipt.hash);

      // Refresh balances after successful transaction
      await refreshUserInfo();

      return withdrawReceipt;
    } catch (error) {
      console.error("Error transferring from vault:", error);
      throw error;
    }
  }

  return {
    transferWalletToVault,
    transferVaultToWallet,
    isInitialized,
  };
}
