import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestLargeFragment } from "./RequestFragments";

const RequestReadQueryStr = `
query RequestReadQuery($id: UUID!) {
  result: requestById(id: $id) {
    ...RequestLarge
  }
}
`

const RequestReadQuery = createQueryStrLazy(`
query RequestById($id: UUID!) {
  result: requestById(id: $id) {
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

/**
 * An async action for executing a GraphQL query to read request entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `RequestQueryRead` query.
 * It can be dispatched with query variables to fetch data related to request entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the request entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(RequestReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
export const RequestReadAsyncAction = createAsyncGraphQLAction(RequestReadQuery)