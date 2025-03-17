import { useState, useEffect, useCallback, useRef } from "react";
import { PillStatus } from "@/src/components/Pill";
import {
  getAllUserEmbeddedEthereumWallets,
  useEmbeddedEthereumWallet,
  usePrivy,
} from "@privy-io/expo";
import {
  toNexusAccount,
  createBicoPaymasterClient,
  createSmartAccountClient,
} from "@biconomy/abstractjs";
import { Contract, formatUnits, ethers, N } from "ethers";
import { createWalletClient, http, custom } from "viem";
import {
  MOCK_COMBINED_MEDIUM_RISK_VAULT_ABI,
  MOCK_COMBINED_MEDIUM_RISK_VAULT_CA,
  MOCK_COMBINED_HIGH_RISK_VAULT_ABI,
  MOCK_COMBINED_HIGH_RISK_VAULT_CA,
  MOCK_COMBINED_LOW_RISK_VAULT_ABI,
  MOCK_COMBINED_LOW_RISK_VAULT_CA,
} from "../contracts/MockCombinedVault.sol";
import { MOCK_USDC_ABI, MOCK_USDC_CA } from "../contracts/MockUSDC.sol";
import { baseSepolia } from "viem/chains";
import { env } from "../constants/AppConfig";

export function useUserInfo() {
  const { wallets } = useEmbeddedEthereumWallet();
  const { user, isReady } = usePrivy();
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [embeddedWalletAddress, setEmbeddedWalletAddress] = useState<string>(
    wallets[0]?.address || "error"
  );
  const [accountApy, setAccountApy] = useState<number>(-0.03);
  const [accountStatus, setAccountStatus] = useState<PillStatus>("active");
  const [vaultBalance, setVaultBalance] = useState<number>(0);
  const [lowRiskVaultBalance, setLowRiskVaultBalance] = useState<number>(0);
  const [mediumRiskVaultBalance, setMediumRiskVaultBalance] =
    useState<number>(0);
  const [highRiskVaultBalance, setHighRiskVaultBalance] = useState<number>(0);

  const [vaultApy, setVaultApy] = useState<number>(69.2);
  const [vaultStatus, setVaultStatus] = useState<PillStatus>("active");
  const totalBalance = Number(accountBalance + vaultBalance).toFixed(0);

  const [name, setName] = useState<string>("Chee Heng");
  const [username, setUsername] = useState<string>("cheeheng10");
  const [email, setEmail] = useState<string>("example@scroll.com");
  const [smartAccount, setSmartAccount] = useState(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState("");
  const [isSmartAccountReady, setIsSmartAccountReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const embeddedWallets = isReady
    ? getAllUserEmbeddedEthereumWallets(user)
    : [];
  const primaryWallet = embeddedWallets.find(
    (wallet) => wallet.wallet_index === 0
  );
  const provider = new ethers.JsonRpcProvider(env.BASE_SEPOLIA_RPC, {
    chainId: 84532,
    name: "Base Sepolia",
  });

  // Fetch initial balances once we have a smart account address
  async function fetchInitialBalances(address: any) {
    console.log("Fetching initial balances for address:", address);

    // Create contracts with the provider
    const usdcContract = new Contract(MOCK_USDC_CA, MOCK_USDC_ABI, provider);
    const mediumRiskVaultContract = new Contract(
      MOCK_COMBINED_MEDIUM_RISK_VAULT_CA,
      MOCK_COMBINED_MEDIUM_RISK_VAULT_ABI,
      provider
    );
    const highRiskVaultContract = new Contract(
      MOCK_COMBINED_HIGH_RISK_VAULT_CA,
      MOCK_COMBINED_HIGH_RISK_VAULT_ABI,
      provider
    );
    const lowRiskVaultContract = new Contract(
      MOCK_COMBINED_LOW_RISK_VAULT_CA,
      MOCK_COMBINED_LOW_RISK_VAULT_ABI,
      provider
    );

    // Fetch account balance
    const balanceBN = await usdcContract.balanceOf(address);
    const formattedBalance = Number(formatUnits(balanceBN, 6));
    console.log("Initial User Account Balance:", formattedBalance.toFixed(0));
    setAccountBalance(+formattedBalance.toFixed(0));

    // Fetch vault balance
    const lowRiskVaultBalance = await lowRiskVaultContract.balanceOf(address);
    const lowRiskFormattedVaultBalance = Number(
      formatUnits(lowRiskVaultBalance, 6)
    );

    const mediumRiskVaultBalance = await mediumRiskVaultContract.balanceOf(
      address
    );
    const mediumRiskFormattedVaultBalance = Number(
      formatUnits(mediumRiskVaultBalance, 6)
    );

    const highRiskVaultBalance = await highRiskVaultContract.balanceOf(address);
    const highRiskFormattedVaultBalance = Number(
      formatUnits(highRiskVaultBalance, 6)
    );

    setVaultBalance(
      Number(mediumRiskFormattedVaultBalance.toFixed(0)) +
        Number(highRiskFormattedVaultBalance.toFixed(0)) +
        Number(lowRiskFormattedVaultBalance.toFixed(0))
    );
    setMediumRiskVaultBalance(
      Number(mediumRiskFormattedVaultBalance.toFixed(0))
    );
    setHighRiskVaultBalance(Number(highRiskFormattedVaultBalance.toFixed(0)));
    setLowRiskVaultBalance(Number(lowRiskFormattedVaultBalance.toFixed(0)));
  }

  // Initialize smart account
  useEffect(() => {
    async function initialize() {
      if (!wallets?.[0] || embeddedWalletAddress === "error") return;

      // Prevent multiple simultaneous initialization attempts
      if (isInitializing) return;
      setIsInitializing(true);

      try {
        console.log("Starting smart account initialization...");
        // Create a viem wallet client using Privy's embedded wallet
        const client = createWalletClient({
          account: embeddedWalletAddress as `0x${string}`,
          chain: baseSepolia,
          transport: custom({
            async request({ method, params }) {
              const provider = await wallets[0].getProvider();
              return await provider.request({ method, params });
            },
          }),
        });

        // Initialize Biconomy smart account
        const smartAccountClient = createSmartAccountClient({
          account: await toNexusAccount({
            signer: client,
            chain: baseSepolia,
            transport: http(),
          }),
          transport: http(env.BUNDLER_URL),
          paymaster: createBicoPaymasterClient({
            paymasterUrl: env.PAYMASTER_URL,
          }),
        });

        // Get and store the smart account address
        const address =
          await smartAccountClient.account.getCounterFactualAddress();
        console.log("Smart account address initialized: ", address);
        const emailAddress =
          user?.linked_accounts?.find((acc) => acc.type === "email")?.address ??
          "";

        // Set the state values
        setSmartAccount(smartAccountClient);
        setSmartAccountAddress(address);
        setEmail(emailAddress);
        setName(emailAddress.split("@")[0]);
        setUsername(emailAddress.split("@")[0]);
        setEmbeddedWalletAddress(address);
        setIsSmartAccountReady(true);

        // Now that we have a valid address, fetch the balances
        try {
          await fetchInitialBalances(address);
        } catch (error) {
          console.error("Error fetching initial balances:", error);
        }
      } catch (error) {
        console.error("Error initializing smart account:", error);
        setIsSmartAccountReady(false);
      } finally {
        setIsInitializing(false);
      }
    }

    initialize();
  }, [wallets, embeddedWalletAddress]);

  // Fetch account balance
  async function fetchAccountBalance() {
    console.log(
      "Smart account address in fetchAccountBalance:",
      smartAccountAddress
    );
    if (!smartAccountAddress) {
      console.warn(
        "Cannot fetch account balance: Smart account address is not initialized yet"
      );
      return;
    }

    console.log("Fetching account balance...");
    try {
      // Create an instance of the USDC contract
      const usdcContract = new Contract(MOCK_USDC_CA, MOCK_USDC_ABI, provider);
      const balanceBN = await usdcContract.balanceOf(smartAccountAddress);
      const formattedBalance = Number(formatUnits(balanceBN, 6));
      console.log("User Account Balance:", formattedBalance.toFixed(0));
      setAccountBalance(+formattedBalance.toFixed(0));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setAccountBalance(12000);
    }
  }

  // Fetch vault balance
  async function fetchVaultBalance() {
    console.log(
      "Smart account address in fetchVaultBalance:",
      smartAccountAddress
    );
    if (!smartAccountAddress) {
      console.warn(
        "Cannot fetch vault balance: Smart account address is not initialized yet"
      );
      return;
    }

    console.log("Fetching Vault Balance...");
    try {
      const lowRiskVaultContract = new Contract(
        MOCK_COMBINED_LOW_RISK_VAULT_CA,
        MOCK_COMBINED_LOW_RISK_VAULT_ABI,
        provider
      );
      const mediumRiskVaultContract = new Contract(
        MOCK_COMBINED_MEDIUM_RISK_VAULT_CA,
        MOCK_COMBINED_MEDIUM_RISK_VAULT_ABI,
        provider
      );
      const highRiskVaultContract = new Contract(
        MOCK_COMBINED_HIGH_RISK_VAULT_CA,
        MOCK_COMBINED_HIGH_RISK_VAULT_ABI,
        provider
      );

      // Get user's balance in the vault
      const lowRiskVaultBalance = await lowRiskVaultContract.balanceOf(
        smartAccountAddress
      );
      const mediumRiskVaultBalance = await mediumRiskVaultContract.balanceOf(
        smartAccountAddress
      );
      const highRiskVaultBalance = await highRiskVaultContract.balanceOf(
        smartAccountAddress
      );
      // Format with correct decimals
      const lowRiskFormattedBalance = Number(
        formatUnits(lowRiskVaultBalance, 6)
      );

      const highRiskFormattedBalance = Number(
        formatUnits(highRiskVaultBalance, 6)
      );
      const mediumRiskFormattedBalance = Number(
        formatUnits(mediumRiskVaultBalance, 6)
      );
      console.log(`Low Risk Vault balance: ${lowRiskFormattedBalance}`);
      console.log(`Medium Risk Vault balance: ${mediumRiskFormattedBalance}`);
      console.log(`High Risk Vault balance: ${highRiskFormattedBalance}`);
      // Store the value
      setVaultBalance(
        Number(highRiskFormattedBalance.toFixed(0)) +
          Number(mediumRiskFormattedBalance.toFixed(0)) +
          Number(lowRiskFormattedBalance.toFixed(0))
      );
      setLowRiskVaultBalance(Number(lowRiskFormattedBalance.toFixed(0)));
      setMediumRiskVaultBalance(Number(mediumRiskFormattedBalance.toFixed(0)));
      setHighRiskVaultBalance(Number(highRiskFormattedBalance.toFixed(0)));
    } catch (error) {
      console.error("Error fetching vault balance:", error);
      setVaultBalance(40000);
    }
  }

  // Improved refreshUserInfo with fixed reinitialization
  async function refreshUserInfo() {
    console.log(
      "Refreshing user info, smart account address:",
      smartAccountAddress
    );

    // If we don't have a smart account address yet, but the account is still initializing, wait a bit
    if (!smartAccountAddress) {
      if (isInitializing) {
        console.log(
          "Smart account is currently initializing, waiting before refreshing..."
        );
        // Wait for 2 seconds to give initialization a chance to complete
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Check again after waiting
        if (!smartAccountAddress) {
          console.warn(
            "Still no smart account address after waiting. Cannot refresh balances."
          );
          return;
        }
      } else {
        console.warn(
          "Smart account not initialized and not initializing. Attempting to reinitialize..."
        );
        // Try to reinitialize if we're not already doing so
        try {
          setIsInitializing(true);

          // Create a viem wallet client using Privy's embedded wallet
          const client = createWalletClient({
            account: embeddedWalletAddress as `0x${string}`,
            chain: baseSepolia,
            transport: custom({
              async request({ method, params }) {
                const provider = await wallets[0].getProvider();
                return await provider.request({ method, params });
              },
            }),
          });

          // Initialize Biconomy smart account
          const smartAccountClient = createSmartAccountClient({
            account: await toNexusAccount({
              signer: client,
              chain: baseSepolia,
              transport: http(),
            }),
            transport: http(env.BUNDLER_URL),
            paymaster: createBicoPaymasterClient({
              paymasterUrl: env.PAYMASTER_URL,
            }),
          });

          const address =
            await smartAccountClient.account.getCounterFactualAddress();
          console.log("Smart account reinitialized with address:", address);

          // Set the state values
          setSmartAccount(smartAccountClient);
          setSmartAccountAddress(address);
          setIsSmartAccountReady(true);

          // IMPORTANT: Don't call the state-dependent functions immediately
          // Instead, fetch balances directly using the address we just obtained
          console.log(
            "Fetching balances with newly initialized address:",
            address
          );

          // Create contracts with the provider
          const usdcContract = new Contract(
            MOCK_USDC_CA,
            MOCK_USDC_ABI,
            provider
          );
          const lowRiskVaultContract = new Contract(
            MOCK_COMBINED_LOW_RISK_VAULT_CA,
            MOCK_COMBINED_LOW_RISK_VAULT_ABI,
            provider
          );
          const mediumRiskVaultContract = new Contract(
            MOCK_COMBINED_MEDIUM_RISK_VAULT_CA,
            MOCK_COMBINED_MEDIUM_RISK_VAULT_ABI,
            provider
          );
          const highRiskVaultContract = new Contract(
            MOCK_COMBINED_HIGH_RISK_VAULT_CA,
            MOCK_COMBINED_HIGH_RISK_VAULT_ABI,
            provider
          );

          // Fetch account balance directly using the address
          try {
            const balanceBN = await usdcContract.balanceOf(address);
            const formattedBalance = Number(formatUnits(balanceBN, 6));
            console.log(
              "Reinitialized User Account Balance:",
              formattedBalance.toFixed(0)
            );
            setAccountBalance(+formattedBalance.toFixed(0));

            // Fetch vault balance directly using the address
            const lowRiskVaultBalance = await lowRiskVaultContract.balanceOf(
              address
            );
            const lowRiskFormattedVaultBalance = Number(
              formatUnits(lowRiskVaultBalance, 6)
            );
            const mediumRiskVaultBalance =
              await mediumRiskVaultContract.balanceOf(address);
            const mediumRiskFormattedVaultBalance = Number(
              formatUnits(mediumRiskVaultBalance, 6)
            );
            const highRiskVaultBalance = await highRiskVaultContract.balanceOf(
              address
            );
            const highRiskFormattedVaultBalance = Number(
              formatUnits(highRiskVaultBalance, 6)
            );
            console.log(
              "Reinitialized Low Risk Vault Balance:",
              lowRiskFormattedVaultBalance.toFixed(0)
            );
            console.log(
              "Reinitialized Medium Risk Vault Balance:",
              mediumRiskFormattedVaultBalance.toFixed(0)
            );
            console.log(
              "Reinitialized High Risk Vault Balance:",
              highRiskFormattedVaultBalance.toFixed(0)
            );
            setVaultBalance(
              Number(mediumRiskFormattedVaultBalance.toFixed(0)) +
                Number(highRiskFormattedVaultBalance.toFixed(0)) +
                Number(lowRiskFormattedVaultBalance.toFixed(0))
            );
            setLowRiskVaultBalance(
              Number(lowRiskFormattedVaultBalance.toFixed(0))
            );
            setMediumRiskVaultBalance(
              Number(mediumRiskFormattedVaultBalance.toFixed(0))
            );
            setHighRiskVaultBalance(
              Number(highRiskFormattedVaultBalance.toFixed(0))
            );

            console.log(
              "Successfully refreshed balances after reinitialization"
            );
          } catch (error) {
            console.error(
              "Error fetching balances after reinitialization:",
              error
            );
          }
        } catch (error) {
          console.error("Error reinitializing smart account:", error);
        } finally {
          setIsInitializing(false);
        }
        return;
      }
    }

    // If we have a valid address now, proceed with the refresh
    console.log(
      "Proceeding with balance refresh using address:",
      smartAccountAddress
    );
    await fetchAccountBalance();
    await fetchVaultBalance();
    console.log("Balance refresh completed");
  }

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
    embeddedWalletAddress,
    refreshUserInfo,
    provider,
    primaryWallet,
    isReady,
    fetchAccountBalance,
    fetchVaultBalance,
    smartAccountAddress,
    smartAccount,
    isSmartAccountReady,
    isInitializing,
    lowRiskVaultBalance,
    mediumRiskVaultBalance,
    highRiskVaultBalance,
  };
}
