import {useState} from "react";
import {PillStatus} from "@/src/components/Pill";

export function useUserInfo() {
  const [accountBalance, setAccountBalance] = useState<number>(12000);
  const [accountApy, setAccountApy] = useState<number>(-0.03);
  const [accountStatus, setAccountStatus] = useState<PillStatus>('active');
  const [vaultBalance, setVaultBalance] = useState<number>(40000);
  const [vaultApy, setVaultApy] = useState<number>(69.2);
  const [vaultStatus, setVaultStatus] = useState<PillStatus>('active');
  const totalBalance = accountBalance + vaultBalance;

  const [name, setName] = useState<string>('Chee Heng');
  const [username, setUsername] = useState<string>('cheeheng10');

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
    username
  }
}