import React, { useState } from "react"

import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { DigitalSubmissionReadAsyncAction } from "../Queries"
import { DigitalSubmissionPageContent } from "./DigitalSubmissionPageContent"

/**
 * A lazy-loading component for displaying content of a digitalsubmission entity.
 *
 * This component fetches digitalsubmission data using `DigitalSubmissionReadAsyncAction`, and passes the result
 * to `DigitalSubmissionPageContent`. It provides change handlers (`onChange`, `onBlur`) and the `digitalsubmission` entity
 * to its children via a render function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} props.digitalsubmission - The digitalsubmission ID to load.
 * @param {(params: { digitalsubmission: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function (function-as-children) that receives:
 *   - `digitalsubmission` — the fetched digitalsubmission entity,
 *   - `onChange` — function to re-fetch when value changes,
 *   - `onBlur` — function to re-fetch when value is blurred.
 *
 * If `children` is not a function, it is rendered as-is inside `DigitalSubmissionPageContent`.
 *
 * @returns {JSX.Element} A component that fetches the digitalsubmission data and displays it,
 * or loading/error state.
 *
 * @example
 * <DigitalSubmissionPageContentLazy digitalsubmission={123}>
 *   {({ digitalsubmission, onChange, onBlur }) => (
 *     <input value={digitalsubmission.name} onChange={onChange} onBlur={onBlur} />
 *   )}
 * </DigitalSubmissionPageContentLazy>
 */
export const DigitalSubmissionPageContentLazy = ({ digitalsubmission, children }) => {
    const { error, loading, entity, fetch } = useAsyncAction(DigitalSubmissionReadAsyncAction, digitalsubmission)
    const [delayer] = useState(() => CreateDelayer())
  
    const handleChange = async (e) => {
      const value = e?.target?.value && digitalsubmission
      await delayer(() => fetch(value))
    }
  
    const handleBlur = async (e) => {
      const value = e?.target?.value && digitalsubmission
      await delayer(() => fetch(value))
    }
  
    return (
      <>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
          <DigitalSubmissionPageContent digitalsubmission={entity} onChange={handleChange} onBlur={handleBlur}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    ...child.props,
                    digitalsubmission: entity,
                    onChange: handleChange,
                    onBlur: handleBlur
                  })
                : child
            )}
          </DigitalSubmissionPageContent>
        )}
      </>
    )
}