// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Definuje řetězec GraphQL dotazu pro stránkované, řazené a filtrované načítání stránek finančního modelu
const ReadPageQueryStr = `
query financePage($skip: Int, $limit: Int, $orderby: String, $where: FinanceInputFilter) {
  financePage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    ...Large
  }
}
`; // Konec definice řetězce GraphQL dotazu

// Sestavuje finální GraphQL dotaz spojením textu stránkování a definice LargeFragmentu pomocí lazy generátoru
const ReadPageQuery = createQueryStrLazy(`${ReadPageQueryStr}`, LargeFragment);

// Vytváří a exportuje výslednou asynchronní akci (thunk) pro načítání celých stránek/kolekcí dat z backendu
export const ReadPageAsyncAction = createAsyncGraphQLAction2(ReadPageQuery);