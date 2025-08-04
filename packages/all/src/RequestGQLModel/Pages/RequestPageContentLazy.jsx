import React, { useState } from "react"

import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { RequestReadAsyncAction } from "../Queries"
import { RequestPageContent } from "./RequestPageContent"

/**
 * A lazy-loading component for displaying content of a request entity.
 *
 * This component fetches request data using `RequestReadAsyncAction`, and passes the result
 * to `RequestPageContent`. It provides change handlers (`onChange`, `onBlur`) and the `request` entity
 * to its children via a render function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} props.request - The request ID to load.
 * @param {(params: { request: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function (function-as-children) that receives:
 *   - `request` — the fetched request entity,
 *   - `onChange` — function to re-fetch when value changes,
 *   - `onBlur` — function to re-fetch when value is blurred.
 *
 * If `children` is not a function, it is rendered as-is inside `RequestPageContent`.
 *
 * @returns {JSX.Element} A component that fetches the request data and displays it,
 * or loading/error state.
 *
 * @example
 * <RequestPageContentLazy request={123}>
 *   {({ request, onChange, onBlur }) => (
 *     <input value={request.name} onChange={onChange} onBlur={onBlur} />
 *   )}
 * </RequestPageContentLazy>
 */
export const RequestPageContentLazy = ({ request, children }) => {
    const { error, loading, entity, fetch } = useAsyncAction(RequestReadAsyncAction, request)
    const [delayer] = useState(() => CreateDelayer())
  
    const handleChange = async (e) => {
      const value = e?.target?.value && request
      await delayer(() => fetch(value))
    }
  
    const handleBlur = async (e) => {
      const value = e?.target?.value && request
      await delayer(() => fetch(value))
    }
  
    return (
      <>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
          <RequestPageContent request={entity} onChange={handleChange} onBlur={handleBlur}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    ...child.props,
                    request: entity,
                    onChange: handleChange,
                    onBlur: handleBlur
                  })
                : child
            )}
          </RequestPageContent>
        )}
      </>
    )
}