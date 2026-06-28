// Importuje Bootstrap CSS.
// Díky tomu jsou v aplikaci dostupné Bootstrap styly,
// například tlačítka, karty, grid systém atd.
import 'bootstrap/dist/css/bootstrap.min.css';

// Importuje Redux store konkrétní aplikace.
// Tento store se potom předá do RootProviders,
// aby k němu měly komponenty přístup přes Redux.
import { store } from "./Store";

// Importuje hlavní router aplikace.
// AppRouter určuje, jaké stránky/komponenty se zobrazí podle URL adresy.
import { AppRouter } from './AppRouter';

// Importuje RootProviders ze sdíleného balíčku dynamic.
// RootProviders obaluje aplikaci potřebnými providery,
// například ReduxProviderem a GraphQL klientem.
import { RootProviders } from '../../../packages/dynamic/src/Store';

// Výchozí adresa GraphQL endpointu.
// Na tuto adresu budou chodit GraphQL dotazy a mutace.
export const GQLENDPOINT_ = "/api/gql";

// Původně připravený komentář pro získání SDL schématu z klienta.
// Teď je zakomentovaný, takže se nikde nepoužívá.
// const getSdl = () => client.sdl()


// Vypnutí ESLint pravidla pro kontrolu prop-types.
// Používá se proto, že komponenta App přijímá props,
// ale nejsou zde definované přes PropTypes.
// eslint-disable-next-line react/prop-types

// Hlavní komponenta aplikace.
// Přijímá volitelný parametr GQLENDPOINT.
// Pokud není předán, použije se výchozí hodnota GQLENDPOINT_.
export const App = ({ GQLENDPOINT = GQLENDPOINT_ }) => {
  return (
    // RootProviders obalí celou aplikaci potřebnými globálními providery.
    // Díky tomu může aplikace používat:
    // - GraphQL klienta,
    // - Redux store,
    // - další sdílenou aplikační infrastrukturu.
    <RootProviders
      // Nastavení GraphQL klienta.
      // Endpoint říká, kam se mají posílat GraphQL požadavky.
      clientOptions={{ endpoint: GQLENDPOINT }}

      // Předání Redux store do aplikace.
      store={store}
    >
      {/* AppRouter vykreslí konkrétní stránku podle aktuální URL adresy. */}
      <AppRouter />
    </RootProviders>
  );
};