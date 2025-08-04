import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormFieldLargeFragment } from "./DigitalFormFieldFragments";

const DigitalFormFieldReadPageQueryStr = `
query DigitalFormFieldReadPageQuery($skip: Int, $limit: Int, $where: DigitalFormFieldWhereInputFilter) {
  result: digitalformfieldPage(skip: $skip, limit: $limit, where: $where) {
    ...DigitalFormFieldLarge
  }
}
`
const DigitalFormFieldReadPageQuery = createQueryStrLazy(`${DigitalFormFieldReadPageQueryStr}`, DigitalFormFieldLargeFragment)
export const DigitalFormFieldReadPageAsyncAction = createAsyncGraphQLAction(DigitalFormFieldReadPageQuery)