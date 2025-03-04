import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { fonts } from "../src/constants/Fonts";
import { colors } from "../src/constants/Colors";
import CustomButton from "@/src/components/buttons/CustomButton";
import Circle from "@/src/components/Circle";
import { useLogin, useLoginWithEmail } from "@privy-io/expo";
import { router } from "expo-router";
// import { PRIVY_APP_ID } from "@env";

export default function SignInPage() {
    const email: string = "yangdingcheok@gmail.com";
    const {login} = useLogin();
    
    async function signInAction() {
        console.log("Sign in pressed");
        login({ loginMethods: ['email']})
            .then((session) => {
                console.log("User logged in: ", session);
            })
            .then(
                () => router.setParams({screen: "/authenticated"})
            )
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../src/assets/images/scroll-media-2.png")} resizeMode="contain" />
            <Text style={styles.title}>Welcome to Polystream</Text>
            <Text style={styles.subtitle}>
                Optimize Your Crypto Earnings with Smart Yield Strategies. Zero Knowledge Required.
            </Text>
            <Pressable onPress={signInAction}>
                <CustomButton title="Sign in" />
            </Pressable>
            <View style={styles.horiContainer}>
                <Circle size={10} color={colors.cyan.color02} style={{ margin: 4 }} />
                <Text style={styles.footnote}>
                    <Text>Protected by </Text>
                </Text>
                <View style={styles.logoBg}>
                    <Image source={require("../src/assets/images/privy-logo-white.png")} style={styles.imageLogo} resizeMode="contain" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.beige.primary,
    },
    horiContainer: {
        flexDirection: "row",
        marginTop: "2%",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "40%",
    },
    title: {
        marginBottom: "5%",
        paddingHorizontal: "20%",
        fontFamily: fonts.primary.bold,
        color: colors.black.primary,
        fontSize: 36
    },
    subtitle: {
        paddingHorizontal: "10%",
        marginBottom: "10%",
        fontFamily: fonts.secondary.light,
        color: colors.black.primary,
        fontSize: 18,
        textAlign: "center",
    },
    footnote: {
        color: colors.red.primary,
        fontFamily: fonts.secondary.medium,
        fontSize: 14,
    },
    imageLogo: {
        height: 14,
        width: 50,
    },
    logoBg: {
        backgroundColor: colors.red.primary,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
    }
});
