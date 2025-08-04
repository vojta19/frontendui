import React, { useState } from "react"

import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { DigitalSubmissionFieldReadAsyncAction } from "../Queries"
import { DigitalSubmissionFieldPageContent } from "./DigitalSubmissionFieldPageContent"

/**
 * A lazy-loading component for displaying content of a digitalsubmissionfield entity.
 *
 * This component fetches digitalsubmissionfield data using `DigitalSubmissionFieldReadAsyncAction`, and passes the result
 * to `DigitalSubmissionFieldPageContent`. It provides change handlers (`onChange`, `onBlur`) and the `digitalsubmissionfield` entity
 * to its children via a render function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} props.digitalsubmissionfield - The digitalsubmissionfield ID to load.
 * @param {(params: { digitalsubmissionfield: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function (function-as-children) that receives:
 *   - `digitalsubmissionfield` — the fetched digitalsubmissionfield entity,
 *   - `onChange` — function to re-fetch when value changes,
 *   - `onBlur` — function to re-fetch when value is blurred.
 *
 * If `children` is not a function, it is rendered as-is inside `DigitalSubmissionFieldPageContent`.
 *
 * @returns {JSX.Element} A component that fetches the digitalsubmissionfield data and displays it,
 * or loading/error state.
 *
 * @example
 * <DigitalSubmissionFieldPageContentLazy digitalsubmissionfield={123}>
 *   {({ digitalsubmissionfield, onChange, onBlur }) => (
 *     <input value={digitalsubmissionfield.name} onChange={onChange} onBlur={onBlur} />
 *   )}
 * </DigitalSubmissionFieldPageContentLazy>
 */
export const DigitalSubmissionFieldPageContentLazy = ({ digitalsubmissionfield, children }) => {
    const { error, loading, entity, fetch } = useAsyncAction(DigitalSubmissionFieldReadAsyncAction, digitalsubmissionfield)
    const [delayer] = useState(() => CreateDelayer())
  
    const handleChange = async (e) => {
      const value = e?.target?.value && digitalsubmissionfield
      await delayer(() => fetch(value))
    }
  
    const handleBlur = async (e) => {
      const value = e?.target?.value && digitalsubmissionfield
      await delayer(() => fetch(value))
    }
  
    return (
      <>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
          <DigitalSubmissionFieldPageContent digitalsubmissionfield={entity} onChange={handleChange} onBlur={handleBlur}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    ...child.props,
                    digitalsubmissionfield: entity,
                    onChange: handleChange,
                    onBlur: handleBlur
                  })
                : child
            )}
          </DigitalSubmissionFieldPageContent>
        )}
      </>
    )
}