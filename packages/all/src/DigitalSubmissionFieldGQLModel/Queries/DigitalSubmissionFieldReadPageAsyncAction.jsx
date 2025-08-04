import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionFieldLargeFragment } from "./DigitalSubmissionFieldFragments";

const DigitalSubmissionFieldReadPageQueryStr = `
query DigitalSubmissionFieldReadPageQuery($skip: Int, $limit: Int, $where: DigitalSubmissionFieldWhereInputFilter) {
  result: digitalsubmissionfieldPage(skip: $skip, limit: $limit, where: $where) {
    ...DigitalSubmissionFieldLarge
  }
}
`
const DigitalSubmissionFieldReadPageQuery = createQueryStrLazy(`${DigitalSubmissionFieldReadPageQueryStr}`, DigitalSubmissionFieldLargeFragment)
export const DigitalSubmissionFieldReadPageAsyncAction = createAsyncGraphQLAction(DigitalSubmissionFieldReadPageQuery)