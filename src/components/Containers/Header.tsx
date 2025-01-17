import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/core";
import React, { FC, useMemo } from "react";
import { StyleSheet, View, ViewProps, TouchableOpacity } from "react-native";

import { useTheme } from "../../context/Theme";
import { Activity } from "../Atoms/Activity";
import { Label } from "../Atoms/Label";
import { Row } from "./Row";

const iconSize = 32;

export type HeaderProps = ViewProps;

export const Header: FC<HeaderProps> = ({ style, children }) => {
    const theme = useTheme();

    const containerStyle = useMemo(() => ({ backgroundColor: theme.background, borderColor: theme.darken }), [theme]);

    const navigation = useNavigation();

    return (
        <Row style={[styles.container, containerStyle, style]} type="center" variant="spaced">
            <Icon name="chevron-left" size={iconSize} />

            <Label style={styles.text} type="lead" ellipsizeMode="tail" numberOfLines={1}>
                {children}
            </Label>

            <View style={styles.placeholder} />

            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} />

            <Activity style={styles.activity} />
        </Row>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    text: {
        flex: 1,
    },
    placeholder: {
        width: iconSize,
        height: iconSize,
    },
    back: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "30%",
    },
    activity: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
    },
});
