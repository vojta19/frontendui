// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * GraphQL mutation used for creating a finance correction.
 *
 * The mutation inserts a new finance entity as a child of an existing
 * parent finance (`masterfinanceId`). It returns either the created
 * finance entity or an insertion error.
 *
 * @constant
 * @type {string}
 */
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

/**
 * Lazily generated GraphQL mutation used for creating finance corrections.
 *
 * The mutation string is converted into an executable GraphQL request
 * that can be dispatched by the asynchronous action framework.
 *
 * @constant
 */
// Sestavuje finální GraphQL operaci z textového řetězce mutace pomocí lazy generátoru
const FinanceCorrectionInsertMutation = createQueryStrLazy(
    `${FinanceCorrectionInsertMutationStr}`
); // Konec odloženého sestavení mutace

/**
 * Asynchronous GraphQL action responsible for creating a finance correction.
 *
 * The action executes the prepared GraphQL mutation and returns the newly
 * created finance entity after a successful insertion.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     FinanceCorrectionInsertAsyncAction({
 *         name: "Korekce rozpočtu",
 *         nameEn: "Budget Correction",
 *         value: 50000,
 *         description: "Correction of the allocated budget",
 *         masterfinanceId: "30000000-0000-0000-0000-000000000001"
 *     })
 * );
 */
// Vytváří a exportuje výslednou asynchronní akci (thunk) pro odeslání mutace založení podřízené finance na server
export const FinanceCorrectionInsertAsyncAction =
    createAsyncGraphQLAction2(FinanceCorrectionInsertMutation); // Konec definice asynchronní akce