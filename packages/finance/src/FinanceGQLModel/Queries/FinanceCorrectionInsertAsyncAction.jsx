// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Definuje řetězec GraphQL mutace pro vložení nové podřízené finance (korekce) pod nadřazenou master entitu
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
`; // Konec definice řetězce GraphQL mutace

// Sestavuje finální GraphQL operaci z textového řetězce mutace pomocí lazy generátoru
const FinanceCorrectionInsertMutation = createQueryStrLazy(
    `${FinanceCorrectionInsertMutationStr}`
); // Konec odloženého sestavení mutace

// Vytváří a exportuje výslednou asynchronní akci (thunk) pro odeslání mutace založení podřízené finance na server
export const FinanceCorrectionInsertAsyncAction =
    createAsyncGraphQLAction2(FinanceCorrectionInsertMutation); // Konec definice asynchronní akce