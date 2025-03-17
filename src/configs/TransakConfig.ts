import { env } from "@/src/constants/AppConfig";
import { Environments, TransakConfig } from "@transak/react-native-sdk";
import { colors } from "@/src/constants/Colors";
import { uuidv7 } from "uuidv7";

export function createTransakConfig(walletAddress : string, configOverrides: Record<string, any> = {}): TransakConfig {
  return {
    apiKey: env.TRANSAK_API_KEY,
    environment: Environments.STAGING,
    partnerOrderId: uuidv7(), // Generate unique order ID using uuidv7
    walletAddress: walletAddress,
    fiatCurrency: "USD",
    defaultCryptoCurrency: "USDC",
    defaultFiatAmount: 3000,
    themeColor: colors.beige.color01,
    exchangeScreenTitle: "PolyStream - Top Up",
    defaultNetwork: "base",
    disableWalletAddressForm: true,
    email: "",
    ...configOverrides
  };
}