import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionFieldLargeFragment } from "./DigitalSubmissionFieldFragments";

const DigitalSubmissionFieldDeleteMutationStr = `
mutation DigitalSubmissionFieldDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: digitalsubmissionfieldDelete(
    digitalsubmissionfield: {id: $id, lastchange: $lastchange}
  ) {
    ... on DigitalSubmissionFieldGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...DigitalSubmissionFieldLarge
      }
    }
  }
}
`
const DigitalSubmissionFieldDeleteMutation = createQueryStrLazy(`${DigitalSubmissionFieldDeleteMutationStr}`, DigitalSubmissionFieldLargeFragment)
export const DigitalSubmissionFieldDeleteAsyncAction = createAsyncGraphQLAction(DigitalSubmissionFieldDeleteMutation)