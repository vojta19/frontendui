import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormSectionLargeFragment } from "./DigitalFormSectionFragments";

const DigitalFormSectionReadPageQueryStr = `
query DigitalFormSectionReadPageQuery($skip: Int, $limit: Int, $where: DigitalFormSectionWhereInputFilter) {
  result: digitalformsectionPage(skip: $skip, limit: $limit, where: $where) {
    ...DigitalFormSectionLarge
  }
}
`
const DigitalFormSectionReadPageQuery = createQueryStrLazy(`${DigitalFormSectionReadPageQueryStr}`, DigitalFormSectionLargeFragment)
export const DigitalFormSectionReadPageAsyncAction = createAsyncGraphQLAction(DigitalFormSectionReadPageQuery)