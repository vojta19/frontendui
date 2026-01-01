import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation digitalFormInsert($name: String, $nameEn: String, $id: UUID, $sections: [DigitalFormSectionInsertGQLModel!]) {
  digitalFormInsert(digitalForm: {name: $name, nameEn: $nameEn, id: $id, sections: $sections}) {
    ... on DigitalFormGQLModel { ...Large }
    ... on DigitalFormGQLModelInsertError { ...InsertError }
  }
}


fragment InsertError on DigitalFormGQLModelInsertError {
  __typename
  msg
  failed
  code
  location
  input

}
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)