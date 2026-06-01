import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"

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
`

const FinanceTransferPageQuery = createQueryStrLazy(
  `${FinanceTransferPageQueryStr}`
)

export const FinanceTransferPageAsyncAction = createAsyncGraphQLAction2(
  FinanceTransferPageQuery
)