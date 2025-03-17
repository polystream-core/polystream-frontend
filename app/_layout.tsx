import * as SplashScreen from "expo-splash-screen";
import { Slot, Stack } from "expo-router";
import { PrivyElements, PrivyProvider } from "@privy-io/expo";
import SignInPage from "./sign-in";
import { LogBox, View } from "react-native";
import { env } from "@/src/constants/AppConfig";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import Toast, { BaseToast } from "react-native-toast-message";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// to ignore all logs for presentation
LogBox.ignoreAllLogs(true)
LogBox.ignoreLogs([
  'Warning: Text strings must be rendered within a <Text> component',
]);

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.green.primary,
        backgroundColor: props.props?.backgroundColor || colors.green.primary,
        height: 60,
        width: '90%',
        marginTop: 10
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ 
        fontFamily: fonts.primary.semibold, 
        fontSize: 16, 
        color: colors.grey.white 
      }}
      text2Style={{ 
        fontFamily: fonts.secondary.regular, 
        fontSize: 14, 
        color: colors.grey.white 
      }}
    />
  ),
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.red.primary,
        backgroundColor: props.props?.backgroundColor || colors.red.primary,
        height: 60,
        width: '90%',
        marginTop: 10
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ 
        fontFamily: fonts.primary.semibold, 
        fontSize: 16, 
        color: colors.grey.white 
      }}
      text2Style={{ 
        fontFamily: fonts.secondary.regular, 
        fontSize: 14, 
        color: colors.grey.white 
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.beige.primary,
        backgroundColor: props.props?.backgroundColor || colors.beige.primary,
        height: 60,
        width: '90%',
        marginTop: 10
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ 
        fontFamily: fonts.primary.semibold, 
        fontSize: 16, 
        color: colors.grey.white 
      }}
      text2Style={{ 
        fontFamily: fonts.secondary.regular, 
        fontSize: 14, 
        color: colors.grey.white 
      }}
    />
  ),
};

function AuthenticationGuard() {
  const { user, appIsReady, onLayoutRootView } = useAuthGuard();

  if (!appIsReady) {
    return null; // Return null instead of Loading to keep splash screen visible
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {user ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <SignInPage />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <PrivyProvider
      appId={env.PRIVY_APP_ID}
      clientId={env.PRIVY_CLIENT_ID}
      config={{
        embedded: {
          ethereum: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      <PrivyElements />
      <AuthenticationGuard />
      <Toast config={toastConfig}/>
    </PrivyProvider>
  );
}
