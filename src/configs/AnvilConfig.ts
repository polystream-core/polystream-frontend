import { env } from "@/src/constants/AppConfig";

export const anvilConfig = {
    ANVIL_HOST_IP: env.ANVIL_HOST_IP,
    SCROLL_USDC_ADDRESS: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
    SCROLL_USDC_ABI: [
        "function balanceOf(address owner) view returns (uint256)"
    ],
}