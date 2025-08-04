import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionFieldLargeFragment } from "./DigitalSubmissionFieldFragments";

const DigitalSubmissionFieldUpdateMutationStr = `
mutation DigitalSubmissionFieldUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: digitalsubmissionfieldUpdate(
    digitalsubmissionfield: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on DigitalSubmissionFieldGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...DigitalSubmissionFieldLarge
      }      
    }
    ...DigitalSubmissionFieldLarge
  }
}
`

const DigitalSubmissionFieldUpdateMutation = createQueryStrLazy(`${DigitalSubmissionFieldUpdateMutationStr}`, DigitalSubmissionFieldLargeFragment)
export const DigitalSubmissionFieldUpdateAsyncAction = createAsyncGraphQLAction(DigitalSubmissionFieldUpdateMutation)