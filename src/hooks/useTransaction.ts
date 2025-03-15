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
import {
  AAVE_ADAPTER_ABI,
  AAVE_ADAPTER_CA,
} from "../contracts/AaveAdapter.sol";
import {
  COMBINED_VAULT_HIGH_RISK_ABI,
  COMBINED_VAULT_HIGH_RISK_CA,
  COMBINED_VAULT_LOW_RISK_ABI,
  COMBINED_VAULT_LOW_RISK_CA,
  COMBINED_VAULT_MEDIUM_RISK_ABI,
  COMBINED_VAULT_MEDIUM_RISK_CA,
} from "../contracts/CombinedVault.sol";
import {
  PROTOCOL_REGISTRY_ABI,
  PROTOCOL_REGISTRY_CA,
} from "../contracts/ProtocolRegistry.sol";
import {
  REWARD_MANAGER_ABI,
  REWARD_MANAGER_CA,
} from "../contracts/RewardManager.sol";
import { scrollUSDCCA, scrollUSDCCABI } from "../contracts/Scroll_USDC.sol";

// Constants matching the test script
const AAVE_PROTOCOL_ID = 1; // Assuming Constants.AAVE_PROTOCOL_ID is 1
const AAVE_POOL_ADDRESS = "0x11fCfe756c05AD438e312a7fd934381537D3cFfe"; // Example address - replace with actual
const USDC_ADDRESS = scrollUSDCCA;
const USDC_ATOKEN_ADDRESS = "0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD"; // Example address - replace with actual

export function useTransaction() {
  const { refreshUserInfo, setVaultBalance } = useUserInfo();
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
  // const [mediumRiskVaultContract, setMediumRiskVaultContract] =
  //   useState<Contract | null>(null);
  // const [lowRiskVaultContract, setLowRiskVaultContract] =
  //   useState<Contract | null>(null);

  // Initialize wallet and provider
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

  // And in your initialization code:
  useEffect(() => {
    const initializeContracts = async () => {
      if (!isInitialized || !provider || !signer) return;

      try {
        // Initialize USDC contract
        const usdc = new Contract(USDC_ADDRESS, scrollUSDCCABI, signer);

        // Initialize vault contracts
        const highRiskVault = new Contract(
          COMBINED_VAULT_HIGH_RISK_CA,
          COMBINED_VAULT_HIGH_RISK_ABI,
          signer
        );
        const mediumRiskVault = new Contract(
          COMBINED_VAULT_MEDIUM_RISK_CA,
          COMBINED_VAULT_MEDIUM_RISK_ABI,
          signer
        );
        const lowRiskVault = new Contract(
          COMBINED_VAULT_LOW_RISK_CA,
          COMBINED_VAULT_LOW_RISK_ABI,
          signer
        );
        const registryContract = new Contract(
          PROTOCOL_REGISTRY_CA,
          PROTOCOL_REGISTRY_ABI,
          signer
        );

        // Initialize Aave adapter contract
        const aaveAdapter = new Contract(
          AAVE_ADAPTER_CA,
          AAVE_ADAPTER_ABI,
          signer
        );

        // Initialize reward manager contract
        const rewardManager = new Contract(
          REWARD_MANAGER_CA,
          REWARD_MANAGER_ABI,
          signer
        );

        // Set state
        setUsdcContract(usdc);
        setHighRiskVaultContract(highRiskVault);
        // setMediumRiskVaultContract(mediumRiskVault);
        // setLowRiskVaultContract(lowRiskVault);
        setRegistryContract(registryContract);
        setAaveAdapterContract(aaveAdapter);
        setRewardManagerContract(rewardManager);

        console.log("Contracts initialized");
      } catch (error) {
        console.error("Error initializing contracts:", error);
      }
    };

    initializeContracts();
  }, [isInitialized, provider, signer]);

  // Run setup once, similar to the test script
  useEffect(() => {
    const runSetup = async () => {
      if (
        !isInitialized ||
        isSetupComplete ||
        !signer ||
        !usdcContract ||
        !registryContract ||
        !aaveAdapterContract ||
        !rewardManagerContract ||
        !highRiskVaultContract
        // !mediumRiskVaultContract ||
        // !lowRiskVaultContract
      ) {
        return;
      }

      try {
        console.log("Starting setup process...");

        // Step 1: Register protocol in registry (only needs to be done once)
        let isProtocolRegistered = false;
        try {
          const protocolName = await registryContract.getProtocolName(
            AAVE_PROTOCOL_ID
          );
          if (protocolName && protocolName !== "") {
            isProtocolRegistered = true;
            console.log(
              `Protocol ${AAVE_PROTOCOL_ID} already registered as: ${protocolName}`
            );
          }
        } catch (error) {
          // If this fails, protocol is not registered
        }

        if (!isProtocolRegistered) {
          console.log("Registering Aave protocol...");
          const txRegisterProtocol = await registryContract.registerProtocol(
            AAVE_PROTOCOL_ID,
            "Aave V3"
          );
          await txRegisterProtocol.wait();
          console.log("Protocol registered successfully");
        }

        // Step 2: Configure adapter (only needs to be done once)
        let isAssetSupported = false;
        try {
          const aTokenAddress = await aaveAdapterContract.getAToken(
            USDC_ADDRESS
          );
          if (
            aTokenAddress &&
            aTokenAddress !== "0x0000000000000000000000000000000000000000"
          ) {
            isAssetSupported = true;
            console.log(
              `USDC already supported in Aave adapter with aToken: ${aTokenAddress}`
            );
          }
        } catch (error) {
          // If this fails, asset is not supported
        }

        if (!isAssetSupported) {
          console.log("Adding USDC as supported asset...");
          const txAddSupportedAsset =
            await aaveAdapterContract.addSupportedAsset(
              USDC_ADDRESS,
              USDC_ATOKEN_ADDRESS
            );
          await txAddSupportedAsset.wait();
          console.log("USDC added as supported asset");
        }

        // Step 3: Register adapter in registry (only needs to be done once)
        let isAdapterRegistered = false;
        try {
          const adapterAddress = await registryContract.getAdapter(
            AAVE_PROTOCOL_ID,
            USDC_ADDRESS
          );
          if (
            adapterAddress &&
            adapterAddress !== "0x0000000000000000000000000000000000000000"
          ) {
            isAdapterRegistered = true;
            console.log(
              `Adapter already registered for protocol ${AAVE_PROTOCOL_ID} and USDC: ${adapterAddress}`
            );
          }
        } catch (error) {
          // If this fails, adapter is not registered
        }

        if (!isAdapterRegistered) {
          console.log("Registering Aave adapter...");
          const txRegisterAdapter = await registryContract.registerAdapter(
            AAVE_PROTOCOL_ID,
            USDC_ADDRESS,
            AAVE_ADAPTER_CA
          );
          await txRegisterAdapter.wait();
          console.log("Adapter registered successfully");
        }

        // Step 4: Configure each vault separately

        // High Risk Vault Setup
        // await setupVault(highRiskVaultContract, "High Risk");

        const vaultName = "High Risk";
        const vaultContract = highRiskVaultContract;
        console.log(`Setting up ${vaultName} vault...`);

        // Check if vault already has protocols
        let hasProtocols = false;
        try {
          const activeProtocolCount = await vaultContract.activeProtocolIds(0);
          if (activeProtocolCount) {
            console.log(`${vaultName} vault already has active protocols.`);
            hasProtocols = true;
          }
        } catch (error) {
          // If this fails, it means there are no active protocols
          console.log(`${vaultName} vault has no active protocols yet.`);
        }

        // Add protocol to vault if needed
        if (!hasProtocols) {
          try {
            console.log(`Adding Aave protocol to ${vaultName} vault...`);
            const txAddProtocol = await vaultContract.addProtocol(
              AAVE_PROTOCOL_ID
            );
            await txAddProtocol.wait();
            console.log(`Aave protocol added to ${vaultName} vault`);
          } catch (error: any) {
            console.log(
              `Error adding protocol to ${vaultName} vault, it may already be added:`,
              error.message
            );
          }
        }

        console.log(`${vaultName} vault setup complete`);

        // Medium Risk Vault Setup
        // await setupVault(mediumRiskVaultContract, "Medium Risk");

        // Low Risk Vault Setup
        // await setupVault(lowRiskVaultContract, "Low Risk");

        console.log("All vaults setup completed successfully");
        setIsSetupComplete(true);
      } catch (error: any) {
        console.error("Error during setup:", error);
        // If we get an error that suggests setup is already done, mark as complete
        if (
          error.message &&
          (error.message.includes("Protocol already active") ||
            error.message.includes("RewardManager already set"))
        ) {
          console.log("Setup already partially completed, marking as complete");
          setIsSetupComplete(true);
        }
      }
    };

    runSetup();
  }, [
    isInitialized,
    isSetupComplete,
    signer,
    usdcContract,
    registryContract,
    aaveAdapterContract,
    rewardManagerContract,
    highRiskVaultContract,
    // mediumRiskVaultContract,
    // lowRiskVaultContract,
  ]);

  async function transferWalletToVault(amount: number | undefined) {
    if (!amount || !signer || !usdcContract || !highRiskVaultContract) {
      console.error("Missing amount, signer, or contracts not initialized");
      return;
    }

    try {
      // Check initial balance
      const initialBalance = await usdcContract.balanceOf(signer.address);
      console.log(
        `Initial wallet USDC balance: ${formatUnits(initialBalance, 6)}`
      );

      console.log(`Transferring ${amount} USDC to vault...`);

      // Convert amount to the correct format (USDC has 6 decimals)
      const amountInWei = amount;

      // Check if we have enough balance
      if (initialBalance < amountInWei) {
        console.warn(
          `Insufficient balance: ${formatUnits(
            initialBalance,
            6
          )} USDC, trying to transfer ${amount} USDC`
        );
        throw new Error("Insufficient USDC balance for transfer");
      }

      // First approve the vault to spend USDC
      console.log("Approving USDC spending...");
      const approveTx = await usdcContract.approve(
        highRiskVaultContract.target,
        amountInWei
      );
      await approveTx.wait();
      console.log("Approval successful");

      // Now deposit into the vault
      console.log("Depositing into vault...");
      const depositTx = await highRiskVaultContract.deposit(
        signer.address,
        amountInWei
      );
      await depositTx.wait();
      console.log("Deposit successful");

      // Check final balance after transfer
      const finalBalance = await usdcContract.balanceOf(signer.address);
      console.log(`Final wallet USDC balance: ${formatUnits(finalBalance, 6)}`);

      // Verify vault balance if possible
      try {
        const vaultBalance = await highRiskVaultContract.balanceOf(
          signer.address
        );
        // First format it with correct decimals
        const formattedBalance = formatUnits(vaultBalance, 6);
        console.log(`Vault balance: ${formattedBalance}`);

        // Then multiply by 10^6 to get the scaled value for display
        const displayBalance = Number(formattedBalance) * 1000000;
        console.log(`Display vault balance: ${displayBalance}`);
        
        // Store the multiplied value
        // setVaultBalance(displayBalance);
      } catch (e) {
        console.log("Could not retrieve vault balance");
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
    if (!amount || !signer || !highRiskVaultContract) {
      console.error("Missing amount, signer, or contracts not initialized");
      return;
    }

    try {
      console.log(`Withdrawing ${amount} shares from vault...`);

      // First, we need to scale down our amount by 10^6 since it was multiplied for display
      const actualAmount = amount / 1000000;
      console.log(`Scaled down to: ${actualAmount}`);

      // Convert actual amount to blockchain format using parseUnits
      const amountInWei = parseUnits(actualAmount.toString(), 6);

      // Now withdraw from the vault
      const withdrawTx = await highRiskVaultContract.withdraw(
        signer.address,
        amountInWei
      );
      await withdrawTx.wait();
      console.log("Withdrawal successful");

      // Refresh user info after successful withdrawal
      await refreshUserInfo();

      return true;
    } catch (error) {
      console.error("Error transferring from vault:", error);
      throw error;
    }
  }

  async function advanceTime(days: number) {
    if (!provider) {
      console.error("Provider not initialized");
      return;
    }

    try {
      console.log(`Advancing time by ${days} days...`);

      // Calculate seconds from days
      const seconds = days * 24 * 60 * 60;

      // Use the evm_increaseTime JSON-RPC method to advance time
      await provider.send("evm_increaseTime", [seconds]);

      // Mine a new block to apply the time change
      await provider.send("evm_mine", []);

      console.log(`Time advanced by ${days} days`);

      // Optionally check current block timestamp
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlock(blockNumber);

      // Add null check before accessing timestamp
      if (block) {
        console.log(
          `Current block timestamp: ${new Date(Number(block.timestamp) * 1000)}`
        );
      } else {
        console.log("Block information not available");
      }

      return true;
    } catch (error) {
      console.error("Error advancing time:", error);
      return false;
    }
  }

  async function harvestRewards() {
    try {
      if (!highRiskVaultContract) {
        console.error("Vault contract not initialized");
        return false;
      }

      console.log("Harvesting rewards...");

      // Call the checkAndHarvest function on the vault
      const harvestTx = await highRiskVaultContract.checkAndHarvest();
      const receipt = await harvestTx.wait();

      // Look for the Harvested event in the logs
      const harvestedEvent = receipt.logs.find((log: any) => {
        // This assumes your contract emits a Harvested event
        try {
          return (
            highRiskVaultContract.interface.parseLog(log)?.name === "Harvested"
          );
        } catch (e) {
          return false;
        }
      });

      if (harvestedEvent) {
        // Parse the event to get the harvested amount
        const parsedEvent =
          highRiskVaultContract.interface.parseLog(harvestedEvent);
        if (
          parsedEvent &&
          parsedEvent.args &&
          parsedEvent.args.harvestedAmount
        ) {
          const harvestedAmount = parsedEvent.args.harvestedAmount;
          console.log("Harvested amount:", formatUnits(harvestedAmount, 6)); // Assuming 6 decimals for USDC
        } else {
          console.log("Could not parse harvested amount from event");
        }
      } else {
        console.log("No harvest event found in logs");

        // Alternative: Just log the transaction hash so you can look it up later
        console.log("Transaction hash for manual verification:", receipt.hash);
      }

      console.log("Rewards harvested successfully");

      // Refresh user info to see updated balances
      await refreshUserInfo();

      return true;
    } catch (error) {
      console.error("Error harvesting rewards:", error);
      return false;
    }
  }

  return {
    transferWalletToVault,
    transferVaultToWallet,
    isInitialized,
    isSetupComplete,
    advanceTime,
    harvestRewards,
  };
}
