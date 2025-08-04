import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormSectionLargeFragment } from "./DigitalFormSectionFragments";

const DigitalFormSectionUpdateMutationStr = `
mutation DigitalFormSectionUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: digitalformsectionUpdate(
    digitalformsection: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on DigitalFormSectionGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...DigitalFormSectionLarge
      }      
    }
    ...DigitalFormSectionLarge
  }
}
`

const DigitalFormSectionUpdateMutation = createQueryStrLazy(`${DigitalFormSectionUpdateMutationStr}`, DigitalFormSectionLargeFragment)
export const DigitalFormSectionUpdateAsyncAction = createAsyncGraphQLAction(DigitalFormSectionUpdateMutation)