import Constants from 'expo-constants';

export const env = {
    PRIVY_APP_ID: Constants.expoConfig?.extra?.PRIVY_APP_ID,
    PRIVY_CLIENT_ID: Constants.expoConfig?.extra?.PRIVY_CLIENT_ID,
    PRIVY_CHAIN_ID: Constants.expoConfig?.extra?.PRIVY_CHAIN_ID,
    TRANSAK_API_KEY: Constants.expoConfig?.extra?.TRANSAK_API_KEY,
    ETHERSCAN_API_KEY: Constants.expoConfig?.extra?.ETHERSCAN_API_KEY,
    ANVIL_HOST_IP: Constants.expoConfig?.extra?.ANVIL_HOST_IP,
    OPENAI_API_KEY: Constants.expoConfig?.extra?.OPENAI_API_KEY,
}

export const appConfig = {
    DOMAIN: 'polystream.xyz',
    BASE_URI: 'https://www.polystream.xyz',
    ETHERSCAN_BASE_URI: 'https://api.etherscan.io/v2/api',
    SCROLL_CHAIN_ID: '534351'
}
