// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje funkci pro redukci výsledků storu z dynamického úložiště Reduxu (momentálně nevyužito, ale importováno)
import { reduceToFirstEntity } from "../../../../dynamic/src/Store";

/**
 * GraphQL query used for searching entities.
 *
 * The query performs a paginated search using the supplied search pattern
 * and returns entities represented by the `Large` GraphQL fragment.
 *
 * Search results are filtered using the GraphQL `_ilike` operator.
 *
 * @constant
 * @type {string}
 */
// Definuje řetězec GraphQL dotazu pro stránkované vyhledávání uživatelů podle e-mailu (case-insensitive _ilike)
const SearchQueryStr = `
query SearchQuery($skip: Int, $limit: Int, $pattern: String) {
  result: userPage(skip: $skip, limit: $limit, where: { email: { _ilike: $pattern } }) {
    ...Large
  }
}
`; // Konec definice řetězce GraphQL dotazu

/**
 * Lazily generated GraphQL query used for entity search.
 *
 * The query string is converted into an executable GraphQL request and
 * automatically includes all dependencies required by the `Large`
 * GraphQL fragment.
 *
 * @constant
 */
// Sestavuje finální GraphQL dotaz spojením textu vyhledávání a definice LargeFragmentu pomocí lazy generátoru
export const SearchAsyncActionQuery = createQueryStrLazy(`${SearchQueryStr}`, LargeFragment);

/**
 * Asynchronous GraphQL action used for searching entities.
 *
 * The action executes the prepared GraphQL search query and returns a
 * paginated collection of matching entities.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     SearchAsyncAction({
 *         skip: 0,
 *         limit: 20,
 *         pattern: "%budget%"
 *     })
 * );
 */
// Vytváří a exportuje výslednou asynchronní akci (thunk) pro spuštění vyhledávání na GraphQL endpointu
export const SearchAsyncAction = createAsyncGraphQLAction2(SearchAsyncActionQuery);