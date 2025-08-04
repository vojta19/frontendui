import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionSectionLargeFragment } from "./DigitalSubmissionSectionFragments";

const DigitalSubmissionSectionDeleteMutationStr = `
mutation DigitalSubmissionSectionDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: digitalsubmissionsectionDelete(
    digitalsubmissionsection: {id: $id, lastchange: $lastchange}
  ) {
    ... on DigitalSubmissionSectionGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...DigitalSubmissionSectionLarge
      }
    }
  }
}
`
const DigitalSubmissionSectionDeleteMutation = createQueryStrLazy(`${DigitalSubmissionSectionDeleteMutationStr}`, DigitalSubmissionSectionLargeFragment)
export const DigitalSubmissionSectionDeleteAsyncAction = createAsyncGraphQLAction(DigitalSubmissionSectionDeleteMutation)