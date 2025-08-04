import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestLargeFragment } from "./RequestFragments";


const RequestInsertMutationStr = `
mutation RequestInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: requestInsert(
    request: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...RequestLarge
  }
}
`

const RequestInsertMutation = createQueryStrLazy(`
mutation RequestInsert($requesttypeId: UUID!, $rbacobjectId: UUID!, $id: UUID) {
  result: requestInsert(request: { requesttypeId: $requesttypeId, rbacobjectId: $rbacobjectId, id: $id }) {
    __typename
    ... on InsertError {
      msg
      failed
      code
      location
      input
    }
    ... on RequestGQLModel {
      ...RequestLargeFragment
    }
  }
}
`, RequestLargeFragment)
export const RequestInsertAsyncAction = createAsyncGraphQLAction(RequestInsertMutation)