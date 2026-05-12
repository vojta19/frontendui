import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"

const FinanceValueUpdateMutationStr = `
    mutation financeUpdate(
        $id: UUID!
        $lastchange: DateTime!
        $value: Float
    ) {
        financeUpdate(
            finance: {
                id: $id
                lastchange: $lastchange
                value: $value
            }
        ) {
            ... on FinanceGQLModel {
                __typename
                id
                lastchange
                name
                nameEn
                value
                description
                financeTypeId
                masterfinanceId
            }

            ... on FinanceGQLModelUpdateError {
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

const FinanceValueUpdateMutation = createQueryStrLazy(
    `${FinanceValueUpdateMutationStr}`
)

export const FinanceValueUpdateAsyncAction =
    createAsyncGraphQLAction2(FinanceValueUpdateMutation)