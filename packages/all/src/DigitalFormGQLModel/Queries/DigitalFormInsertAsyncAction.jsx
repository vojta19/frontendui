import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormLargeFragment } from "./DigitalFormFragments";


const DigitalFormInsertMutationStr = `
mutation DigitalFormInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: digitalformInsert(
    digitalform: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...DigitalFormLarge
  }
}
`

const DigitalFormInsertMutation = createQueryStrLazy(`${DigitalFormInsertMutationStr}`, DigitalFormLargeFragment)
export const DigitalFormInsertAsyncAction = createAsyncGraphQLAction(DigitalFormInsertMutation)