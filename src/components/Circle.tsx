import { StyleSheet, View } from "react-native";
import { colors } from "../constants/Colors";

export default function Circle({size, color, style} : {size: number, color: string, style?: any}) {
    return (
        <View style={{
            ...style,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            borderColor: colors.black.primary,
            borderWidth: size / 13,
        }}></View>
    )
}
