// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * GraphQL mutation used for updating the financial value of a finance entity.
 *
 * The mutation updates only the `value` property of the selected finance
 * entity and returns either the updated entity or an update error.
 *
 * @constant
 * @type {string}
 */
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

/**
 * Lazily generated GraphQL mutation used for updating finance values.
 *
 * The mutation string is converted into an executable GraphQL request
 * that can be dispatched by the asynchronous action framework.
 *
 * @constant
 */
// Sestavuje finální GraphQL operaci z textového řetězce mutace pomocí lazy generátoru
const FinanceValueUpdateMutation = createQueryStrLazy(
    `${FinanceValueUpdateMutationStr}`
); // Konec odloženého sestavení mutace

/**
 * Asynchronous GraphQL action responsible for updating the financial value
 * of a finance entity.
 *
 * The action executes the prepared GraphQL mutation and returns the
 * updated finance entity after a successful value modification.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     FinanceValueUpdateAsyncAction({
 *         id: "30000000-0000-0000-0000-000000000001",
 *         lastchange: "2026-07-14T10:30:00Z",
 *         value: 1250000
 *     })
 * );
 */
// Vytváří a exportuje výslednou asynchronní akci (thunk) pro odeslání mutace aktualizace hodnoty na server
export const FinanceValueUpdateAsyncAction =
    createAsyncGraphQLAction2(FinanceValueUpdateMutation); // Konec definice asynchronní akce