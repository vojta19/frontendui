import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestTypeLargeFragment } from "./RequestTypeFragments";


const RequestTypeInsertMutationStr = `
mutation RequestTypeInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: requesttypeInsert(
    requesttype: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...RequestTypeLarge
  }
}
`

const RequestTypeInsertMutation = createQueryStrLazy(`
mutation RequesttypeInsert($id: UUID) {
  result: requesttypeInsert(requestType: { id: $id }) {
    __typename
    ... on InsertError {
      msg
      failed
      code
      location
      input
    }
    ... on RequestTypeGQLModel {
      ...RequestTypeLargeFragment
    }
  }
}
`, RequestTypeLargeFragment)
export const RequestTypeInsertAsyncAction = createAsyncGraphQLAction(RequestTypeInsertMutation)