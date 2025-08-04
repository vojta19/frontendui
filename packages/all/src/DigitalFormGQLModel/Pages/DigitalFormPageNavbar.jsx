import Nav from 'react-bootstrap/Nav'
import { ProxyLink, MyNavbar, useHash } from '@hrbolek/uoisfrontend-shared';

import { DigitalFormURI } from '../Components'

/**
 * Allow to use HashContainer for determination which component at page will be rendered.
 * That must be manually inserted at DigitalFormPageContent, usually this should be done 
 * as children of DigitalFormLargeCard.
 * <DigitalFormLargeCard>
 *     <HashContainer>
 *         <VectorA id="history"/>
 *         <VectorB id="roles"/>
 *         <VectorC id="graph"/>
 *     </HashContainer>
 * </DigitalFormLargeCard>
 * it is usefull to define globally active "areas" like science, administration, teaching, ...
 */
const DigitalFormPageSegments = [
    { segment: 'education', label: 'Výuka'},
    { segment: 'reaserach', label: 'Tvůrčí činnost' },
    { segment: 'administration', label: 'Organizační činnost' },
    { segment: 'development', label: 'Rozvoj' },
]

/**
 * A navigation button component that generates a URL based on the digitalform's ID and a specific segment.
 * The button uses a `ProxyLink` to navigate while preserving hash and query parameters.
 *
 * ### Features:
 * - Dynamically constructs the URL with a hash fragment pointing to the specified segment.
 * - Displays a label for the navigation link.
 * - Integrates seamlessly with `ProxyLink` for enhanced navigation.
 *
 * @component
 * @param {Object} props - The properties for the TitleNavButton component.
 * @param {Object} props.digitalform - The digitalform object containing details about the digitalform.
 * @param {string|number} props.digitalform.id - The unique identifier for the digitalform.
 * @param {string} props.segment - The segment to append as a hash fragment in the URL.
 * @param {string} props.label - The text to display as the label for the navigation button.
 *
 * @returns {JSX.Element} A styled navigation button linking to the constructed URL.
 *
 * @example
 * // Example 1: Basic usage with a digitalform and segment
 * const digitalform = { id: 123 };
 * const segment = "details";
 * const label = "View Details";
 *
 * <TitleNavButton digitalform={digitalform} segment={segment} label={label} />
 * // Resulting URL: `/ug/digitalform/view/123#details`
 *
 * @example
 * // Example 2: Different segment and label
 * <TitleNavButton digitalform={{ id: 456 }} segment="settings" label="DigitalForm Settings" />
 * // Resulting URL: `/ug/digitalform/view/456#settings`
 */
const TitleNavButton = ({ digitalform, segment, label, ...props }) => {
    // const urlbase = (segment) => `/digitalforms/digitalform/${segment}/${digitalform?.id}`;
    const urlbase = (segment) => `${DigitalFormURI}${digitalform?.id}#${segment}`;
    return (
        <Nav.Link as={"span"} {...props}>
            <ProxyLink to={urlbase(segment)}>{label}</ProxyLink>
        </Nav.Link>
    );
};

/**
 * Renders the navigation bar for an DigitalForm page.
 *
 * This component uses a custom hook, `useHash()`, to determine the current hash
 * and highlights the active segment. It displays a navigation bar (using MyNavbar)
 * with several segments (e.g. "history", "roles", "graph"), each rendered as a 
 * TitleNavButton. The segments are hardcoded in this component and only rendered 
 * if an `digitalform` object is provided.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Object} props.digitalform - The digitalform entity object that provides context for the page.
 * @param {string|number} props.digitalform.id - The unique identifier for the digitalform.
 * @param {Function} props.onSearchChange - Callback function to handle changes in the search input.
 *
 * @returns {JSX.Element} The rendered DigitalFormPageNavbar component.
 *
 * @example
 * // Example usage:
 * const digitalform = { id: 123, ... };
 * <DigitalFormPageNavbar digitalform={digitalform} onSearchChange={handleSearchChange} />
 */
export const DigitalFormPageNavbar = ({ digitalform, children, onSearchChange }) => {
    const [currentHash, setHash] = useHash(); // Use the custom hook to manage hash
    
    return (
        <div className='screen-only'>
        <MyNavbar onSearchChange={onSearchChange} >
            {digitalform && DigitalFormPageSegments.map(({ segment, label }) => (
                <Nav.Item key={segment} >
                    <TitleNavButton
                        digitalform={digitalform}
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