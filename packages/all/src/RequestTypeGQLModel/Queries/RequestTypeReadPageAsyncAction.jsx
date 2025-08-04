import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestTypeLargeFragment } from "./RequestTypeFragments";

const RequestTypeReadPageQueryStr = `
query RequestTypeReadPageQuery($skip: Int, $limit: Int, $where: RequestTypeWhereInputFilter) {
  result: requesttypePage(skip: $skip, limit: $limit, where: $where) {
    ...RequestTypeLarge
  }
}
`
const RequestTypeReadPageQuery = createQueryStrLazy(`
query RequesttypePage($skip: Int, $limit: Int, $orderby: String, $where: RequestTypeInputFilter) {
  result: requesttypePage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    ...RequestTypeLargeFragment
  }
}
`, RequestTypeLargeFragment)
export const RequestTypeReadPageAsyncAction = createAsyncGraphQLAction(RequestTypeReadPageQuery)