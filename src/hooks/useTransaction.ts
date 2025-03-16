import { useState, useEffect } from "react";
import { Wallet, Contract, parseUnits, formatUnits, ethers } from "ethers";
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
import { MOCK_USDC_CA, MOCK_USDC_ABI } from "../contracts/MockUSDC.sol";
import {
  MOCK_COMBINED_VAULT_CA,
  MOCK_COMBINED_VAULT_ABI,
} from "../contracts/MockCombinedVault.sol";

// Constants matching the test script
const AAVE_PROTOCOL_ID = 1; // Assuming Constants.AAVE_PROTOCOL_ID is 1
const AAVE_POOL_ADDRESS = "0x11fCfe756c05AD438e312a7fd934381537D3cFfe"; // Example address - replace with actual
const USDC_ADDRESS = scrollUSDCCA;
const USDC_ATOKEN_ADDRESS = "0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD"; // Example address - replace with actual

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
        // const localProvider = new JsonRpcProvider(anvilConfig.ANVIL_HOST_IP);
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
        // Use the first Anvil pre-funded account private key
        // const devWallet = new Wallet(
        //   anvilConfig.ANVIL_PRE_FUNDED_WALLET_PRIVATE_KEY,
        //   localProvider
        // );

        // const devWallet = new Wallet(smartAccountAddress, baseSepoliaProvider);

        // console.log("Initialized wallet:", devWallet.address);
        setProvider(baseSepoliaProvider);
        // setSigner(devWallet);
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
        // const usdc = new Contract(USDC_ADDRESS, scrollUSDCCABI, signer);
        const usdc = new Contract(MOCK_USDC_CA, MOCK_USDC_ABI, provider);

        // Initialize vault contracts
        // const highRiskVault = new Contract(
        //   COMBINED_VAULT_HIGH_RISK_CA,
        //   COMBINED_VAULT_HIGH_RISK_ABI,
        //   signer
        // );

        const mockCombinedVault = new Contract(
          MOCK_COMBINED_VAULT_CA,
          MOCK_COMBINED_VAULT_ABI,
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
        setHighRiskVaultContract(mockCombinedVault);
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

    // runSetup();
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
    // if (!amount || !smartAccount || !smartAccountAddress) {
    //   console.error("Missing amount or smart account not initialized");
    //   return;
    // }

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

      // Get the transaction hash and wait for it to be mined
      console.log("Approval transaction hash:", approveUserOpResponse.hash);
      console.log("Waiting for approval transaction to be mined...");

      // // Wait for transaction to be included in a block
      // const approveReceipt = await smartAccount.waitForUserOperationTransaction(
      //   {
      //     hash: approveUserOpResponse.hash,
      //   }
      // );
      console.log("Approval successful. Receipt:");

      // Now deposit into the vault
      console.log("Depositing into vault...");
      const depositUserOp = await smartAccount.sendTransaction({
        to: vaultAddress,
        data: depositCalldata,
      });

      // Wait for the deposit transaction to be mined
      // const depositReceipt = await depositUserOp.wait();
      console.log(
        "Deposit successful. Transaction hash:",
        // depositReceipt.transactionHash
      );

      // Verify vault balance
      try {
        // Use a read-only provider to check balances
        const provider = new ethers.JsonRpcProvider(
          "https://sepolia.base.org",
          {
            chainId: 84532,
            name: "Base Sepolia",
          }
        );

        // Check USDC balance
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

        // setVaultBalance(displayBalance);
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
      // console.log("Withdrawal transaction hash:", withdrawUserOpResponse.hash);
      console.log("Waiting for withdrawal transaction to be mined...");
      
      // Wait for transaction to be included in a block
      // const withdrawReceipt = await smartAccount.waitForUserOperationTransaction({
      //   hash: withdrawUserOpResponse.hash,
      // });
      console.log("Withdrawal successful. Receipt:");
  
      // Verify balances after withdrawal
      try {
        // Use a read-only provider to check balances
        const provider = new ethers.JsonRpcProvider("https://sepolia.base.org", {
          chainId: 84532,
          name: "Base Sepolia",
        });
        
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
    // advanceTime,
    harvestRewards,
  };
}
