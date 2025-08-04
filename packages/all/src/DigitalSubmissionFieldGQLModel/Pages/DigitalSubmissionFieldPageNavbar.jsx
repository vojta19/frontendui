import Nav from 'react-bootstrap/Nav'
import { ProxyLink, MyNavbar, useHash } from '@hrbolek/uoisfrontend-shared';

import { DigitalSubmissionFieldURI } from '../Components'

/**
 * Allow to use HashContainer for determination which component at page will be rendered.
 * That must be manually inserted at DigitalSubmissionFieldPageContent, usually this should be done 
 * as children of DigitalSubmissionFieldLargeCard.
 * <DigitalSubmissionFieldLargeCard>
 *     <HashContainer>
 *         <VectorA id="history"/>
 *         <VectorB id="roles"/>
 *         <VectorC id="graph"/>
 *     </HashContainer>
 * </DigitalSubmissionFieldLargeCard>
 * it is usefull to define globally active "areas" like science, administration, teaching, ...
 */
const DigitalSubmissionFieldPageSegments = [
    { segment: 'education', label: 'Výuka'},
    { segment: 'reaserach', label: 'Tvůrčí činnost' },
    { segment: 'administration', label: 'Organizační činnost' },
    { segment: 'development', label: 'Rozvoj' },
]

/**
 * A navigation button component that generates a URL based on the digitalsubmissionfield's ID and a specific segment.
 * The button uses a `ProxyLink` to navigate while preserving hash and query parameters.
 *
 * ### Features:
 * - Dynamically constructs the URL with a hash fragment pointing to the specified segment.
 * - Displays a label for the navigation link.
 * - Integrates seamlessly with `ProxyLink` for enhanced navigation.
 *
 * @component
 * @param {Object} props - The properties for the TitleNavButton component.
 * @param {Object} props.digitalsubmissionfield - The digitalsubmissionfield object containing details about the digitalsubmissionfield.
 * @param {string|number} props.digitalsubmissionfield.id - The unique identifier for the digitalsubmissionfield.
 * @param {string} props.segment - The segment to append as a hash fragment in the URL.
 * @param {string} props.label - The text to display as the label for the navigation button.
 *
 * @returns {JSX.Element} A styled navigation button linking to the constructed URL.
 *
 * @example
 * // Example 1: Basic usage with a digitalsubmissionfield and segment
 * const digitalsubmissionfield = { id: 123 };
 * const segment = "details";
 * const label = "View Details";
 *
 * <TitleNavButton digitalsubmissionfield={digitalsubmissionfield} segment={segment} label={label} />
 * // Resulting URL: `/ug/digitalsubmissionfield/view/123#details`
 *
 * @example
 * // Example 2: Different segment and label
 * <TitleNavButton digitalsubmissionfield={{ id: 456 }} segment="settings" label="DigitalSubmissionField Settings" />
 * // Resulting URL: `/ug/digitalsubmissionfield/view/456#settings`
 */
const TitleNavButton = ({ digitalsubmissionfield, segment, label, ...props }) => {
    // const urlbase = (segment) => `/digitalsubmissionfields/digitalsubmissionfield/${segment}/${digitalsubmissionfield?.id}`;
    const urlbase = (segment) => `${DigitalSubmissionFieldURI}${digitalsubmissionfield?.id}#${segment}`;
    return (
        <Nav.Link as={"span"} {...props}>
            <ProxyLink to={urlbase(segment)}>{label}</ProxyLink>
        </Nav.Link>
    );
};

/**
 * Renders the navigation bar for an DigitalSubmissionField page.
 *
 * This component uses a custom hook, `useHash()`, to determine the current hash
 * and highlights the active segment. It displays a navigation bar (using MyNavbar)
 * with several segments (e.g. "history", "roles", "graph"), each rendered as a 
 * TitleNavButton. The segments are hardcoded in this component and only rendered 
 * if an `digitalsubmissionfield` object is provided.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Object} props.digitalsubmissionfield - The digitalsubmissionfield entity object that provides context for the page.
 * @param {string|number} props.digitalsubmissionfield.id - The unique identifier for the digitalsubmissionfield.
 * @param {Function} props.onSearchChange - Callback function to handle changes in the search input.
 *
 * @returns {JSX.Element} The rendered DigitalSubmissionFieldPageNavbar component.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionfield = { id: 123, ... };
 * <DigitalSubmissionFieldPageNavbar digitalsubmissionfield={digitalsubmissionfield} onSearchChange={handleSearchChange} />
 */
export const DigitalSubmissionFieldPageNavbar = ({ digitalsubmissionfield, children, onSearchChange }) => {
    const [currentHash, setHash] = useHash(); // Use the custom hook to manage hash
    
    return (
        <div className='screen-only'>
        <MyNavbar onSearchChange={onSearchChange} >
            {digitalsubmissionfield && DigitalSubmissionFieldPageSegments.map(({ segment, label }) => (
                <Nav.Item key={segment} >
                    <TitleNavButton
                        digitalsubmissionfield={digitalsubmissionfield}
                        segment={segment}
                        label={label}
                        className={segment===currentHash?"active":""} aria-current={segment===currentHash?"page":undefined}
                    />
                </Nav.Item>
            ))}
            {children}
      </MyNavbar>
      </div>
    );
};