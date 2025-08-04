import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormFieldLargeFragment } from "./DigitalFormFieldFragments";

const DigitalFormFieldDeleteMutationStr = `
mutation DigitalFormFieldDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: digitalformfieldDelete(
    digitalformfield: {id: $id, lastchange: $lastchange}
  ) {
    ... on DigitalFormFieldGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...DigitalFormFieldLarge
      }
    }
  }
}
`
const DigitalFormFieldDeleteMutation = createQueryStrLazy(`${DigitalFormFieldDeleteMutationStr}`, DigitalFormFieldLargeFragment)
export const DigitalFormFieldDeleteAsyncAction = createAsyncGraphQLAction(DigitalFormFieldDeleteMutation)