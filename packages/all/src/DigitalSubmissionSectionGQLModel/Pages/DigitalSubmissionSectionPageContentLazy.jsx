import React, { useState } from "react"

import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { DigitalSubmissionSectionReadAsyncAction } from "../Queries"
import { DigitalSubmissionSectionPageContent } from "./DigitalSubmissionSectionPageContent"

/**
 * A lazy-loading component for displaying content of a digitalsubmissionsection entity.
 *
 * This component fetches digitalsubmissionsection data using `DigitalSubmissionSectionReadAsyncAction`, and passes the result
 * to `DigitalSubmissionSectionPageContent`. It provides change handlers (`onChange`, `onBlur`) and the `digitalsubmissionsection` entity
 * to its children via a render function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} props.digitalsubmissionsection - The digitalsubmissionsection ID to load.
 * @param {(params: { digitalsubmissionsection: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function (function-as-children) that receives:
 *   - `digitalsubmissionsection` — the fetched digitalsubmissionsection entity,
 *   - `onChange` — function to re-fetch when value changes,
 *   - `onBlur` — function to re-fetch when value is blurred.
 *
 * If `children` is not a function, it is rendered as-is inside `DigitalSubmissionSectionPageContent`.
 *
 * @returns {JSX.Element} A component that fetches the digitalsubmissionsection data and displays it,
 * or loading/error state.
 *
 * @example
 * <DigitalSubmissionSectionPageContentLazy digitalsubmissionsection={123}>
 *   {({ digitalsubmissionsection, onChange, onBlur }) => (
 *     <input value={digitalsubmissionsection.name} onChange={onChange} onBlur={onBlur} />
 *   )}
 * </DigitalSubmissionSectionPageContentLazy>
 */
export const DigitalSubmissionSectionPageContentLazy = ({ digitalsubmissionsection, children }) => {
    const { error, loading, entity, fetch } = useAsyncAction(DigitalSubmissionSectionReadAsyncAction, digitalsubmissionsection)
    const [delayer] = useState(() => CreateDelayer())
  
    const handleChange = async (e) => {
      const value = e?.target?.value && digitalsubmissionsection
      await delayer(() => fetch(value))
    }
  
    const handleBlur = async (e) => {
      const value = e?.target?.value && digitalsubmissionsection
      await delayer(() => fetch(value))
    }
  
    return (
      <>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
          <DigitalSubmissionSectionPageContent digitalsubmissionsection={entity} onChange={handleChange} onBlur={handleBlur}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    ...child.props,
                    digitalsubmissionsection: entity,
                    onChange: handleChange,
                    onBlur: handleBlur
                  })
                : child
            )}
          </DigitalSubmissionSectionPageContent>
        )}
      </>
    )
}