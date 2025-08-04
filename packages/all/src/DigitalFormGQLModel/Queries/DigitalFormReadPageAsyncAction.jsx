import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormLargeFragment } from "./DigitalFormFragments";

const DigitalFormReadPageQueryStr = `
query DigitalFormReadPageQuery($skip: Int, $limit: Int, $where: DigitalFormWhereInputFilter) {
  result: digitalformPage(skip: $skip, limit: $limit, where: $where) {
    ...DigitalFormLarge
  }
}
`
const DigitalFormReadPageQuery = createQueryStrLazy(`${DigitalFormReadPageQueryStr}`, DigitalFormLargeFragment)
export const DigitalFormReadPageAsyncAction = createAsyncGraphQLAction(DigitalFormReadPageQuery)