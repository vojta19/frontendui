// Importuje Provider z knihovny react-redux.
// Provider zpřístupní Redux store celé React aplikaci.
import { Provider as ReduxProvider } from "react-redux";

// Importuje výchozí Redux store.
// Tento store se použije, pokud do RootProviders nepředáme jiný store ručně.
import { store as defaultStore } from "./Store";

// Importuje funkci pro vytvoření GraphQL klienta.
// GraphQL klient se potom používá pro posílání dotazů a mutací na backend.
import { createGraphQLClient } from "../Core/gqlClient2";

// Importuje React nástroje:
// createContext vytvoří kontext,
// useContext umožní číst hodnotu z kontextu,
// useMemo zabrání zbytečnému vytváření klienta při každém renderu.
import { createContext, useContext, useMemo } from "react";

// RootProviders je hlavní obalová komponenta pro celou aplikaci.
// Spojuje dohromady GraphQL klienta a Redux store.
export const RootProviders = ({
  children,              // Všechny vnořené komponenty aplikace
  clientOptions,         // Nastavení pro GraphQL klienta
  store = defaultStore,  // Redux store, pokud není předán vlastní, použije se defaultStore
}) => (
  // Nejdříve obalíme aplikaci GraphQL providerem,
  // aby všechny vnořené komponenty mohly používat GraphQL klienta.
  <GQLClientProvider clientOptions={clientOptions}>

    {/* ReduxProvider zpřístupní Redux store celé aplikaci. */}
    <ReduxProvider store={store}>

      {/* Zde se vykreslí skutečný obsah aplikace. */}
      {children}

    </ReduxProvider>
  </GQLClientProvider>
);

// Vytvoření React kontextu pro GraphQL klienta.
// Výchozí hodnota je null, protože klient se nastaví až v GQLClientProvideru.
export const GQLClientContext = createContext(null);

// Provider pro GraphQL klienta.
// Jeho úkolem je vytvořit GraphQL klienta a předat ho do React kontextu.
const GQLClientProvider = ({ children, clientOptions = {} }) => {

    // useMemo zajistí, že se GraphQL klient nevytváří znovu při každém renderu.
    //
    // createGraphQLClient(clientOptions) vytvoří konkrétní instanci klienta
    // podle předaného nastavení.
    //
    // Prázdné pole závislostí [] znamená:
    // klient se vytvoří pouze jednou při prvním renderu komponenty.
    const client = useMemo(
        () => createGraphQLClient(clientOptions),
        []
    );

    // Provider uloží vytvořeného klienta do GQLClientContext.
    // Všechny komponenty uvnitř children si ho potom mohou vytáhnout přes useGQLClient().
    return (
        <GQLClientContext.Provider value={client}>
            {children}
        </GQLClientContext.Provider>
    );
};

// Vlastní hook pro pohodlné získání GraphQL klienta z kontextu.
export const useGQLClient = () => {

    // Načte hodnotu z GQLClientContext.
    // Pokud je komponenta správně obalená GQLClientProviderem,
    // result bude obsahovat GraphQL klienta.
    const result = useContext(GQLClientContext);

    // Pokud result neexistuje, znamená to, že useGQLClient byl použit mimo GQLClientProvider.
    // To je chyba ve struktuře aplikace.
    if (!result)
        throw Error("useGQLClient not in GQLClientContext");

    // Vrací GraphQL klienta pro použití v komponentách nebo hookách.
    return result;
};