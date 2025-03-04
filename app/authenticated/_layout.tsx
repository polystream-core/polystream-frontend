import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Redirect, Stack } from "expo-router";
import { useEffect } from 'react';
import { PrivyElements, PrivyProvider, usePrivy } from '@privy-io/expo';
import Loading from '@/src/components/Loading';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const {user} = usePrivy();

    if (!user) {
        return <Redirect href={"/sign-in"} />;
    }

    return (
            <Stack
          screenOptions={{
            headerShown: false
          }}
          ></Stack>
    );
}
