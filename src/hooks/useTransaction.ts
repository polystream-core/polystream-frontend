type RiskLevel = 'low' | 'medium' | 'high' | undefined

export function useTransaction() {

  function transferWalletToVault(riskLevel: RiskLevel, amount: number | undefined) {
    console.log(("Transferring from wallet to vault"));
  }

  function transferVaultToWallet(amount: number | undefined) {
    console.log(("Transferring from vault to wallet"));
  }

  return{
    transferWalletToVault,
    transferVaultToWallet
  }
}
