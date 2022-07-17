import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import * as React from "react";
import { FC, ReactNode, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle, TouchableOpacity } from "react-native";

import { useTheme } from "../../context/Theme";
import { IconNames } from "../../types/IconNames";
import { Label } from "../Atoms/Label";

const iconSize = 20;
const pad = 8;
const border = 2;

/**
 * Arguments to the button.
 */
export type ButtonProps = {
    /**
     * The style for the view arranging the button's layout.
     */
    containerStyle?: StyleProp<ViewStyle>;

    /**
     * The style for the view arranging the button's content.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * True if outline button instead of filled button.
     */
    outline?: boolean;

    /**
     * If given, displayed as the button's icon.
     */
    icon?: IconNames;

    /**
     * If given, displayed as the button's icon, this is displayed on the right side.
     */
    iconRight?: IconNames;

    /**
     * The text of the button.
     */
    children?: ReactNode;

    /**
     * If given, invoked on button press.
     */
    onPress?: () => void;

    onLongPress?: () => void;
};

export const Button: FC<ButtonProps> = ({ containerStyle, style, outline, icon, iconRight, children, onPress, onLongPress }) => {
    // Computed styles.
    const theme = useTheme();
    const base = useMemo(() => (outline ? styles.outlineContent : styles.fillContent), [outline]);
    const fill = useMemo(() => ({ backgroundColor: outline ? theme.background : theme.inverted }), [outline, theme]);

    return (
        <TouchableOpacity style={[containerStyle, styles.content, base, fill, style]} onPress={onPress} onLongPress={onLongPress}>
            {!icon ? <View style={styles.placeholder} /> : <Icon name={icon} size={iconSize} color={outline ? theme.important : theme.invImportant} />}

            <Label style={styles.text} color={outline ? "important" : "invImportant"}>
                {children}
            </Label>

            {!iconRight ? <View style={styles.placeholder} /> : <Icon name={iconRight} size={iconSize} color={outline ? theme.important : theme.invImportant} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    content: {
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    fillContent: {
        padding: pad,
        backgroundColor: "black",
    },
    outlineContent: {
        padding: pad - border,
        borderColor: "black",
        borderWidth: border,
    },
    placeholder: {
        width: iconSize,
        height: iconSize,
    },
    text: {
        textAlign: "center",
        textAlignVertical: "center",
    },
    outlineText: {
        textAlign: "center",
        textAlignVertical: "center",
    },
});
