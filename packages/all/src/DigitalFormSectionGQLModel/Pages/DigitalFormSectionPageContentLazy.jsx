import React, { useState } from "react"

import { CreateDelayer, ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { DigitalFormSectionReadAsyncAction } from "../Queries"
import { DigitalFormSectionPageContent } from "./DigitalFormSectionPageContent"

/**
 * A lazy-loading component for displaying content of a digitalformsection entity.
 *
 * This component fetches digitalformsection data using `DigitalFormSectionReadAsyncAction`, and passes the result
 * to `DigitalFormSectionPageContent`. It provides change handlers (`onChange`, `onBlur`) and the `digitalformsection` entity
 * to its children via a render function.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|number} props.digitalformsection - The digitalformsection ID to load.
 * @param {(params: { digitalformsection: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children] -
 *   Optional render function (function-as-children) that receives:
 *   - `digitalformsection` — the fetched digitalformsection entity,
 *   - `onChange` — function to re-fetch when value changes,
 *   - `onBlur` — function to re-fetch when value is blurred.
 *
 * If `children` is not a function, it is rendered as-is inside `DigitalFormSectionPageContent`.
 *
 * @returns {JSX.Element} A component that fetches the digitalformsection data and displays it,
 * or loading/error state.
 *
 * @example
 * <DigitalFormSectionPageContentLazy digitalformsection={123}>
 *   {({ digitalformsection, onChange, onBlur }) => (
 *     <input value={digitalformsection.name} onChange={onChange} onBlur={onBlur} />
 *   )}
 * </DigitalFormSectionPageContentLazy>
 */
export const DigitalFormSectionPageContentLazy = ({ digitalformsection, children }) => {
    const { error, loading, entity, fetch } = useAsyncAction(DigitalFormSectionReadAsyncAction, digitalformsection)
    const [delayer] = useState(() => CreateDelayer())
  
    const handleChange = async (e) => {
      const value = e?.target?.value && digitalformsection
      await delayer(() => fetch(value))
    }
  
    const handleBlur = async (e) => {
      const value = e?.target?.value && digitalformsection
      await delayer(() => fetch(value))
    }
  
    return (
      <>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {entity && (
          <DigitalFormSectionPageContent digitalformsection={entity} onChange={handleChange} onBlur={handleBlur}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    ...child.props,
                    digitalformsection: entity,
                    onChange: handleChange,
                    onBlur: handleBlur
                  })
                : child
            )}
          </DigitalFormSectionPageContent>
        )}
      </>
    )
}