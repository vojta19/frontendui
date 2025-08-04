import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestLargeFragment } from "./RequestFragments";

const RequestDeleteMutationStr = `
mutation RequestDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: requestDelete(
    request: {id: $id, lastchange: $lastchange}
  ) {
    ... on RequestGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...RequestLarge
      }
    }
  }
}
`
const RequestDeleteMutation = createQueryStrLazy(`${RequestDeleteMutationStr}`, RequestLargeFragment)
export const RequestDeleteAsyncAction = createAsyncGraphQLAction(RequestDeleteMutation)