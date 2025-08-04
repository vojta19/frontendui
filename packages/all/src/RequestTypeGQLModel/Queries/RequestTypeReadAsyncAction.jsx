import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestTypeLargeFragment } from "./RequestTypeFragments";

const RequestTypeReadQueryStr = `
query RequestTypeReadQuery($id: UUID!) {
  result: requesttypeById(id: $id) {
    ...RequestTypeLarge
  }
}
`

const RequestTypeReadQuery = createQueryStrLazy(`
query RequesttypeById($id: UUID!) {
  result: requesttypeById(id: $id) {
    ...RequestTypeLargeFragment
  }
}
`, RequestTypeLargeFragment)

/**
 * An async action for executing a GraphQL query to read requesttype entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `RequestTypeQueryRead` query.
 * It can be dispatched with query variables to fetch data related to requesttype entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the requesttype entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(RequestTypeReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
export const RequestTypeReadAsyncAction = createAsyncGraphQLAction(RequestTypeReadQuery)