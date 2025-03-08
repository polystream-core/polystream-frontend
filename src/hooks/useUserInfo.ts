import {useState} from "react";
import {PillStatus} from "@/src/components/Pill";
import { useEmbeddedWallet, usePrivy } from "@privy-io/expo";

export function useUserInfo() {
  const {account} = useEmbeddedWallet();
  const {user} = usePrivy();
  const [accountBalance, setAccountBalance] = useState<number>(12000);
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
  );  const [walletAddress, setWalletAddress] = useState<string>(account?.address || 'error');

  // Add ./src/service/xx.ts to retrieve the user values from backend

  return {
    accountBalance,
    setAccountBalance,
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