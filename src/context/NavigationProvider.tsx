import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { NavigationState } from "@react-navigation/routers";
import * as Linking from "expo-linking";
import { FC, useCallback, useMemo } from "react";

import { DealersTabsScreenParamsList } from "../app/Dealers/DealersTabsScreen";
import { EventsTabsScreenParamsList } from "../app/Events/EventsTabsScreen";
import { ScreenAreasParamsList } from "../app/ScreenAreas";
import { ScreenStartParamsList } from "../app/ScreenStart";
import { conId } from "../configuration";
import { useAnalytics } from "../hooks/useAnalytics";
import { useNavigationStatePersistence } from "../hooks/useNavigationStatePersistence";
import { useAppSelector } from "../store";
import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors } from "../store/eurofurence.selectors";
import { RecordId } from "../store/eurofurence.types";

type LinkingConfig<ParamsList> = {
    initialRouteName?: keyof ParamsList;
    screens: Record<keyof ParamsList, string | LinkingConfig<any>>;
    path?: string;
    exact?: boolean;
    parse?: Record<string, (value: string) => any>;
    stringify?: Record<string, (value: any) => string>;
};

/**
 * Configure deep linking
 */
const linkingFrom = (days: RecordId[], tracks: RecordId[], rooms: RecordId[]): LinkingOptions<ScreenStartParamsList> => {
    // Dynamically create dynamic parts.
    const eventsLinking: LinkingConfig<EventsTabsScreenParamsList> = {
        initialRouteName: "Events",
        screens: {
            Favorites: "Areas/Events/Favorites",
            Results: "Areas/Events/Results",
            Search: "Areas/Events/Search",

            ...Object.fromEntries(days.map((id) => [id, `Areas/Events/Days/${id}`])),
            ...Object.fromEntries(tracks.map((id) => [id, `Areas/Events/Tracks/${id}`])),
            ...Object.fromEntries(rooms.map((id) => [id, `Areas/Events/Rooms/${id}`])),
        },
    };

    const dealersLinking: LinkingConfig<DealersTabsScreenParamsList> = {
        initialRouteName: "All",
        screens: {
            All: "Areas/Dealers",
            Thu: "Areas/Dealers/Thu",
            Fri: "Areas/Dealers/Fri",
            Sat: "Areas/Dealers/Sat",
        },
    };

    const areasLinking: LinkingConfig<ScreenAreasParamsList> = {
        initialRouteName: "Home",
        screens: {
            Home: "Areas/Home",
            Events: eventsLinking,
            Dealers: dealersLinking,
        },
    };

    // TODO: Use configuration constants here.
    // Return the composed linking object.
    return {
        prefixes: [Linking.createURL(`/`), Linking.createURL(`/${conId}/Web/`), `https://app.eurofurence.org`],
        config: {
            initialRouteName: "Areas",
            screens: {
                Areas: areasLinking,
                Event: "Events/:id",
                Dealer: "Dealers/:id",
                KnowledgeGroups: "Knowledge",
                KnowledgeEntry: "Knowledge/:id",
                Settings: "Settings",
                Map: "Map/:id",
                About: "About",
            },
        },
    };
};

export const NavigationProvider: FC = ({ children }) => {
    // Get navigation state from persistence.
    const [isReady, initialState, onStateChange] = useNavigationStatePersistence();
    const logEvent = useAnalytics();

    const logAnalytics = useCallback(
        (state: NavigationState | undefined) => {
            if (!state) return null;
            const route: { name: string; params?: object; key: string } = state.routes[state.index] as any;

            logEvent("screen_view", {
                screen_name: route.name,
                ...route.params,
            });
        },
        [logEvent]
    );

    const days = useAppSelector(eventDaysSelectors.selectIds);
    const tracks = useAppSelector(eventTracksSelectors.selectIds);
    const rooms = useAppSelector(eventRoomsSelectors.selectIds);

    const linking = useMemo(() => linkingFrom(days, tracks, rooms), [days, tracks, rooms]);

    if (!isReady) {
        return null;
    }
    return (
        <NavigationContainer
            linking={linking}
            initialState={initialState}
            onStateChange={(state) => {
                onStateChange(state);
                logAnalytics(state);
            }}
        >
            {children}
        </NavigationContainer>
    );
};
