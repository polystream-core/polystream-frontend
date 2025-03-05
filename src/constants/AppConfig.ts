import Constants from 'expo-constants';

export const env = {
    PRIVY_APP_ID: Constants.expoConfig?.extra?.PRIVY_APP_ID,
    PRIVY_CLIENT_ID: Constants.expoConfig?.extra?.PRIVY_CLIENT_ID,
    PRIVY_CHAIN_ID: Constants.expoConfig?.extra?.PRIVY_CHAIN_ID,
}

export const appConfig = {
    DOMAIN: 'polystream.xyz',
    BASE_URI: 'https://www.polystream.xyz'
}
