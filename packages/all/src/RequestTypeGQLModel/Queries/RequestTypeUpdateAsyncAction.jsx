import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestTypeLargeFragment } from "./RequestTypeFragments";

const RequestTypeUpdateMutationStr = `
mutation RequestTypeUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: requesttypeUpdate(
    requesttype: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on RequestTypeGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...RequestTypeLarge
      }      
    }
    ...RequestTypeLarge
  }
}
`

const RequestTypeUpdateMutation = createQueryStrLazy(`
mutation RequesttypeUpdate($id: UUID!, $lastchange: DateTime!) {
  result: requesttypeUpdate(requestType: { id: $id, lastchange: $lastchange }) {
    __typename
    ... on RequestTypeGQLModelDeleteError {
      Entity {
        ...RequestTypeLargeFragment
      }
      msg
      failed
      location
      input
    }
    ... on RequestTypeGQLModel {
      ...RequestTypeLargeFragment
    }
  }
}
`, RequestTypeLargeFragment)
export const RequestTypeUpdateAsyncAction = createAsyncGraphQLAction(RequestTypeUpdateMutation)