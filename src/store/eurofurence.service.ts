import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { AnnouncementRecord, EventRecord } from "./eurofurence.types";

export const eurofurenceService = createApi({
    reducerPath: "eurofurenceService",
    baseQuery: fetchBaseQuery({ baseUrl: "https://app.eurofurence.org/EF26" }),
    tagTypes: ["Announcement", "Event"],
    endpoints: (builder) => ({
        getAnnouncements: builder.query<AnnouncementRecord[], void>({
            query: () => ({ url: "/Api/Announcements" }),
            providesTags: ["Announcement"],
        }),
        getEvents: builder.query<EventRecord[], void>({
            query: () => ({ url: "/Api/Events" }),
            providesTags: (result) => (result ? [...result.map((it) => ({ type: "Event" as const, id: it.Id }))] : ["Event"]),
        }),
        getEventById: builder.query<EventRecord, string>({
            query: (args) => ({ url: `/Api/Events/${args}` }),
            providesTags: (result) => (result ? [{ type: "Event" as const, id: result.Id }] : ["Event"]),
        }),
    }),
});

export const { useGetAnnouncementsQuery, useGetEventsQuery, useGetEventByIdQuery } = eurofurenceService;