// src/components/Pill.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "@/src/constants/Colors";
import { fonts } from "@/src/constants/Fonts";
import { images } from "@/src/constants/Images";

export type PillStatus = 'active' | 'pending' | 'inactive';

interface PillProps {
    status: PillStatus;
    showIcon?: boolean;
}

export default function Pill({ status, showIcon = true }: PillProps) {
    // Different styling and text based on status
    const getPillConfig = () => {
        switch(status) {
            case 'active':
                return {
                    backgroundColor: colors.cyan.color03,
                    borderColor: colors.cyan.color01,
                    text: 'Active',
                    icon: images.tick
                };
            case 'pending':
                return {
                    backgroundColor: colors.beige.color02,
                    borderColor: colors.beige.color01,
                    text: 'Pending',
                    icon: images.pending
                };
            case 'inactive':
                return {
                    backgroundColor: colors.red.color03,
                    borderColor: colors.red.color01,
                    text: 'Inactive',
                    icon: images.cross
                };
            default:
                return {
                    backgroundColor: colors.cyan.color03,
                    borderColor: colors.cyan.color01,
                    text: 'Active',
                    icon: images.guarded
                };
        }
    };

    const config = getPillConfig();

    return (
        <View style={[styles.pill, { 
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor
        }]}>
            {showIcon && (
                <View style={styles.pillIconContainer}>
                    <Image
                        source={config.icon}
                        style={styles.pillIcon}
                        resizeMode="contain"
                    />
                </View>
            )}
            <Text style={styles.pillText}>{config.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pillIconContainer: {
        marginRight: 6,
    },
    pillIcon: {
        width: 14,
        height: 14,
    },
    pillText: {
        fontFamily: fonts.secondary.medium,
        fontSize: 14,
        color: colors.black.primary,
    },
});
