import { formatNumberWithCommas } from "@/src/utils/numberToText";
import { View, Text, StyleSheet, Pressable, Image, ImageProps } from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { images } from "@/src/constants/Images";
import Pill from "../Pill";

type PillStatus = 'active' | 'pending' | 'inactive';

interface VaultButtonProps {
    vaultName: string;
    balance: number;
    currency: string;
    notes: string;
    status: PillStatus;
    imageSrc: ImageProps;
    onPress: () => void;
}

export default function VaultButton(
    { vaultName = 'Wallet', 
        balance = 90000, 
        currency = 'USD', 
        notes = '+5.2% APY',
        status = 'active',
        imageSrc = images.add,
    onPress }: VaultButtonProps
) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [
            styles.container,
            pressed && styles.pressed
        ]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.vaultName}>{vaultName}</Text>
                </View>
                <View style={styles.balanceContainer}>
                    <View style={styles.balanceRow}>
                        <Text style={styles.balance}>{formatNumberWithCommas(balance)}</Text>
                        <Text style={styles.currency}>{currency}</Text>
                    </View>
                    <View style={styles.decorator} />
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSrc}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.footer}>
                    <Pill status={status} />
                    <Text style={styles.notes}>{notes}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.beige.color03,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: colors.black.primary,
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 20,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
        width: '85%',
    },
    pressed: {
        backgroundColor: colors.beige.color02,
        opacity: 0.95,
        transform: [{ scale: 0.98 }]
    },
    content: {
        width: '100%',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    vaultName: {
        fontFamily: fonts.primary.semibold,
        fontSize: 22,
        color: colors.black.primary,
    },
    balanceContainer: {
        marginVertical: 10,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    balance: {
        fontFamily: fonts.primary.bold,
        fontSize: 36,
        color: colors.black.primary,
        marginRight: 6,
    },
    currency: {
        fontFamily: fonts.primary.medium,
        fontSize: 18,
        color: colors.black.color02,
    },
    decorator: {
        marginTop: 14,
        height: 3,
        width: '40%',
        backgroundColor: colors.cyan.color02,
        borderRadius: 6,
    },
    imageContainer: {
        position: 'absolute',
        right: 0,
        top: 30,
        opacity: 0.7,
        zIndex: -1,
    },
    image: {
        width: 120,
        height: 120,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    notes: {
        fontFamily: fonts.secondary.bold,
        fontSize: 16,
        color: colors.red.primary,
    }
});
