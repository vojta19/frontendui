import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation digitalFormUpdate($id: UUID!, $lastchange: DateTime!, $name: String, $nameEn: String) {
  digitalFormUpdate(digitalForm: {id: $id, lastchange: $lastchange, name: $name, nameEn: $nameEn}) {
    ... on DigitalFormGQLModel { ...Large }
    ... on DigitalFormGQLModelUpdateError { ...Error }
  }
}

fragment Error on DigitalFormGQLModelUpdateError {
  __typename
  Entity {
    ...Large
  }
  msg
  failed
  code
  location
  input
}
`

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)