import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../constants/Colors";
import { images } from "../constants/Images";
import { fonts } from "../constants/Fonts";

// Define types for our action items
type ActionItem = {
    icon: any; // Using 'any' for image source type
    label: string;
    onPress: () => void;
};

type ActionBarProps = {
    actions?: ActionItem[];
};

export default function ActionBar({ actions = [
    { icon: images.add, label: "Add", onPress: () => console.log("Add pressed") },
    { icon: images.send, label: "Send", onPress: () => console.log("Send pressed") },
] }: ActionBarProps) {
    const styles = StyleSheet.create({
        actionContainer: {
            backgroundColor: colors.beige.color03,
            width: "90%",
            alignSelf: "center",
            borderRadius: 10,
            paddingVertical: 20,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.2,
            flexDirection: "row",
            alignContent: "space-around",
        },
        childAction: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        actionIcon: {
            width: 30,
            height: 30,
            marginBottom: 6
        },
        actionText: {
            textAlign: "center",
            fontSize: 14,
            padding: 1,
            fontFamily: fonts.primary.regular
        }
    });

    return (
        <View style={styles.actionContainer}>
            {actions.map((action, index) => (
                <Pressable key={`action-${index}`} onPress={action.onPress} style={styles.childAction}>
                    <Image
                        source={action.icon}
                        style={styles.actionIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.actionText}>{action.label}</Text>
                </Pressable>
            ))}
        </View>
    );
}
