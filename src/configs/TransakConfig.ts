import { env } from "@/src/constants/AppConfig";
import { Environments, TransakConfig } from "@transak/react-native-sdk";
import {colors} from "@/src/constants/Colors";

export const transakConfig = (configOverrides: Record<string, any> = {}): TransakConfig => ({
  apiKey: env.TRANSAK_API_KEY,
  environment: Environments.STAGING,
  partnerOrderId: "order-12345",
  walletAddress: "0x1375a0818014C96D1C0B723946c4835BFe4a32F5",
  fiatCurrency: "USD",
  defaultCryptoCurrency: "USDC",
  themeColor: colors.beige.primary,
  exchangeScreenTitle: "PolyStream - Top Up",
  email: "",
  ...configOverrides
});