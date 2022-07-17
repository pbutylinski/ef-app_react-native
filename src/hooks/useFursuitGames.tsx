import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";

import { appBase } from "../configuration";
import { useAppSelector } from "../store";

export const useFursuitGames = () => {
    const token = useAppSelector((state) => state.authorization.token);
    return useCallback(() => {
        if (token === undefined) {
            alert("You are not logged in.");
            return;
        }
        WebBrowser.openBrowserAsync(`${appBase}/companion/#/login?embedded=false&returnPath=/collect&token=${token}`).catch(console.error);
    }, [token]);
};
