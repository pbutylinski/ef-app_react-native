import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useIsEventDone } from "../../hooks/useEventProperties";
import { useAppSelector } from "../../store";
import { eventTracksSelectors, selectEventsByTrack } from "../../store/eurofurence.selectors";
import { IconNames } from "../../types/IconNames";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";
import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";
import { EventsTabsScreenParamsList } from "./EventsTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type EventsListByTrackScreenParams = object;

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsListByTrackScreenProps =
    // Route carrying from events tabs screen at "Track", own navigation via own parameter list.
    CompositeScreenProps<
        PagesScreenProps<EventsTabsScreenParamsList, string>,
        PagesScreenProps<EventsTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const EventsListByTrackScreen: FC<EventsListByTrackScreenProps> = ({ route }) => {
    const { t } = useTranslation("Events");
    const isEventDone = useIsEventDone();

    // Get the track. Use it to resolve events to display.
    const track = useAppSelector((state) => eventTracksSelectors.selectById(state, route.name));
    const eventsByTrack = useAppSelector((state) => selectEventsByTrack(state, track?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const done = chain(eventsByTrack)
            .filter((event) => isEventDone(event))
            .orderBy(["StartDateTimeUtc", (event) => isEventDone(event)])
            .value();

        return chain(eventsByTrack)
            .filter((event) => !isEventDone(event))
            .orderBy("StartDateTimeUtc")
            .groupBy((event) => event.ConferenceDay?.Date)
            .entries()
            .map(([date, events]) => ({
                title: moment(date).format("dddd"),
                subtitle: t("events_count", { count: events.length }),
                icon: "calendar-outline" as IconNames,
                data: events,
            }))
            .thru((chain) =>
                done.length === 0
                    ? chain
                    : chain.concat({
                          title: t("events_done"),
                          subtitle: t("events_count", { count: done.length }),
                          icon: "calendar-clock-outline" as IconNames,
                          data: done,
                      })
            )
            .value();
    }, [t, eventsByTrack, isEventDone]);

    return (
        <EventsSectionedListGeneric
            eventsGroups={eventsGroups}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {track?.Name ?? ""}
                </Label>
            }
            cardType="time"
        />
    );
};
