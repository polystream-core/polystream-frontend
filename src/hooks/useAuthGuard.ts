import { useEffect, useState, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { usePrivy } from '@privy-io/expo';
import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { loadFonts } from '@/src/constants/Fonts';

export function useAuthGuard() {
  const {user, isReady} = usePrivy();
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts(loadFonts);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load and Privy to be ready
        if (fontsLoaded && isReady) {
          // Delay slightly to ensure everything is properly initialized
          await new Promise(resolve => setTimeout(resolve, 500));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded, isReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();

      // Navigate if user is authenticated
      if (user) {
        // TypeScript will now know user.linked_accounts is an array of LinkedAccount
        if (user.linked_accounts.length > 0) {
          // Loop through linked accounts and find the embedded wallet
          console.log(user.linked_accounts.find(
            (account) =>
              account.type === "wallet" &&
              account.wallet_client_type === "privy" &&
              account.connector_type === "embedded"
          ));
        }
        else {
          console.log("No matching embedded wallet found.");
        }

        router.push("/(tabs)");
      }
    }
  }, [appIsReady, user, router]);

  return {
    user,
    appIsReady,
    onLayoutRootView
  }
}