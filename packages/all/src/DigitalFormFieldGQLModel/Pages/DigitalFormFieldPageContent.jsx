import { DigitalFormFieldLargeCard } from "../Components"
import { DigitalFormFieldPageNavbar } from "./DigitalFormFieldPageNavbar"

/**
 * Renders a page layout for a single digitalformfield entity, including navigation and detailed view.
 *
 * This component wraps `DigitalFormFieldPageNavbar` and `DigitalFormFieldLargeCard` to provide a consistent
 * interface for displaying an individual digitalformfield. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {{ id: string|number, name: string }} props.digitalformfield - The digitalformfield entity to display.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a digitalformfield.
 *
 * @example
 * const digitalformfield = { id: 1, name: "Example DigitalFormField" };
 * <DigitalFormFieldPageContent digitalformfield={digitalformfield}>
 *   <p>Additional info here.</p>
 * </DigitalFormFieldPageContent>
 */
export const DigitalFormFieldPageContent = ({digitalformfield, children, ...props}) => {
    return (<>
        <DigitalFormFieldPageNavbar digitalformfield={digitalformfield} />
        <DigitalFormFieldLargeCard digitalformfield={digitalformfield} {...props} >
            DigitalFormField {JSON.stringify(digitalformfield)}
            {children}
        </DigitalFormFieldLargeCard>
    </>)
}