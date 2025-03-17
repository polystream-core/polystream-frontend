import { env } from "@/src/constants/AppConfig";

export const anvilConfig = {
    ANVIL_HOST_IP: env.ANVIL_HOST_IP,
    SCROLL_USDC_ADDRESS: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
    SCROLL_USDC_ABI: [
        "function balanceOf(address owner) view returns (uint256)"
    ],
    ANVIL_PRE_FUNDED_WALLET_ADDRESS: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    ANVIL_PRE_FUNDED_WALLET_PRIVATE_KEY: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
}