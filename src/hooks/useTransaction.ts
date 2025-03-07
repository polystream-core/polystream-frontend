export function useTransaction() {

  function transferWalletToVault() {
    console.log(("Transferring from wallet to vault"));
  }

  function transferVaultToWallet() {
    console.log(("Transferring from vault to wallet"));
  }

  return{
    transferWalletToVault,
    transferVaultToWallet
  }
}