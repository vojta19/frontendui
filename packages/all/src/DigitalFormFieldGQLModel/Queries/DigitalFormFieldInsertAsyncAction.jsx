import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormFieldLargeFragment } from "./DigitalFormFieldFragments";


const DigitalFormFieldInsertMutationStr = `
mutation DigitalFormFieldInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: digitalformfieldInsert(
    digitalformfield: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...DigitalFormFieldLarge
  }
}
`

const DigitalFormFieldInsertMutation = createQueryStrLazy(`${DigitalFormFieldInsertMutationStr}`, DigitalFormFieldLargeFragment)
export const DigitalFormFieldInsertAsyncAction = createAsyncGraphQLAction(DigitalFormFieldInsertMutation)