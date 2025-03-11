import { useState, useEffect } from "react";
import { PillStatus } from "@/src/components/Pill";
import { useEmbeddedEthereumWallet, usePrivy } from "@privy-io/expo";
import { EtherscanService } from "@/src/services/etherscan";
import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import { anvilConfig } from "../configs/AnvilConfig";
import { refresh } from "@react-native-community/netinfo";

export function useUserInfo() {
  const etherscanService = new EtherscanService();
  const { wallets } = useEmbeddedEthereumWallet();
  const { user } = usePrivy();

  const [accountBalance, setAccountBalance] = useState<number>(12000);
  const [walletAddress, setWalletAddress] = useState<string>(
    wallets[0]?.address || "error"
  );

  console.log("Anvil Config:", anvilConfig);
  const provider = new JsonRpcProvider(anvilConfig.ANVIL_HOST_IP, { chainId: 6666, name: "anvil" });

  // fetch balance from anvil forked Scroll chain instead of ethereum mainnet
  async function fetchBalance() {
    if (walletAddress !== "error") {
      try {
        // Create an instance of the USDC contract using ethers v6 style
        const usdcContract = new Contract(anvilConfig.SCROLL_USDC_ADDRESS, anvilConfig.SCROLL_USDC_ABI, provider);
        const balanceBN = await usdcContract.balanceOf(walletAddress);
        // USDC uses 6 decimals; format the balance accordingly.
        const newBalance = Number(formatUnits(balanceBN, 6)) * 1000000;
        console.log("Balance:", newBalance);
        setAccountBalance(+newBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  }

  async function refreshUserInfo() {
    await fetchBalance();
  }

  // Effect to update the balance when needed
  useEffect(() => {
    fetchBalance();
  }, [walletAddress]);

  async function getBalance(address: string): Promise<number> {
    const balance = await etherscanService.getAddressBalance(address);
    return +balance;
  }

  const [accountApy, setAccountApy] = useState<number>(-0.03);
  const [accountStatus, setAccountStatus] = useState<PillStatus>("active");
  const [vaultBalance, setVaultBalance] = useState<number>(40000);
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
  };
}
