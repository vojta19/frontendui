import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestLargeFragment } from "./RequestFragments";

const RequestReadPageQueryStr = `
query RequestReadPageQuery($skip: Int, $limit: Int, $where: RequestWhereInputFilter) {
  result: requestPage(skip: $skip, limit: $limit, where: $where) {
    ...RequestLarge
  }
}
`
const RequestReadPageQuery = createQueryStrLazy(`
query RequestPage($skip: Int, $limit: Int, $orderby: String, $where: RequestInputFilter) {
  result: requestPage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    ...RequestLargeFragment

    activeSubmission {
      __typename
      id
      form {
        __typename
        id
        name
        description
      }
      name
      sections {
        __typename
        section {
          __typename
          id
          index
        }
        formSection {
          __typename
          id
          name
          label
          order
          repatableMin
          repatableMax
        }
        id
        fields {
          __typename
          id
          value
          field {
            __typename
            id
            name
            label
            description
            required
            typeId
          }
          rbacobject {
            currentUserRoles {
              roletype {
                id
                name
              }
            }
          }
        }
        rbacobject {
          currentUserRoles {
            roletype {
              id
              name
            }
          }
        }
      }
      rbacobject {
        currentUserRoles {
          roletype {
            id
            name
          }
        }
      }
    }
  
  }
}
`, RequestLargeFragment)
export const RequestReadPageAsyncAction = createAsyncGraphQLAction(RequestReadPageQuery)