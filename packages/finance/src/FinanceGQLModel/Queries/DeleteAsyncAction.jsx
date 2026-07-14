// Importuje funkci createQueryStrLazy ze sdíleného GraphQL balíčku pro odložené sestavení dotazu s fragmenty
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje podrobné datové schéma LargeFragment z lokálního souboru fragmentů
import { LargeFragment } from "./Fragments";

// Importuje pokročilého tvůrce asynchronních akcí createAsyncGraphQLAction2 z dynamického jádra aplikace
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * GraphQL mutation used for deleting an entity.
 *
 * The mutation removes the selected entity identified by its unique ID and
 * last modification timestamp. In case of failure, detailed information
 * about the deletion error together with the affected entity is returned.
 *
 * @constant
 * @type {string}
 */
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

/**
 * Lazily generated GraphQL mutation used for deleting entities.
 *
 * The mutation string is converted into an executable GraphQL request and
 * automatically includes all dependencies required by the `Large`
 * GraphQL fragment.
 *
 * @constant
 */
// Sestavuje finální GraphQL dotaz spojením textu mutace a definice LargeFragmentu pomocí lazy generátoru
const DeleteMutation = createQueryStrLazy(`${DeleteMutationStr}`, LargeFragment);

/**
 * Asynchronous GraphQL action responsible for deleting an entity.
 *
 * The action executes the prepared GraphQL delete mutation and returns
 * the result of the deletion operation, including any GraphQL errors
 * reported by the backend.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     DeleteAsyncAction({
 *         id: "30000000-0000-0000-0000-000000000001",
 *         lastchange: "2026-07-14T10:30:00Z"
 *     })
 * );
 */
// Vytváří a exportuje výslednou asynchronní akci (thunk) pro odesílání požadavků na smazání záznamu z databáze
export const DeleteAsyncAction = createAsyncGraphQLAction2(DeleteMutation);