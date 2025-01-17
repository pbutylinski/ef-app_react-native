import React, { ReactNode } from "react";
import * as Sentry from "sentry-expo";

import { AppErrorContent } from "./AppErrorContent";

export class AppErrorBoundary extends React.PureComponent<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        Sentry.Native.captureException(error);

        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <AppErrorContent error={this.state.error} />;
        }
        return this.props.children;
    }
}
