// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

// Definuje řetězec GraphQL mutace pro odstranění typu role (roleTypeDelete) včetně zpracování chybových stavů
const DeleteMutationStr = `
mutation roleTypeDelete(
  $id: UUID! # null, 
  $lastchange: DateTime! # null
) {
  roleTypeDelete(
    roleType: {
      id: $id, 
      lastchange: $lastchange
    }
  ) {
    ...RoleTypeGQLModelDeleteError
  }
}

fragment RoleTypeGQLModelDeleteError on RoleTypeGQLModelDeleteError {
  __typename
  Entity {
    ...Large
  }
  msg
  code
  failed
  location
  input
}
`; // Konec definice řetězce GraphQL mutace

// Sestavuje finální GraphQL dotaz spojením textu mutace a definice LargeFragmentu pomocí lazy generátoru
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment);

// Vytváří a exportuje výslednou asynchronní akci (thunk) pro odesílání požadavků na smazání záznamu z databáze
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation);