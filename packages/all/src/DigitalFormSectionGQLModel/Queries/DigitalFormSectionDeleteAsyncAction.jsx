import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormSectionLargeFragment } from "./DigitalFormSectionFragments";

const DigitalFormSectionDeleteMutationStr = `
mutation DigitalFormSectionDeleteMutation($id: UUID!, $lastchange: DateTime!) {
  result: digitalFormSectionDelete(
    digitalFormSection: {id: $id, lastchange: $lastchange}
  ) {
    ... on DigitalFormSectionGQLModelDeleteError {
      failed
      msg
      input
      Entity {
        ...DigitalFormSectionLargeFragment
      }
    }
  }
}
`
const DigitalFormSectionDeleteMutation = createQueryStrLazy(
  `${DigitalFormSectionDeleteMutationStr}`, DigitalFormSectionLargeFragment)
export const DigitalFormSectionDeleteAsyncAction = createAsyncGraphQLAction(DigitalFormSectionDeleteMutation)