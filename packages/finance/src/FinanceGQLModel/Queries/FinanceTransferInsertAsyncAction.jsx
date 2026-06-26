// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Definuje řetězec GraphQL mutace pro vytvoření a vložení nového finančního přesunu (transferu) mezi zdrojem a cílem
const FinanceTransferInsertMutationStr = `
mutation financeTransferInsert(
  $financeTransfer_financeSourceId: UUID!
  $financeTransfer_financeDestinationId: UUID!
  $financeTransfer_name: String
  $financeTransfer_amount: Float
) {
  financeTransferInsert(
    financeTransfer: {
      financeSourceId: $financeTransfer_financeSourceId
      financeDestinationId: $financeTransfer_financeDestinationId
      name: $financeTransfer_name
      amount: $financeTransfer_amount
    }
  ) {
    ... on FinanceTransferGQLModel {
      __typename
      id
      name
      financeSourceId
      financeDestinationId
      amount
    }

    ... on FinanceTransferGQLModelInsertError {
      __typename
      msg
      failed
      code
      location
      input
    }
  }
}
`; // Konec definice řetězce GraphQL mutace

// Sestavuje finální GraphQL operaci z textového řetězce mutace pomocí lazy generátoru
const FinanceTransferInsertMutation = createQueryStrLazy(
  `${FinanceTransferInsertMutationStr}`
); // Konec odloženého sestavení mutace

// Vytváří a exportuje výslednou asynchronní akci (thunk) pro odeslání mutace vložení přesunu na server
export const FinanceTransferInsertAsyncAction = createAsyncGraphQLAction2(
  FinanceTransferInsertMutation
); // Konec definice asynchronní akce FinanceTransferInsertAsyncAction