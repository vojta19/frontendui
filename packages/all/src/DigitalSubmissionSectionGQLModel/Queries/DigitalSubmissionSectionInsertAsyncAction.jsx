import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionSectionLargeFragment } from "./DigitalSubmissionSectionFragments";


const DigitalSubmissionSectionInsertMutationStr = `
mutation DigitalSubmissionSectionInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: digitalsubmissionsectionInsert(
    digitalsubmissionsection: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...DigitalSubmissionSectionLarge
  }
}
`

const DigitalSubmissionSectionInsertMutation = createQueryStrLazy(`${DigitalSubmissionSectionInsertMutationStr}`, DigitalSubmissionSectionLargeFragment)
export const DigitalSubmissionSectionInsertAsyncAction = createAsyncGraphQLAction(DigitalSubmissionSectionInsertMutation)