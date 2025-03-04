import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from 'react';
import { loadFonts } from '../src/constants/Fonts';
import { PrivyElements, PrivyProvider, usePrivy } from '@privy-io/expo';
import SignInPage from './sign-in';
import Loading from '@/src/components/Loading';
import { View } from 'react-native';
import CustomSplashScreen from '@/src/components/SplashScreen';

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
      appId="REDACTED"
      clientId="REDACTED"
    >
      <PrivyElements />
      <AuthenticationGuard />
    </PrivyProvider>
  );
}
