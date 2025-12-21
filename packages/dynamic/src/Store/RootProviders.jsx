import { Provider as ReduxProvider } from "react-redux";
import { store } from "./Store";
import { createGraphQLClient } from "../Core/gqlClient2";
import { createContext, useContext, useMemo } from "react";

export const RootProviders = ({ children, clientOptions }) => (
    <GQLClientProvider clientOptions={clientOptions}>
        <ReduxProvider store={store}>
            {children}
        </ReduxProvider>
    </GQLClientProvider>
);

export const GQLClientContext = createContext(null);

const GQLClientProvider = ({children, clientOptions={}}) => {
    const client = useMemo(
        () => createGraphQLClient(clientOptions),
        []
    );
    return (
        <GQLClientContext.Provider value={client}>
            {children}
        </GQLClientContext.Provider>
    )
}

export const useGQLClient = () => {
    const result = useContext(GQLClientContext)
    if (!result )
        throw Error("useGQLClient not in GQLClientContext")
    return result
}