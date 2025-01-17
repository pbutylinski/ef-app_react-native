import { TFunction } from "i18next";
import moment from "moment";

import {
    announcementsSelectors,
    dealersSelectors,
    eventsSelector,
    mapsSelectors,
    selectActiveAnnouncements,
    selectBrowseableMaps,
    selectCountdownTitle,
    selectCurrentEvents,
    selectDealersByDayName,
    selectFavoriteEvents,
    selectUpcomingEvents,
    selectUpcomingFavoriteEvents,
} from "./eurofurence.selectors";
import eurofurenceCache from "./eurofurence.testData.spec";
import { EventDetails } from "./eurofurence.types";
import { RootState } from "./index";

const state: RootState = {
    eurofurenceCache,
    background: {
        notifications: [
            {
                type: "EventReminder",
                recordId: "0f502e78-406a-4efd-901b-fb32d65ea217",
                dateCreated: "",
                dateScheduled: "",
            },
        ],
    },
} as any;

describe("Eurofurence details", () => {
    describe("event selectors", () => {
        it("only return string IDs", () => {
            const results = eventsSelector.selectIds(state);
            const nonString = results.filter((result) => typeof result !== "string");

            expect(nonString).toHaveLength(0);
        });

        it("to convert banners", () => {
            const results = eventsSelector.selectAll(state);
            const unconverted = results.filter((result) => result.BannerImageId && !result.Banner);

            expect(unconverted).toHaveLength(0);
        });

        it("to convert posters", () => {
            const results = eventsSelector.selectAll(state);
            const unconverted = results.filter((result) => result.PosterImageId && !result.Poster);

            expect(unconverted).toHaveLength(0);
        });

        it("to compute part of day", () => {
            const results = eventsSelector.selectAll(state);
            const unmapped = results.filter((result) => !["morning", "afternoon", "evening", "night"].includes(result.PartOfDay));

            expect(unmapped).toHaveLength(0);
        });

        it("sponsors are detected", () => {
            const results = eventsSelector.selectAll(state);
            const undetectedSuperSponsors = results.filter((result) => result.Tags?.includes("supersponsors_only") && !result.SuperSponsorOnly);
            const undetectedSponsors = results.filter((result) => result.Tags?.includes("sponsors_only") && !result.SponsorOnly);

            expect(undetectedSuperSponsors).toHaveLength(0);
            expect(undetectedSponsors).toHaveLength(0);
        });

        it("badge is detected", () => {
            const results = eventsSelector.selectAll(state);
            const undetected = results.filter((result) => result.Tags?.includes("mask_required") && !result.MaskRequired);

            expect(undetected).toHaveLength(0);
        });

        it("has all metadata", () => {
            const results = eventsSelector.selectAll(state);
            const unannotated = results.filter((result) => !result.ConferenceDay || !result.ConferenceRoom || !result.ConferenceTrack);
            expect(unannotated).toHaveLength(0);
        });

        it("to memoize", () => {
            const resultsA = eventsSelector.selectAll(state);
            const resultsB = eventsSelector.selectAll(state);

            expect(resultsA).toStrictEqual(resultsB);
        });
    });

    describe("dealer selectors", () => {
        it("to convert artist image", () => {
            const results = dealersSelectors.selectAll(state);
            const unconverted = results.filter((result) => result.ArtistImageId && !result.Artist);

            expect(unconverted).toHaveLength(0);
        });

        it("to convert thumbnail image", () => {
            const results = dealersSelectors.selectAll(state);
            const unconverted = results.filter((result) => result.ArtistThumbnailImageId && !result.ArtistThumbnail);

            expect(unconverted).toHaveLength(0);
        });

        it("to convert preview image", () => {
            const results = dealersSelectors.selectAll(state);
            const unconverted = results.filter((result) => result.ArtPreviewImageId && !result.ArtPreview);

            expect(unconverted).toHaveLength(0);
        });

        it("aggregates days", () => {
            const results = dealersSelectors.selectAll(state);
            const unaggregated = results.filter(
                (result) =>
                    (result.AttendsOnThursday && !result.AttendanceDayNames.includes("thu")) ||
                    (result.AttendsOnFriday && !result.AttendanceDayNames.includes("fri")) ||
                    (result.AttendsOnSaturday && !result.AttendanceDayNames.includes("sat"))
            );

            expect(unaggregated).toHaveLength(0);
        });
    });

    describe("maps selectors", () => {
        it("has image with hashes", () => {
            const results = mapsSelectors.selectAll(state);
            const withoutHash = results.filter((result) => !result.Image?.FullUrl.includes("with-hash:"));

            expect(withoutHash).toHaveLength(0);
        });
    });

    describe("special selectors", () => {
        it("countdown title is appropriate", async () => {
            const t: TFunction = ((key: string) => {
                if (key === "before_event") return `before`;
                if (key === "after_event") return `after`;
            }) as any;

            const before = selectCountdownTitle(state, moment("2022-08-20"), t);
            const on = selectCountdownTitle(state, moment("2022-08-25"), t);
            const after = selectCountdownTitle(state, moment("2022-09-05"), t);

            expect(before).toBe("before");
            expect(on).toBe("Con Day 2");
            expect(after).toBe("after");
        });

        it("finds favorites", () => {
            const id = state.background.notifications.find((n) => n.type === "EventReminder")?.recordId ?? "";
            const event = eventsSelector.selectById(state, id) as EventDetails;

            const fav = selectFavoriteEvents(state);

            expect(fav).toContainEqual(event);
        });

        it("finds upcoming favorites", () => {
            const id = state.background.notifications.find((n) => n.type === "EventReminder")?.recordId ?? "";
            const event = eventsSelector.selectById(state, id) as EventDetails;

            const upcoming = selectUpcomingFavoriteEvents(state, moment(event.StartDateTimeUtc).subtract(1, "day"));
            const expired = selectUpcomingFavoriteEvents(state, moment(event.StartDateTimeUtc).add(1, "day"));

            expect(upcoming).toContainEqual(event);
            expect(expired).not.toContainEqual(event);
        });

        it("finds current", () => {
            const event = eventsSelector.selectAll(state)[0];

            const current = selectCurrentEvents(state, moment(event.StartDateTimeUtc).add(1, "minute"));

            expect(current).toContainEqual(event);
        });

        it("finds upcoming", () => {
            const event = eventsSelector.selectAll(state)[0];

            const upcoming = selectUpcomingEvents(state, moment(event.StartDateTimeUtc).subtract(20, "minutes"));

            expect(upcoming).toContainEqual(event);
        });

        it("finds active announcements", () => {
            const announcement = announcementsSelectors.selectAll(state)[0];

            const active = selectActiveAnnouncements(state, moment(announcement.ValidFromDateTimeUtc).add(1, "minute"));

            expect(active).toContainEqual(announcement);
        });

        it("finds dealers by proper day", () => {
            const notOnThursday = selectDealersByDayName(state, "thu").filter((dealer) => !dealer.AttendsOnThursday);
            const notOnFriday = selectDealersByDayName(state, "fri").filter((dealer) => !dealer.AttendsOnFriday);
            const notOnSaturday = selectDealersByDayName(state, "sat").filter((dealer) => !dealer.AttendsOnSaturday);

            expect(notOnThursday).toHaveLength(0);
            expect(notOnFriday).toHaveLength(0);
            expect(notOnSaturday).toHaveLength(0);
        });

        it("finds browsable maps", () => {
            const notBrowsable = selectBrowseableMaps(state).filter((map) => !map.IsBrowseable);

            expect(notBrowsable).toHaveLength(0);
        });
    });
});
