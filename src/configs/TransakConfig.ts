import { env } from "@/src/constants/AppConfig";
import { Environments, TransakConfig } from "@transak/react-native-sdk";
import {colors} from "@/src/constants/Colors";

export const transakConfig = (configOverrides: Record<string, any> = {}): TransakConfig => ({
  apiKey: env.TRANSAK_API_KEY,
  environment: Environments.STAGING,
  partnerOrderId: "order-12345",
  walletAddress: "0x567bDc4086eFc460811798d1075a21359E34072d",
  fiatCurrency: "USD",
  defaultCryptoCurrency: "USDC",
  themeColor: colors.beige.primary,
  exchangeScreenTitle: "PolyStream - Top Up",
  email: "",
  ...configOverrides
});