import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { View, Text, StyleSheet } from "react-native";

interface CustomButtonProps {
    title: string;
}

export default function CustomButton({ title } : CustomButtonProps) {
    return (
        <View style={styles.button}>
            <Text style={styles.text}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.grey.white,
        paddingHorizontal: 80,
        paddingVertical: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.black.primary
    },
    text: {
        color: colors.black.primary,
        textAlign: "center",
        fontFamily: fonts.secondary.bold,
        fontSize: 20
    }
})
