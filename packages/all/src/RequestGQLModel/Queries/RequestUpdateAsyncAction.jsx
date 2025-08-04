import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestLargeFragment } from "./RequestFragments";

const RequestUpdateMutationStr = `
mutation RequestUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: requestUpdate(
    request: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on RequestGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...RequestLarge
      }      
    }
    ...RequestLarge
  }
}
`

const RequestUpdateMutation = createQueryStrLazy(`
mutation RequestUpdate($id: UUID!, $lastchange: DateTime!) {
  result: requestUpdate(request: { id: $id, lastchange: $lastchange }) {
    __typename
    ... on RequestGQLModelDeleteError {
      Entity {
        ...RequestLargeFragment
      }
      msg
      failed
      location
      input
    }
    ... on RequestGQLModel {
      ...RequestLargeFragment
    }
  }
}
`, RequestLargeFragment)
export const RequestUpdateAsyncAction = createAsyncGraphQLAction(RequestUpdateMutation)