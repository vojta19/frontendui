// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Definuje řetězec GraphQL dotazu pro stránkované a řazené načítání záznamů o přesunech financí (transferech)
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
`; // Konec definice řetězce GraphQL dotazu

// Sestavuje finální GraphQL operaci z textového řetězce dotazu pomocí lazy generátoru
const FinanceTransferPageQuery = createQueryStrLazy(
  `${FinanceTransferPageQueryStr}`
); // Konec odloženého sestavení dotazu

// Vytváří a exportuje výslednou asynchronní akci (thunk) pro načítání stránek finančních přesunů z backendu
export const FinanceTransferPageAsyncAction = createAsyncGraphQLAction2(
  FinanceTransferPageQuery
); // Konec definice asynchronní akce