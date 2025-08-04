import React, { useState } from "react"

import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { RequestTypeReadAsyncAction } from "../Queries"
import { RequestTypePageContent } from "./RequestTypePageContent"

/**
 * A lazy-loading component for displaying content of a requesttype entity.
 *
 * This component fetches requesttype data using `RequestTypeReadAsyncAction`, and passes the result
 * to `RequestTypePageContent`. It provides change handlers (`onChange`, `onBlur`) and the `requesttype` entity
 * to its children via a render function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} props.requesttype - The requesttype ID to load.
 * @param {(params: { requesttype: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function (function-as-children) that receives:
 *   - `requesttype` — the fetched requesttype entity,
 *   - `onChange` — function to re-fetch when value changes,
 *   - `onBlur` — function to re-fetch when value is blurred.
 *
 * If `children` is not a function, it is rendered as-is inside `RequestTypePageContent`.
 *
 * @returns {JSX.Element} A component that fetches the requesttype data and displays it,
 * or loading/error state.
 *
 * @example
 * <RequestTypePageContentLazy requesttype={123}>
 *   {({ requesttype, onChange, onBlur }) => (
 *     <input value={requesttype.name} onChange={onChange} onBlur={onBlur} />
 *   )}
 * </RequestTypePageContentLazy>
 */
export const RequestTypePageContentLazy = ({ requesttype, children }) => {
    const { error, loading, entity, fetch } = useAsyncAction(RequestTypeReadAsyncAction, requesttype)
    const [delayer] = useState(() => CreateDelayer())
  
    const handleChange = async (e) => {
      const value = e?.target?.value && requesttype
      await delayer(() => fetch(value))
    }
  
    const handleBlur = async (e) => {
      const value = e?.target?.value && requesttype
      await delayer(() => fetch(value))
    }
  
    return (
      <>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
          <RequestTypePageContent requesttype={entity} onChange={handleChange} onBlur={handleBlur}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    ...child.props,
                    requesttype: entity,
                    onChange: handleChange,
                    onBlur: handleBlur
                  })
                : child
            )}
          </RequestTypePageContent>
        )}
      </>
    )
}