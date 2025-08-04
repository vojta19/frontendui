import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionSectionLargeFragment } from "./DigitalSubmissionSectionFragments";

const DigitalSubmissionSectionUpdateMutationStr = `
mutation DigitalSubmissionSectionUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String) {
  result: digitalsubmissionsectionUpdate(
    digitalsubmissionsection: {id: $id, lastchange: $lastchange, name: $name, nameEn: $name_en}
  ) {
    ... on DigitalSubmissionSectionGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...DigitalSubmissionSectionLarge
      }      
    }
    ...DigitalSubmissionSectionLarge
  }
}
`

const DigitalSubmissionSectionUpdateMutation = createQueryStrLazy(`${DigitalSubmissionSectionUpdateMutationStr}`, DigitalSubmissionSectionLargeFragment)
export const DigitalSubmissionSectionUpdateAsyncAction = createAsyncGraphQLAction(DigitalSubmissionSectionUpdateMutation)