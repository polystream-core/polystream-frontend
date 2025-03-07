import * as SplashScreen from 'expo-splash-screen';
import { Redirect, Stack } from "expo-router";
import { usePrivy } from '@privy-io/expo';

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
          >
            <Stack.Screen
            name='polystream-vault' />
          </Stack>
    );
}
