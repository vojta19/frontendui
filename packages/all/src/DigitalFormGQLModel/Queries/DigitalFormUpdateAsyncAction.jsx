import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormLargeFragment } from "./DigitalFormFragments";

const DigitalFormUpdateMutationStr = `
mutation DigitalFormUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: digitalformUpdate(
    digitalform: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on DigitalFormGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...DigitalFormLarge
      }      
    }
    ...DigitalFormLarge
  }
}
`

const DigitalFormUpdateMutation = createQueryStrLazy(`${DigitalFormUpdateMutationStr}`, DigitalFormLargeFragment)
export const DigitalFormUpdateAsyncAction = createAsyncGraphQLAction(DigitalFormUpdateMutation)