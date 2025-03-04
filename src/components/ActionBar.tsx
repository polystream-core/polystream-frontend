import { View, Image, Text, StyleSheet } from "react-native";
import { colors } from "../constants/Colors";
import { images } from "../constants/Images";
import { fonts } from "../constants/Fonts";

// Define types for our action items
type ActionItem = {
    icon: any; // Using 'any' for image source type
    label: string;
};

type ActionBarProps = {
    actions?: ActionItem[];
};

export default function ActionBar({ actions = [
    { icon: images.add, label: "Add" },
    { icon: images.send, label: "Send" }
] }: ActionBarProps) {
    const styles = StyleSheet.create({
        actionContainer: {
            backgroundColor: colors.beige.color03,
            width: "90%",
            alignSelf: "center",
            borderRadius: 10,
            paddingVertical: 20,
            marginTop: "-15%",
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
            width: 36,
            height: 36,
            marginBottom: 6
        },
        actionText: {
            textAlign: "center",
            fontSize: 14,
            fontFamily: fonts.primary.light
        }
    });

    return (
        <View style={styles.actionContainer}>
            {actions.map((action, index) => (
                <View key={`action-${index}`} style={styles.childAction}>
                    <Image
                        source={action.icon}
                        style={styles.actionIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.actionText}>{action.label}</Text>
                </View>
            ))}
        </View>
    );
}
