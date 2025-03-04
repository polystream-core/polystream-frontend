import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, Stack, useRouter } from "expo-router";
import { useEffect } from 'react';
import { loadFonts } from '../src/constants/Fonts';
import { PrivyElements, PrivyProvider, usePrivy } from '@privy-io/expo';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(loadFonts);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  // This component renders after PrivyProvider is initialized
function AuthenticationGuard() {
  const { user } = usePrivy();
  const router = useRouter();

  // Handle authentication redirection
  useEffect(() => {
    if (user) {
      router.replace("/authenticated");
    }
  }, [user, router]);

  return <Slot />;
}

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
