// Importuje helper pro vytvoření lazily vyhodnocovaného GraphQL dotazu.
import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

// Importuje fragment s rozšířenými daty vracené entity.
import { LargeFragment } from "./Fragments";

// Importuje helper pro vytvoření asynchronní GraphQL akce.
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


/**
 * GraphQL mutation used for creating a new entity.
 *
 * The mutation inserts a new entity into the backend and returns either
 * an insertion error or the complete created entity represented by the
 * `Large` GraphQL fragment.
 *
 * @constant
 * @type {string}
 */
// Definuje text GraphQL mutace pro vytvoření role.
const InsertMutationStr = `
mutation roleTypeInsert(
  $mastertypeId: UUID,
  $id: UUID,
  $name: String,
  $nameEn: String,
  $subtypes: [RoleTypeInsertGQLModel!]
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
    ... on InsertError {
      ...InsertError
    }
    ... on RoleTypeGQLModel {
      ...Large
    }
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
`;


/**
 * Lazily generated GraphQL mutation.
 *
 * The mutation string is converted into an executable GraphQL query object.
 * All fragment dependencies required by the `Large` fragment are included
 * automatically.
 *
 * @constant
 */
// Vytvoří GraphQL dotaz z textu mutace a přidá potřebné fragmenty.
const InsertMutation = createQueryStrLazy(
    InsertMutationStr,
    LargeFragment
);


/**
 * Asynchronous GraphQL action responsible for creating a new entity.
 *
 * The action executes the prepared GraphQL mutation and stores the returned
 * result in the application state using the shared asynchronous action
 * framework.
 *
 * @constant
 *
 * @example
 * dispatch(
 *     InsertAsyncAction({
 *         id: "...",
 *         name: "Example",
 *         nameEn: "Example EN"
 *     })
 * );
 */
// Vytvoří exportovanou asynchronní akci pro spuštění mutace.
export const InsertAsyncAction =
    createAsyncGraphQLAction2(
        InsertMutation
    );