import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

import { LargeFragment } from "./Fragments";

import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


/**
 * GraphQL mutation used for inserting a new entity.
 *
 * The mutation returns either an insertion error or the complete created
 * entity represented by the `Large` GraphQL fragment.
 *
 * @constant
 * @type {string}
 */
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
 * The mutation automatically includes all dependencies required by the
 * `Large` fragment.
 *
 * @constant
 */
const InsertMutation = createQueryStrLazy(
    InsertMutationStr,
    LargeFragment
);


/**
 * Asynchronous GraphQL action responsible for creating a new entity.
 *
 * The action executes the insert mutation and stores the result inside the
 * application state through the shared asynchronous action framework.
 *
 * @constant
 *
 * @example
 * dispatch(InsertAsyncAction(newEntity));
 */
export const InsertAsyncAction =
    createAsyncGraphQLAction2(
        InsertMutation
    );