export default {
    expo: {
        name: "polystream-frontend",
        slug: "polystream-frontend",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./src/assets/images/default/icon.png",
        scheme: "polystream",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: "io.polystream.polystream"
        },
        android: {
            adaptiveIcon: {
                backgroundColor: "#ffffff"
            }
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./src/assets/images/eth_crystal.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    "image": "./src/assets/images/eth_crystal.png",
                    "imageWidth": 300,
                    "resizeMode": "contain",
                    "backgroundColor": "#FFEEDA"
                }
            ],
            "expo-font",
            "expo-secure-store"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            PRIVY_APP_ID: process.env.PRIVY_APP_ID,
            PRIVY_CLIENT_ID: process.env.PRIVY_CLIENT_ID,
            TRANSAK_API_KEY: process.env.TRANSAK_API_KEY,
            ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
            ANVIL_HOST_IP: process.env.ANVIL_HOST_IP,
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            PAYMASTER_URL: process.env.PAYMASTER_URL,
            BUNDLER_URL: process.env.BUNDLER_URL,
        }
    }
};
