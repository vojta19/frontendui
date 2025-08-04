import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionFieldLargeFragment } from "./DigitalSubmissionFieldFragments";


const DigitalSubmissionFieldInsertMutationStr = `
mutation DigitalSubmissionFieldInsertMutation($id: UUID, $name: String, $name_en: String) {
  result: digitalsubmissionfieldInsert(
    digitalsubmissionfield: {id: $id, name: $name, nameEn: $name_en}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...DigitalSubmissionFieldLarge
  }
}
`

const DigitalSubmissionFieldInsertMutation = createQueryStrLazy(`${DigitalSubmissionFieldInsertMutationStr}`, DigitalSubmissionFieldLargeFragment)
export const DigitalSubmissionFieldInsertAsyncAction = createAsyncGraphQLAction(DigitalSubmissionFieldInsertMutation)