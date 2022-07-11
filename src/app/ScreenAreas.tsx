import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, RefObject, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabsRef } from "../components/Containers/Tabs";
import { createTabNavigator } from "../components/Navigators/TabsNavigator";
import { ScreenEmpty, ScreenEmptyParams } from "./Common/ScreenEmpty";
import { ScreenEventsTabsParams, ScreenEventsTabs } from "./Events/ScreenEventsTabs";
import { ScreenHome, ScreenHomeParams } from "./Home/ScreenHome";
import { MainMenu } from "./MainMenu/MainMenu";
import { ScreenStartNavigatorParamsList } from "./ScreenStart";

/**
 * Available routes.
 */
export type ScreenAreasNavigatorParamsList = {
    /**
     * Area home screen, should show announcements and personalized content.
     */
    Home: ScreenHomeParams;

    /**
     * Events list.
     */
    Events: ScreenEventsTabsParams;

    /**
     * Dealers list.
     */
    Dealers: ScreenEmptyParams;

    /**
     * Settings Screen.
     */
    Settings: ScreenEmptyParams;
};

/**
 * Create an instance of the tabs-navigator with the provided routes.
 */
export const AreasNavigator = createTabNavigator<ScreenAreasNavigatorParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the areas.
 */
export type ScreenAreasParams = NavigatorScreenParams<ScreenAreasNavigatorParamsList>;

/**
 * The properties to the screen as a component. Delegated parameters for the areas. TODO: Verify.
 */
export type ScreenAreasProps = StackScreenProps<ScreenStartNavigatorParamsList>;

export const ScreenAreas: FC<ScreenAreasProps> = () => {
    // Compute safe inset at the bottom and convert to style.
    const bottom = useSafeAreaInsets()?.bottom;
    const tabsStyle = useMemo(() => ({ paddingBottom: Math.max(bottom, 30) }), [bottom]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <AreasNavigator.Navigator tabsStyle={tabsStyle} more={(tabs: RefObject<TabsRef>) => <MainMenu tabs={tabs} />}>
                <AreasNavigator.Screen name="Home" options={{ icon: "home" }} component={ScreenHome} />
                <AreasNavigator.Screen name="Events" options={{ icon: "calendar" }} component={ScreenEventsTabs} />
                <AreasNavigator.Screen name="Dealers" options={{ icon: "cart-outline" }} component={ScreenEmpty} />
            </AreasNavigator.Navigator>
        </View>
    );
};