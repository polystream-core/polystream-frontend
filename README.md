###  Fork Scroll Mainnet Locally using Anvil

Run:
```bash
anvil --fork-url https://scroll-mainnet.g.alchemy.com/v2/VAQcT5_FZnSb1JcH7-3TGfRmzVpTW1Yl --chain-id 6666 --host 0.0.0.0
```

To transfer fake USDC from Anvil's prefunded account into Privy embedded wallet, need to run foundry script `DealUsdcScript.sol`.

Run:
```bash
forge script script/DealUsdcScript.sol:SetUSDCBalanceScript --fork-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

