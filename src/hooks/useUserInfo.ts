import { useState, useEffect } from "react";
import { PillStatus } from "@/src/components/Pill";
import { useEmbeddedEthereumWallet, usePrivy } from "@privy-io/expo";
import { EtherscanService } from "@/src/services/etherscan";

export function useUserInfo() {
  const etherscanService = new EtherscanService();
  const { wallets } = useEmbeddedEthereumWallet();
  const { user } = usePrivy();

  const [accountBalance, setAccountBalance] = useState<number>(12000);
  const [walletAddress, setWalletAddress] = useState<string>(wallets[0]?.address || 'error');

  // Effect to update the balance when needed
  useEffect(() => {
    async function fetchBalance() {
      if (walletAddress !== 'error') {
        try {
          const balance = await etherscanService.getAddressBalance(walletAddress);
          setAccountBalance(+balance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    }

    fetchBalance();
  }, [walletAddress]);

  async function getBalance(address: string): Promise<number> {
    const balance = await etherscanService.getAddressBalance(address);
    return +balance;
  }

  const [accountApy, setAccountApy] = useState<number>(-0.03);
  const [accountStatus, setAccountStatus] = useState<PillStatus>('active');
  const [vaultBalance, setVaultBalance] = useState<number>(40000);
  const [vaultApy, setVaultApy] = useState<number>(69.2);
  const [vaultStatus, setVaultStatus] = useState<PillStatus>('active');
  const totalBalance = accountBalance + vaultBalance;

  const [name, setName] = useState<string>('Chee Heng');
  const [username, setUsername] = useState<string>('cheeheng10');
  const [email, setEmail] = useState<string>(
    // @ts-ignore
    user.linked_accounts.find(account => account.type === 'email')?.address || 'example@scroll.com'
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
    walletAddress
  }
}