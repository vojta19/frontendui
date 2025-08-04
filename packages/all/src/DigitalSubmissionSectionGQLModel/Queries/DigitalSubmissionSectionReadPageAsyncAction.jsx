import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionSectionLargeFragment } from "./DigitalSubmissionSectionFragments";

const DigitalSubmissionSectionReadPageQueryStr = `
query DigitalSubmissionSectionReadPageQuery($skip: Int, $limit: Int, $where: DigitalSubmissionSectionWhereInputFilter) {
  result: digitalsubmissionsectionPage(skip: $skip, limit: $limit, where: $where) {
    ...DigitalSubmissionSectionLarge
  }
}
`
const DigitalSubmissionSectionReadPageQuery = createQueryStrLazy(`${DigitalSubmissionSectionReadPageQueryStr}`, DigitalSubmissionSectionLargeFragment)
export const DigitalSubmissionSectionReadPageAsyncAction = createAsyncGraphQLAction(DigitalSubmissionSectionReadPageQuery)