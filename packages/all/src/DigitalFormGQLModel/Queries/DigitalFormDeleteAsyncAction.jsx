import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormLargeFragment } from "./DigitalFormFragments";

const DigitalFormDeleteMutationStr = `
mutation DigitalFormDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: digitalformDelete(
    digitalform: {id: $id, lastchange: $lastchange}
  ) {
    ... on DigitalFormGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...DigitalFormLarge
      }
    }
  }
}
`
const DigitalFormDeleteMutation = createQueryStrLazy(`${DigitalFormDeleteMutationStr}`, DigitalFormLargeFragment)
export const DigitalFormDeleteAsyncAction = createAsyncGraphQLAction(DigitalFormDeleteMutation)