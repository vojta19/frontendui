import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"

const FinanceCorrectionInsertMutationStr = `
mutation financeInsert(
    $name: String
    $nameEn: String
    $value: Float
    $description: String
    $masterfinanceId: UUID!
) {
    financeInsert(
        finance: {
            name: $name
            nameEn: $nameEn
            value: $value
            description: $description
            masterfinanceId: $masterfinanceId
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
            masterfinanceId
        }

        ... on FinanceGQLModelInsertError {
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

const FinanceCorrectionInsertMutation = createQueryStrLazy(
    `${FinanceCorrectionInsertMutationStr}`
)

export const FinanceCorrectionInsertAsyncAction =
    createAsyncGraphQLAction2(FinanceCorrectionInsertMutation)