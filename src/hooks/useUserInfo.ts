import { useState, useEffect, useCallback } from "react";
import { PillStatus } from "@/src/components/Pill";
import {
  getAllUserEmbeddedEthereumWallets,
  useEmbeddedEthereumWallet,
  usePrivy,
} from "@privy-io/expo";
import { toNexusAccount, createBicoPaymasterClient, createSmartAccountClient } from "@biconomy/abstractjs";
import { EtherscanService } from "@/src/services/etherscan";
import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import { anvilConfig } from "../configs/AnvilConfig";
import {
  COMBINED_VAULT_HIGH_RISK_ABI,
  COMBINED_VAULT_HIGH_RISK_CA,
} from "../contracts/CombinedVault.sol";
import {
  REWARD_MANAGER_ABI,
  REWARD_MANAGER_CA,
} from "../contracts/RewardManager.sol";
import {
  encodeFunctionData,
  createWalletClient,
  createPublicClient,
  http,
  custom,
  parseEther,
  parseGwei,
} from "viem";
import { baseSepolia } from "viem/chains";
import { env } from "../constants/AppConfig";

export function useUserInfo() {
  const etherscanService = new EtherscanService();
  const { wallets } = useEmbeddedEthereumWallet();
  const { user, isReady } = usePrivy();

  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>(
    wallets[0]?.address || "error"
  );
  const [accountApy, setAccountApy] = useState<number>(-0.03);
  const [accountStatus, setAccountStatus] = useState<PillStatus>("active");
  const [vaultBalance, setVaultBalance] = useState<number>(0);
  const [vaultApy, setVaultApy] = useState<number>(69.2);
  const [vaultStatus, setVaultStatus] = useState<PillStatus>("active");
  const totalBalance = accountBalance + vaultBalance;

  const [name, setName] = useState<string>("Chee Heng");
  const [username, setUsername] = useState<string>("cheeheng10");
  const [email, setEmail] = useState<string>(
    // @ts-ignore
    user.linked_accounts.find((account) => account.type === "email")?.address ||
      "example@scroll.com"
  );
  const [smartAccount, setSmartAccount] = useState(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState("");
  const [isSmartAccountReady, setIsSmartAccountReady] = useState(false);

  const embeddedWallets = isReady
    ? getAllUserEmbeddedEthereumWallets(user)
    : [];
  const primaryWallet = embeddedWallets.find(
    (wallet) => wallet.wallet_index === 0
  );
  const provider = new JsonRpcProvider(anvilConfig.ANVIL_HOST_IP, {
    chainId: 6666,
    name: "anvil",
  });

  const initSmartAccount = useCallback(async () => {
    if (!wallets?.[0] || walletAddress === "error") return;

    try {
      // Create a viem wallet client using Privy's embedded wallet
      const client = createWalletClient({
        account: walletAddress as `0x${string}`,
        chain: baseSepolia,
        transport: custom({
          async request({ method, params }) {
            // First get the provider (it's a Promise)
            const provider = await wallets[0].getProvider();
            // Then call request() on the resolved provider
            return await provider.request({ method, params });
          },
        }),
      });

      console.log("Bundler URL:", env.BUNDLER_URL);
      console.log("Paymaster API Key:", env.PAYMASTER_URL);

      // Initialize Biconomy smart account
      const smartAccountClient = createSmartAccountClient({
        account: await toNexusAccount({
          signer: client, // Your existing client
          chain: baseSepolia,
          transport: http(),
        }),
        transport: http(env.BUNDLER_URL), // Full URL
        paymaster: createBicoPaymasterClient({ 
          paymasterUrl: env.PAYMASTER_URL // Full URL
        }),
      });

      // Get and store the smart account address
      const address = await smartAccountClient.account.getCounterFactualAddress();

      console.log("Smart account address: ", address);

      setSmartAccount(smartAccountClient);
      setSmartAccountAddress(address);
      setIsSmartAccountReady(true);
    } catch (error) {
      console.error("Error initializing smart account:", error);
      setIsSmartAccountReady(false);
    }
  }, [wallets, walletAddress]);

  useEffect(() => {
    if (isSmartAccountReady && smartAccountAddress && smartAccount) {
      // send gasless transaction
      try {
        console.log("Smart account:", smartAccount);
        console.log("Smart account address:", smartAccountAddress);
        console.log("Is smart account ready:", isSmartAccountReady);
        sendTestTransaction();
      } catch (error) {
        console.error("Error sending gasless transaction:", error);
      }

      console.log("Send gasless transaction");
    }
  }, [isSmartAccountReady, smartAccountAddress, smartAccount]);

  const sendTestTransaction = async () => {
    if (!isSmartAccountReady || !smartAccount) {
      console.error("Smart account not ready");
      return null;
    }
    
    try {
      // Send to a different address, not to itself
      const testAddress = "0x000000000000000000000000000000000000dEaD"; // Use a burn address for testing
      
      // Send a minimal ETH transfer (proper data format for simple transfer)
      const transactionResponse = await smartAccount.sendTransaction({
        calls: [
          {
            to: testAddress,
            data: "0x", // Empty data for ETH transfer
            value: 1n, // Minimal value (1 wei)
          },
        ]
      });
      
      const { transactionHash } = await transactionResponse.waitForTxHash();
      console.log("Test transaction hash:", transactionHash);
      return transactionHash;
    } catch (error) {
      console.error("Error sending test transaction:", error);
      return null;
    }
  };

  useEffect(() => {
    if (walletAddress !== "error") {
      initSmartAccount();
    }
  }, [walletAddress, initSmartAccount]);

  // fetch balance from anvil forked Scroll chain instead of ethereum mainnet
  async function fetchAccountBalance() {
    if (walletAddress !== "error") {
      console.log("Fetching account balance...");
      try {
        // Create an instance of the USDC contract using ethers v6 style
        const usdcContract = new Contract(
          anvilConfig.SCROLL_USDC_ADDRESS,
          anvilConfig.SCROLL_USDC_ABI,
          provider
        );
        // TODO: const balanceBN = await usdcContract.balanceOf(walletAddress);
        const balanceBN = await usdcContract.balanceOf(
          anvilConfig.ANVIL_PRE_FUNDED_WALLET_ADDRESS
        );
        // USDC uses 6 decimals; format the balance accordingly.
        const newBalance = Number(formatUnits(balanceBN, 6)) * 1000000;
        console.log("User Account Balance:", newBalance.toFixed(2));
        setAccountBalance(+newBalance.toFixed(2));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setAccountBalance(12000);
      }
    }
  }

  async function fetchVaultBalance() {
    if (walletAddress !== "error") {
      console.log("Fetching Vault Balance...");
      try {
        const vaultContract = new Contract(
          COMBINED_VAULT_HIGH_RISK_CA,
          COMBINED_VAULT_HIGH_RISK_ABI,
          provider
        );

        const rewardManagerContract = new Contract(
          REWARD_MANAGER_CA,
          REWARD_MANAGER_ABI,
          provider
        );

        // Get user's balance in the vault
        const vaultBalance = await vaultContract.balanceOf(
          anvilConfig.ANVIL_PRE_FUNDED_WALLET_ADDRESS
        );
        // First format it with correct decimals
        const formattedBalance = formatUnits(vaultBalance, 6);
        console.log(`Vault balance: ${formattedBalance}`);

        // Then multiply by 10^6 to get the scaled value for display
        const displayBalance = Number(formattedBalance) * 1000000;
        console.log(`Display vault balance: ${displayBalance}`);

        // Store the multiplied value
        setVaultBalance(displayBalance);
      } catch (error) {
        console.error("Error fetching vault balance:", error);
        setVaultBalance(40000);
      }
    }
  }

  async function refreshUserInfo() {
    await fetchAccountBalance();
    await fetchVaultBalance();
  }

  // Effect to update the balance when needed
  useEffect(() => {
    fetchAccountBalance();
    fetchVaultBalance();
  }, [walletAddress]);

  return {
    accountBalance,
    accountApy,
    setAccountApy,
    accountStatus,
    setAccountStatus,
    vaultBalance,
    setVaultBalance,
    vaultApy,
    setVaultApy,
    vaultStatus,
    setVaultStatus,
    totalBalance,
    name,
    username,
    email,
    walletAddress,
    refreshUserInfo,
    provider,
    primaryWallet,
    isReady,
    fetchAccountBalance,
    fetchVaultBalance,
  };
}
