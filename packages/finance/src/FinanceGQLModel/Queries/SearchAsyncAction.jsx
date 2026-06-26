// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje funkci pro redukci výsledků storu z dynamického úložiště Reduxu (momentálně nevyužito, ale importováno)
import { reduceToFirstEntity } from "../../../../dynamic/src/Store";

// Definuje řetězec GraphQL dotazu pro stránkované vyhledávání uživatelů podle e-mailu (case-insensitive _ilike)
const SearchQueryStr = `
query SearchQuery($skip: Int, $limit: Int, $pattern: String) {
  result: userPage(skip: $skip, limit: $limit, where: { email: { _ilike: $pattern } }) {
    ...Large
  }
}
`; // Konec definice řetězce GraphQL dotazu

// Sestavuje finální GraphQL dotaz spojením textu vyhledávání a definice LargeFragmentu pomocí lazy generátoru
export const SearchAsyncActionQuery = createQueryStrLazy(`${SearchQueryStr}`, LargeFragment);

// Vytváří a exportuje výslednou asynchronní akci (thunk) pro spuštění vyhledávání na GraphQL endpointu
export const SearchAsyncAction = createAsyncGraphQLAction2(SearchAsyncActionQuery);