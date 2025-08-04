import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionLargeFragment } from "./DigitalSubmissionFragments";

const DigitalSubmissionReadPageQueryStr = `
query DigitalSubmissionReadPageQuery($skip: Int, $limit: Int, $where: DigitalSubmissionWhereInputFilter) {
  result: digitalsubmissionPage(skip: $skip, limit: $limit, where: $where) {
    ...DigitalSubmissionLarge
  }
}
`
const DigitalSubmissionReadPageQuery = createQueryStrLazy(`${DigitalSubmissionReadPageQueryStr}`, DigitalSubmissionLargeFragment)
export const DigitalSubmissionReadPageAsyncAction = createAsyncGraphQLAction(DigitalSubmissionReadPageQuery)