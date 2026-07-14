// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * GraphQL query used for loading a finance entity by its identifier.
 *
 * The query returns a complete finance entity represented by the
 * `Large` GraphQL fragment.
 *
 * @constant
 * @type {string}
 */
// Definuje řetězec GraphQL dotazu pro bezpečné vyhledání a načtení jedné konkrétní finance na základě jejího UUID
const ReadQueryStr = `
query financeById($id: UUID!) {
  financeById(id: $id) {
    ...Large
  }
}
`; // Konec definice řetězce GraphQL dotazu

/**
 * Lazily generated GraphQL query used for reading finance entities.
 *
 * The query automatically includes all fragment dependencies required
 * by the `Large` GraphQL fragment.
 *
 * @constant
 */
// Sestavuje finální GraphQL dotaz spojením textu vyhledání podle ID a definice LargeFragmentu pomocí lazy generátoru
const ReadQuery = createQueryStrLazy(`${ReadQueryStr}`, LargeFragment);

/**
 * Asynchronous GraphQL action used for loading a finance entity.
 *
 * The action executes the prepared GraphQL query, retrieves a finance
 * entity identified by its unique identifier and stores the received
 * data in the application state.
 *
 * The returned entity contains all information defined by the
 * `LargeFragment`, including related entities and child finances.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} queryVariables
 * Variables supplied to the GraphQL query.
 *
 * @param {string} queryVariables.id
 * Unique identifier of the finance entity to load.
 *
 * @returns {Function}
 * Dispatchable asynchronous GraphQL action.
 *
 * @example
 * dispatch(
 *     ReadAsyncAction({
 *         id: "30000000-0000-0000-0000-000000000001"
 *     })
 * );
 */

// Vytváří a exportuje asynchronní akci (thunk) spojením připraveného dotazu ReadQuery a generátoru akcí
export const ReadAsyncAction = createAsyncGraphQLAction2(ReadQuery);