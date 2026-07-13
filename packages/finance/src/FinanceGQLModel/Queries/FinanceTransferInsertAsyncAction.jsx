import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


/**
 * GraphQL mutation used for creating a finance transfer.
 *
 * The mutation creates a new transfer between two finance entities and
 * returns either the created transfer or an insertion error.
 *
 * @constant
 * @type {string}
 */
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
 * Lazily generated GraphQL mutation used for inserting finance transfers.
 *
 * The mutation is converted into an executable GraphQL request that can
 * be dispatched by the asynchronous action framework.
 *
 * @constant
 */
const FinanceTransferInsertMutation =
    createQueryStrLazy(
        FinanceTransferInsertMutationStr
    );


/**
 * Asynchronous GraphQL action responsible for creating finance transfers.
 *
 * The action sends the prepared GraphQL mutation to the backend and
 * stores the result in the application state.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     FinanceTransferInsertAsyncAction({
 *         financeTransfer_financeSourceId: sourceId,
 *         financeTransfer_financeDestinationId: destinationId,
 *         financeTransfer_name: "Přesun rozpočtu",
 *         financeTransfer_amount: 25000
 *     })
 * );
 */
export const FinanceTransferInsertAsyncAction =
    createAsyncGraphQLAction2(
        FinanceTransferInsertMutation
    );