// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Definuje řetězec GraphQL dotazu pro bezpečné vyhledání a načtení jedné konkrétní finance na základě jejího UUID
const ReadQueryStr = `
query financeById($id: UUID!) {
  financeById(id: $id) {
    ...Large
  }
}
`; // Konec definice řetězce GraphQL dotazu

// Sestavuje finální GraphQL dotaz spojením textu vyhledání podle ID a definice LargeFragmentu pomocí lazy generátoru
const ReadQuery = createQueryStrLazy(`${ReadQueryStr}`, LargeFragment);

/**
 * An async action for executing a GraphQL query to read  entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `QueryRead` query.
 * It can be dispatched with query variables to fetch data related to  entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the  entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(ReadAsyncAction(queryVariables))
 * .then((result) => {
 * console.log("Fetched data:", result);
 * })
 * .catch((error) => {
 * console.error("Error fetching data:", error);
 * });
 */
// PŮVODNÍ ZAKOMENTOVANÝ EXPORT: export const ReadAsyncAction = createAsyncGraphQLAction2(ReadQuery, reduceToFirstEntity("result"))

// Vytváří a exportuje asynchronní akci (thunk) spojením připraveného dotazu ReadQuery a generátoru akcí
export const ReadAsyncAction = createAsyncGraphQLAction2(ReadQuery);