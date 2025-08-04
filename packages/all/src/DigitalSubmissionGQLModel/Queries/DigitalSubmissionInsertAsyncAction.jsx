import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionLargeFragment } from "./DigitalSubmissionFragments";


const DigitalSubmissionInsertMutationStr = `
mutation DigitalSubmissionInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: digitalsubmissionInsert(
    digitalsubmission: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...DigitalSubmissionLarge
  }
}
`

const DigitalSubmissionInsertMutation = createQueryStrLazy(`${DigitalSubmissionInsertMutationStr}`, DigitalSubmissionLargeFragment)
export const DigitalSubmissionInsertAsyncAction = createAsyncGraphQLAction(DigitalSubmissionInsertMutation)