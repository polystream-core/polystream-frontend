import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity } from "react-native";
import { fonts } from "@/src/constants/Fonts";
import { colors } from "@/src/constants/Colors";
import CustomButton from "@/src/components/buttons/CustomButton";
import Circle from "@/src/components/Circle";
import { useLogin } from "@privy-io/expo";
import { router } from "expo-router";
import { useState } from "react";
import Loading from "@/src/components/Loading";
import { useUserInfo } from "@/src/hooks/useUserInfo";

export default function SignInPage() {
    const { login } = useLogin();
    const { setEmail } = useUserInfo();
    const [loading, setLoading] = useState(false);

    async function signInAction() {
        console.log("Sign in pressed");
        setLoading(true);
        try{
            login({ loginMethods: ['email'] })
                .then((session) => {
                    console.log("Session: ", session);
                    if (session) {
                        console.log("User logged in: ", session);
                        setLoading(false);
                        router.push('/(tabs)')
                    } else {
                        setLoading(false);
                    }
                })
        } catch (e) {
            console.log("Login error: ", e);
        } finally {
            setLoading(false);
        }
        
    }

    if (loading) {
        return <Loading message="Signing in" />;
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../src/assets/images/scroll-media-2.png")} resizeMode="contain" />
            <Text style={styles.title}>Welcome to Polystream</Text>
            <Text style={styles.subtitle}>
                Optimize Your Crypto Earnings with Smart Yield Strategies. Zero Knowledge Required.
            </Text>
            <TouchableOpacity onPress={signInAction}>
                <CustomButton title="Sign in" />
            </TouchableOpacity>
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
