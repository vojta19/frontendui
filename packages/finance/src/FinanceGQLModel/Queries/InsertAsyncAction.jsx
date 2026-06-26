// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Definuje řetězec GraphQL mutace pro vložení nového typu role (roleTypeInsert) včetně rekurzivních podtypů a zpracování chyb
const InsertMutationStr = `
mutation roleTypeInsert(
  $mastertypeId: UUID # null, 
  $id: UUID # null, 
  $name: String # null, 
  $nameEn: String # null, 
  $subtypes: [RoleTypeInsertGQLModel!] # null
) {
  roleTypeInsert(
    roleType: {
      mastertypeId: $mastertypeId, 
      id: $id, 
      name: $name, 
      nameEn: $nameEn, 
      subtypes: $subtypes
    }
  ) {
    ... on InsertError { ...InsertError }
    ... on RoleTypeGQLModel { ...Large }
  }
}

fragment InsertError on InsertError {
  __typename
  msg
  failed
  code
  location
  input
}
`; // Konec definice řetězce GraphQL mutace

// Sestavuje finální GraphQL dotaz spojením textu mutace a definice LargeFragmentu pomocí lazy generátoru
const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment);

// Vytváří a exportuje výslednou asynchronní akci (thunk) pro odesílání požadavků na vytvoření nového záznamu v databázi
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation);