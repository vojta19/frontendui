import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormFieldLargeFragment } from "./DigitalFormFieldFragments";

const DigitalFormFieldUpdateMutationStr = `
mutation DigitalFormFieldUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: digitalformfieldUpdate(
    digitalformfield: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on DigitalFormFieldGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...DigitalFormFieldLarge
      }      
    }
    ...DigitalFormFieldLarge
  }
}
`

const DigitalFormFieldUpdateMutation = createQueryStrLazy(`${DigitalFormFieldUpdateMutationStr}`, DigitalFormFieldLargeFragment)
export const DigitalFormFieldUpdateAsyncAction = createAsyncGraphQLAction(DigitalFormFieldUpdateMutation)