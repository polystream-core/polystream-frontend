### `.env`

Make sure you have `.env. file in the root directory. For `ANVIL_HOST_IP`, run `ipconfig` on your laptop to check your IP address and replace accordingly.

###  Fork Scroll Mainnet Locally using Anvil

Run:
```bash
anvil --fork-url https://scroll-mainnet.g.alchemy.com/v2/VAQcT5_FZnSb1JcH7-3TGfRmzVpTW1Yl --chain-id 6666 --host 0.0.0.0
```

### Deploy smart contracts on Anvil

#### 1. ProtocolRegistry.sol

```bash
forge create --rpc-url http://localhost:8545   --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast  src/core/ProtocolRegistry.sol:ProtocolRegistry
```

Place the deployed contract address and ABI to `ProtocolRegistry.sol.ts`.

#### 2. AaveAdapter.sol

```bash
forge create --rpc-url http://localhost:8545   --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  --broadcast src/adapters/AaveAdapter.sol:AaveAdapter --constructor-args 0x11fCfe756c05AD438e312a7fd934381537D3cFfe
```

Place the deployed contract address and ABI to `AaveAdapter.sol.ts`.

#### 3. CombinedVault.sol

```bash
forge create --rpc-url http://localhost:8545   --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  --broadcast src/vault/CombinedVault.sol:CombinedVault --constructor-args <protocol_registry_ca> 0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4 "Yield Vault USDC" "yvUSDC"
```

Place the deployed contract address and ABI to `CombinedVault.sol.ts`.


#### 4. RewardManager.sol

```bash
forge create --rpc-url http://localhost:8545   --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  --broadcast src/rewards/RewardManager.sol:RewardManager --constructor-args 0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4 <combined_vault_ca>
```

Place the deployed contract address and ABI to `RewardManager.sol.ts`.

### Transfer USDC to Privy Embedded Wallet

To transfer fake USDC from Anvil's prefunded account into Privy embedded wallet, need to run foundry script `DealUsdcScript.sol`.

Run:
```bash
forge script script/DealUsdcScript.sol:SetUSDCBalanceScript --fork-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

