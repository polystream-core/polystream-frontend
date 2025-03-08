import * as SplashScreen from 'expo-splash-screen';
import { Slot, Stack } from "expo-router";
import { PrivyElements, PrivyProvider } from '@privy-io/expo';
import SignInPage from './sign-in';
import { View } from 'react-native';
import { env } from '@/src/constants/AppConfig';
import { useAuthGuard } from '@/src/hooks/useAuthGuard';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AuthenticationGuard() {
  const { user, appIsReady, onLayoutRootView } = useAuthGuard();

  if (!appIsReady) {
    return null; // Return null instead of Loading to keep splash screen visible
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {user ?
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        : <SignInPage />}
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