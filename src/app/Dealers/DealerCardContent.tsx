import React, { useMemo, FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { useTheme } from "../../context/Theme";
import { appStyles } from "../AppStyles";

export type DealerCardContentProps = {
    avatar?: ImageSourcePropType;
    name: string;
    present: boolean;
    merchandise?: string;
    offDays?: string;
    onPress?: () => void;
    onLongPress?: () => void;
};

export const DealerCardContent: FC<DealerCardContentProps> = memo(({ avatar, name, present, merchandise, offDays, onPress, onLongPress }) => {
    const { t } = useTranslation("Dealers");
    const theme = useTheme();
    const backgroundStyle = useMemo<ViewStyle>(() => ({ backgroundColor: theme.background }), [theme]);
    const stylePre = useMemo<ViewStyle>(() => ({ backgroundColor: present ? theme.primary : theme.darken }), [present, theme]);

    return (
        <TouchableOpacity style={[styles.container, appStyles.shadow, backgroundStyle]} onPress={onPress} onLongPress={onLongPress}>
            {!avatar ? null : (
                <View style={[styles.pre, stylePre]}>
                    <Image style={styles.avatarCircle} source={avatar} resizeMode="contain" />
                </View>
            )}

            <View style={styles.main}>
                <Label type="h3">{name}</Label>

                {!merchandise ? null : (
                    <Label type="h4" variant="narrow" ellipsizeMode="tail" numberOfLines={2}>
                        {merchandise}
                    </Label>
                )}

                {!offDays ? null : (
                    <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
                        {t("not_attending_on", { offDays })}
                    </Label>
                )}
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        minHeight: 80,
        marginVertical: 15,
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
    },
    background: {
        position: "absolute",
        width: undefined,
        height: undefined,
    },
    pre: {
        overflow: "hidden",
        width: 80,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarCircle: {
        position: "absolute",
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    image: {
        position: "absolute",
        width: undefined,
        height: undefined,
        left: -10,
        top: -10,
        right: -10,
        bottom: -10,
    },
    imageOverlay: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    main: {
        flex: 1,
        padding: 16,
    },
    tag: {
        textAlign: "right",
    },
});
