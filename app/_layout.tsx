import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from "expo-router";
import { useEffect } from 'react';
import { loadFonts } from '../src/constants/Fonts';

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

  return <Stack
    screenOptions={{
      headerShown: false
    }}>
    <Stack.Screen name="sign-in
    "/>
  </Stack>;
}
