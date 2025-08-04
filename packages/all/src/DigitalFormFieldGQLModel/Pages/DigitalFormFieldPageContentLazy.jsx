import React, { useState } from "react"

import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { DigitalFormFieldReadAsyncAction } from "../Queries"
import { DigitalFormFieldPageContent } from "./DigitalFormFieldPageContent"

/**
 * A lazy-loading component for displaying content of a digitalformfield entity.
 *
 * This component fetches digitalformfield data using `DigitalFormFieldReadAsyncAction`, and passes the result
 * to `DigitalFormFieldPageContent`. It provides change handlers (`onChange`, `onBlur`) and the `digitalformfield` entity
 * to its children via a render function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} props.digitalformfield - The digitalformfield ID to load.
 * @param {(params: { digitalformfield: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function (function-as-children) that receives:
 *   - `digitalformfield` — the fetched digitalformfield entity,
 *   - `onChange` — function to re-fetch when value changes,
 *   - `onBlur` — function to re-fetch when value is blurred.
 *
 * If `children` is not a function, it is rendered as-is inside `DigitalFormFieldPageContent`.
 *
 * @returns {JSX.Element} A component that fetches the digitalformfield data and displays it,
 * or loading/error state.
 *
 * @example
 * <DigitalFormFieldPageContentLazy digitalformfield={123}>
 *   {({ digitalformfield, onChange, onBlur }) => (
 *     <input value={digitalformfield.name} onChange={onChange} onBlur={onBlur} />
 *   )}
 * </DigitalFormFieldPageContentLazy>
 */
export const DigitalFormFieldPageContentLazy = ({ digitalformfield, children }) => {
    const { error, loading, entity, fetch } = useAsyncAction(DigitalFormFieldReadAsyncAction, digitalformfield)
    const [delayer] = useState(() => CreateDelayer())
  
    const handleChange = async (e) => {
      const value = e?.target?.value && digitalformfield
      await delayer(() => fetch(value))
    }
  
    const handleBlur = async (e) => {
      const value = e?.target?.value && digitalformfield
      await delayer(() => fetch(value))
    }
  
    return (
      <>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
          <DigitalFormFieldPageContent digitalformfield={entity} onChange={handleChange} onBlur={handleBlur}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    ...child.props,
                    digitalformfield: entity,
                    onChange: handleChange,
                    onBlur: handleBlur
                  })
                : child
            )}
          </DigitalFormFieldPageContent>
        )}
      </>
    )
}