// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * GraphQL query used for loading a paginated collection of finance entities.
 *
 * The query supports pagination, sorting and filtering through the supplied
 * GraphQL variables. Each returned finance entity is represented by the
 * `Large` GraphQL fragment.
 *
 * @constant
 * @type {string}
 */
// Definuje řetězec GraphQL dotazu pro stránkované, řazené a filtrované načítání stránek finančního modelu
const ReadPageQueryStr = `
query financePage($skip: Int, $limit: Int, $orderby: String, $where: FinanceInputFilter) {
  financePage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    ...Large
  }
}
`; // Konec definice řetězce GraphQL dotazu

/**
 * Lazily generated GraphQL query used for loading finance pages.
 *
 * The query string is converted into an executable GraphQL request and
 * automatically includes all fragment dependencies required by the
 * `Large` GraphQL fragment.
 *
 * @constant
 */
// Sestavuje finální GraphQL dotaz spojením textu stránkování a definice LargeFragmentu pomocí lazy generátoru
const ReadPageQuery = createQueryStrLazy(`${ReadPageQueryStr}`, LargeFragment);

/**
 * Asynchronous GraphQL action used for loading paginated finance entities.
 *
 * The action executes the prepared GraphQL query and returns a page of
 * finance entities according to the supplied pagination, sorting and
 * filtering parameters.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     ReadPageAsyncAction({
 *         skip: 0,
 *         limit: 20,
 *         orderby: "name",
 *         where: {}
 *     })
 * );
 */
// Vytváří a exportuje výslednou asynchronní akci (thunk) pro načítání celých stránek/kolekcí dat z backendu
export const ReadPageAsyncAction = createAsyncGraphQLAction2(ReadPageQuery);