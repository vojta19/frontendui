// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Definuje řetězec GraphQL mutace pro parciální aktualizaci číselné hodnoty (value) konkrétního finančního záznamu podle ID
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
`; // Konec definice řetězce GraphQL mutace

// Sestavuje finální GraphQL operaci z textového řetězce mutace pomocí lazy generátoru
const FinanceValueUpdateMutation = createQueryStrLazy(
    `${FinanceValueUpdateMutationStr}`
); // Konec odloženého sestavení mutace

// Vytváří a exportuje výslednou asynchronní akci (thunk) pro odeslání mutace aktualizace hodnoty na server
export const FinanceValueUpdateAsyncAction =
    createAsyncGraphQLAction2(FinanceValueUpdateMutation); // Konec definice asynchronní akce