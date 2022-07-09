import { registerRootComponent } from "expo";
import { Provider as StoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { EurofurenceErrorBoundary } from "./components/Utilities/EurofurenceErrorBoundary";
import { LoadingContextProvider } from "./context/LoadingContext";
import { persistor, store } from "./store";

import "./i18n";

const Index = () => {
    return (
        <StoreProvider store={store}>
            <EurofurenceErrorBoundary>
                <PersistGate persistor={persistor}>
                    <LoadingContextProvider>
                        <App />
                    </LoadingContextProvider>
                </PersistGate>
            </EurofurenceErrorBoundary>
        </StoreProvider>
    );
};

registerRootComponent(Index);
