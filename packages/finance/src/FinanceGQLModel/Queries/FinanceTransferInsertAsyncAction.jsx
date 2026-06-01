import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"

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
`

const FinanceTransferInsertMutation = createQueryStrLazy(
  `${FinanceTransferInsertMutationStr}`
)

export const FinanceTransferInsertAsyncAction = createAsyncGraphQLAction2(
  FinanceTransferInsertMutation
)