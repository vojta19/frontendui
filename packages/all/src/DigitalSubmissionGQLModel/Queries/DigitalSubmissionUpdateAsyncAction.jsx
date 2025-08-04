import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionLargeFragment } from "./DigitalSubmissionFragments";

const DigitalSubmissionUpdateMutationStr = `
mutation DigitalSubmissionUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: digitalsubmissionUpdate(
    digitalsubmission: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on DigitalSubmissionGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...DigitalSubmissionLarge
      }      
    }
    ...DigitalSubmissionLarge
  }
}
`

const DigitalSubmissionUpdateMutation = createQueryStrLazy(`${DigitalSubmissionUpdateMutationStr}`, DigitalSubmissionLargeFragment)
export const DigitalSubmissionUpdateAsyncAction = createAsyncGraphQLAction(DigitalSubmissionUpdateMutation)