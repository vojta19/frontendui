import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestTypeLargeFragment } from "./RequestTypeFragments";

const RequestTypeDeleteMutationStr = `
mutation RequestTypeDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: requesttypeDelete(
    requesttype: {id: $id, lastchange: $lastchange}
  ) {
    ... on RequestTypeGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...RequestTypeLarge
      }
    }
  }
}
`
const RequestTypeDeleteMutation = createQueryStrLazy(`${RequestTypeDeleteMutationStr}`, RequestTypeLargeFragment)
export const RequestTypeDeleteAsyncAction = createAsyncGraphQLAction(RequestTypeDeleteMutation)