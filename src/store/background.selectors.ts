import { createSelector } from "@reduxjs/toolkit";

import { Notification } from "./background.slice";

export const selectEventReminders = createSelector(
    (state: any): Notification[] => state.notifications.notifications,
    (notifications) => notifications.filter((it) => it.type === "EventReminder")
);