import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionLargeFragment } from "./DigitalSubmissionFragments";

const DigitalSubmissionDeleteMutationStr = `
mutation DigitalSubmissionDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: digitalsubmissionDelete(
    digitalsubmission: {id: $id, lastchange: $lastchange}
  ) {
    ... on DigitalSubmissionGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...DigitalSubmissionLarge
      }
    }
  }
}
`
const DigitalSubmissionDeleteMutation = createQueryStrLazy(`${DigitalSubmissionDeleteMutationStr}`, DigitalSubmissionLargeFragment)
export const DigitalSubmissionDeleteAsyncAction = createAsyncGraphQLAction(DigitalSubmissionDeleteMutation)