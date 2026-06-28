// Importuje pomocnou funkci pro vytvoření lazy GraphQL query stringu.
// Lazy znamená, že se dotaz připraví, ale spouští se až ve chvíli,
// kdy ho zavolá async akce.
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje funkci pro vytvoření asynchronní GraphQL akce.
// Tahle akce se postará o odeslání dotazu na backend
// a následné zpracování výsledku.
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Importuje Redux akce pro práci s finančními transfery.
// Konkrétně se zde použije financeTransfers_set,
// která uloží načtené transfery do Redux store.
import { FinanceTransferActions } from "../Store/FinanceTransferSlice";

// GraphQL dotaz pro načtení stránky finančních transferů.
// Dotaz přijímá volitelné parametry:
// - skip: kolik záznamů přeskočit,
// - limit: kolik záznamů načíst,
// - orderby: podle čeho řadit.
const FinanceTransferPageQueryStr = `
query financeTransferPage(
  $skip: Int
  $limit: Int
  $orderby: String
) {
  financeTransferPage(
    skip: $skip
    limit: $limit
    orderby: $orderby
  ) {
    __typename
    id
    name
    amount
    created
    financeSourceId
    financeDestinationId
  }
}
`;

// Z textového GraphQL dotazu vytvoří lazy query.
// Výsledkem je objekt/funkce, kterou umí použít createAsyncGraphQLAction2.
const FinanceTransferPageQuery = createQueryStrLazy(
  `${FinanceTransferPageQueryStr}`
);

// Middleware / callback funkce, která zpracuje výsledek GraphQL dotazu.
// Jejím úkolem je vytáhnout z odpovědi seznam transferů
// a uložit ho do Redux store.
const saveFinanceTransfersToStore = (result) => async (
  dispatch,
  getState,
  next
) => {
  // Backend může výsledek vrátit ve více strukturách.
  //
  // První varianta:
  // result.data.financeTransferPage
  //
  // Druhá varianta:
  // result.financeTransferPage
  //
  // Pokud není nalezeno nic, použije se prázdné pole.
  const transfers =
    result?.data?.financeTransferPage ??
    result?.financeTransferPage ??
    [];

  // Uloží načtené transfery do Redux store.
  // Tím se naplní state.financeTransfers.items.
  dispatch(FinanceTransferActions.financeTransfers_set(transfers));

  // Předá původní výsledek dál v řetězci zpracování.
  // Díky tomu může s výsledkem pracovat i další logika,
  // která je navázaná za tímto callbackem.
  return next(result);
};

// Vytvoření finální asynchronní akce pro načítání finančních transferů.
//
// Tato akce:
// 1. spustí GraphQL dotaz FinanceTransferPageQuery,
// 2. získá výsledek z backendu,
// 3. zavolá saveFinanceTransfersToStore,
// 4. uloží načtené transfery do Redux store.
export const FinanceTransferPageAsyncAction = createAsyncGraphQLAction2(
  FinanceTransferPageQuery,
  saveFinanceTransfersToStore
);