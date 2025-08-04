import React, { useState } from "react"

import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { DigitalFormReadAsyncAction } from "../Queries"
import { DigitalFormPageContent } from "./DigitalFormPageContent"

/**
 * A lazy-loading component for displaying content of a digitalform entity.
 *
 * This component fetches digitalform data using `DigitalFormReadAsyncAction`, and passes the result
 * to `DigitalFormPageContent`. It provides change handlers (`onChange`, `onBlur`) and the `digitalform` entity
 * to its children via a render function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} props.digitalform - The digitalform ID to load.
 * @param {(params: { digitalform: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function (function-as-children) that receives:
 *   - `digitalform` — the fetched digitalform entity,
 *   - `onChange` — function to re-fetch when value changes,
 *   - `onBlur` — function to re-fetch when value is blurred.
 *
 * If `children` is not a function, it is rendered as-is inside `DigitalFormPageContent`.
 *
 * @returns {JSX.Element} A component that fetches the digitalform data and displays it,
 * or loading/error state.
 *
 * @example
 * <DigitalFormPageContentLazy digitalform={123}>
 *   {({ digitalform, onChange, onBlur }) => (
 *     <input value={digitalform.name} onChange={onChange} onBlur={onBlur} />
 *   )}
 * </DigitalFormPageContentLazy>
 */
export const DigitalFormPageContentLazy = ({ digitalform, children }) => {
    const { error, loading, entity, fetch } = useAsyncAction(DigitalFormReadAsyncAction, digitalform)
    const [delayer] = useState(() => CreateDelayer())
  
    const handleChange = async (e) => {
      const value = e?.target?.value && digitalform
      await delayer(() => fetch(value))
    }
  
    const handleBlur = async (e) => {
      const value = e?.target?.value && digitalform
      await delayer(() => fetch(value))
    }
  
    return (
      <>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
          <DigitalFormPageContent digitalform={entity} onChange={handleChange} onBlur={handleBlur}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    ...child.props,
                    digitalform: entity,
                    onChange: handleChange,
                    onBlur: handleBlur
                  })
                : child
            )}
          </DigitalFormPageContent>
        )}
      </>
    )
}