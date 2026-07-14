// Importuje helper pro vytvoření lazily vyhodnocovaného GraphQL dotazu.
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje helper pro vytvoření asynchronní GraphQL akce.
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


/**
 * GraphQL mutation used to create a finance transfer.
 *
 * The mutation creates a new transfer between two finance entities and
 * returns either the newly created transfer or an insertion error.
 *
 * @constant
 * @type {string}
 */
// Definuje text GraphQL mutace pro vložení převodu.
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
`;


/**
 * Lazily generated GraphQL mutation used for creating finance transfers.
 *
 * The mutation string is converted into an executable GraphQL query object
 * that can be used by the asynchronous action framework.
 *
 * @constant
 */
// Vytvoří GraphQL dotaz z textu mutace.
const FinanceTransferInsertMutation =
    createQueryStrLazy(
        FinanceTransferInsertMutationStr
    );


/**
 * Asynchronous GraphQL action responsible for inserting finance transfers.
 *
 * The action executes the prepared GraphQL mutation, sends it to the backend
 * and stores the returned result in the application state.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     FinanceTransferInsertAsyncAction({
 *         financeTransfer_financeSourceId: sourceId,
 *         financeTransfer_financeDestinationId: destinationId,
 *         financeTransfer_name: "Budget transfer",
 *         financeTransfer_amount: 25000
 *     })
 * );
 */
// Vytvoří exportovanou asynchronní akci pro vložení převodu.
export const FinanceTransferInsertAsyncAction =
    createAsyncGraphQLAction2(
        FinanceTransferInsertMutation
    );