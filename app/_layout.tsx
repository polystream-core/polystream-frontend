import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from 'react';
import { loadFonts } from '@/src/constants/Fonts';
import { PrivyElements, PrivyProvider, usePrivy } from '@privy-io/expo';
import SignInPage from './sign-in';
import { View } from 'react-native';
import { env } from '@/src/constants/AppConfig';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();


function AuthenticationGuard() {
  const { user, isReady } = usePrivy();
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
        router.push("/authenticated");
      }
    }
  }, [appIsReady, user, router]);

  if (!appIsReady) {
    return null; // Return null instead of Loading to keep splash screen visible
  }
  
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {user ? <Slot /> : <SignInPage />}
    </View>
  );
}

export default function RootLayout() {

  return (
    <PrivyProvider
      appId={env.PRIVY_APP_ID}
      clientId={env.PRIVY_CLIENT_ID}
      config={{
        embedded:{
          ethereum: {
            createOnLogin: 'all-users',
          },
        }
      }}
    >
      <PrivyElements />
      <AuthenticationGuard />
    </PrivyProvider>
  );
}
