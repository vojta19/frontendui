import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalSubmissionLargeFragment } from "./DigitalSubmissionFragments";

const DigitalSubmissionReadQueryStr = `
query DigitalSubmissionReadQuery($id: UUID!) {
  result: digitalsubmissionById(id: $id) {
    ...DigitalSubmissionLarge
  }
}
`

const DigitalSubmissionReadQuery = createQueryStrLazy(`${DigitalSubmissionReadQueryStr}`, DigitalSubmissionLargeFragment)

/**
 * An async action for executing a GraphQL query to read digitalsubmission entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `DigitalSubmissionQueryRead` query.
 * It can be dispatched with query variables to fetch data related to digitalsubmission entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the digitalsubmission entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(DigitalSubmissionReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
export const DigitalSubmissionReadAsyncAction = createAsyncGraphQLAction(DigitalSubmissionReadQuery)