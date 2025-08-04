import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormFieldLargeFragment } from "./DigitalFormFieldFragments";

const DigitalFormFieldReadQueryStr = `
query DigitalFormFieldReadQuery($id: UUID!) {
  result: digitalformfieldById(id: $id) {
    ...DigitalFormFieldLarge
  }
}
`

const DigitalFormFieldReadQuery = createQueryStrLazy(`${DigitalFormFieldReadQueryStr}`, DigitalFormFieldLargeFragment)

/**
 * An async action for executing a GraphQL query to read digitalformfield entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `DigitalFormFieldQueryRead` query.
 * It can be dispatched with query variables to fetch data related to digitalformfield entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the digitalformfield entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(DigitalFormFieldReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
export const DigitalFormFieldReadAsyncAction = createAsyncGraphQLAction(DigitalFormFieldReadQuery)