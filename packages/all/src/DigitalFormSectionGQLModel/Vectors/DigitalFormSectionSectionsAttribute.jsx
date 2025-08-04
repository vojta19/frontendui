import { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"


/**
 * Inserts a SectionGQLModel item into a digitalformsection’s sections array and dispatches an update.
 *
 * @param {Object} digitalformsection - The current digitalformsection object containing a `sections` array.
 * @param {Object} sectionItem - The item to insert; must have `__typename === "SectionGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSectionSectionItemInsert = (digitalformsection, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalformsection;
        const newDigitalFormSectionSectionItems = [...sections, sectionItem];
        const newDigitalFormSection = { ...others, sections: newDigitalFormSectionSectionItems };
        dispatch(ItemActions.item_update(newDigitalFormSection));
    }
};

/**
 * Replaces an existing SectionGQLModel item in a digitalformsection’s sections array and dispatches an update.
 *
 * @param {Object} digitalformsection - The current digitalformsection object containing a `sections` array.
 * @param {Object} sectionItem - The updated item; must have `__typename === "SectionGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSectionSectionItemUpdate = (digitalformsection, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalformsection;
        const newDigitalFormSectionSectionItems = sections.map(item =>
            item.id === sectionItem.id ? sectionItem : item
        );
        const newDigitalFormSection = { ...others, sections: newDigitalFormSectionSectionItems };
        dispatch(ItemActions.item_update(newDigitalFormSection));
    }
};

/**
 * Removes a SectionGQLModel item from a digitalformsection’s sections array by its `id` and dispatches an update.
 *
 * @param {Object} digitalformsection - The current digitalformsection object containing a `sections` array.
 * @param {Object} sectionItem - The item to delete; must have `__typename === "SectionGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSectionSectionItemDelete = (digitalformsection, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalformsection;
        const newDigitalFormSectionSectionItems = sections.filter(
            item => item.id !== sectionItem.id
        );
        const newDigitalFormSection = { ...others, sections: newDigitalFormSectionSectionItems };
        dispatch(ItemActions.item_update(newDigitalFormSection));
    }
};

const DigitalFormSectionSectionsAttributeQuery = `
query DigitalFormSectionQueryRead($id: UUID!, $where: SectionInputFilter, $skip: Int, $limit: Int) {
    result: digitalformsectionById(id: $id) {
        __typename
        id
        sections(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
            # ...SectionMedium
        }
    }
}
`

const DigitalFormSectionSectionsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(DigitalFormSectionSectionsAttributeQuery,
        //SectionMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("sections")
)


/**
 * A component for displaying the `sections` attribute of a digitalformsection entity.
 *
 * This component checks if the `sections` attribute exists on the `digitalformsection` object. If `sections` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `sections` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSectionSectionsAttribute component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {Array<Object>} [props.digitalformsection.sections] - An array of section items associated with the digitalformsection entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the sections array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `sections` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const digitalformsectionEntity = { 
 *   sections: [
 *     { id: 1, name: "Section Item 1" }, 
 *     { id: 2, name: "Section Item 2" }
 *   ] 
 * };
 * <DigitalFormSectionSectionsAttribute digitalformsection={digitalformsectionEntity} />
 *
 * @example
 * // With a custom filter:
 * <DigitalFormSectionSectionsAttribute 
 *   digitalformsection={digitalformsectionEntity}
 *   filter={section => section.name.includes("1")}
 * />
 */
export const DigitalFormSectionSectionsAttribute_old = ({digitalformsection, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { sections: unfiltered } = digitalformsection
    if (typeof unfiltered === 'undefined') return null
    const sections = unfiltered.filter(filter)
    if (sections.length === 0) return null
    return (
        <>
            {sections.map(
                section => <Visualiser id={section.id} key={section.id} section={section} />
            )}
        </>
    )
}

/**
 * Visualiser component for displaying a list of section items using `DigitalFormSectionSectionsAttribute`.
 *
 * Wraps the `DigitalFormSectionSectionsAttribute` component, passing the given `items` as the `sections` attribute
 * on a synthetic `digitalformsection` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of section items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `DigitalFormSectionSectionsAttribute` (e.g., `filter`).
 *
 * @returns {JSX.Element|null} Rendered list of sections or `null` if none are provided.
 *
 * @example
 * <SectionsVisualiser
 *   items={[
 *     { id: 1, name: "Section 1" },
 *     { id: 2, name: "Section 2" }
 *   ]}
 *   filter={v => v.name.includes("1")}
 * />
 */
const SectionsVisualiser = ({ items, ...props }) => 
    <DigitalFormSectionSectionsAttribute_old {...props} digitalformsection={{ sections: items }} />

/**
 * Infinite-scrolling component for the `sections` attribute of a digitalformsection entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `sections` array
 * associated with the provided `digitalformsection` object. It utilizes `SectionsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.digitalformsection - The digitalformsection entity containing the `sections` array.
 * @param {Array<Object>} [props.digitalformsection.sections] - (Optional) Preloaded section items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `SectionsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of sections.
 *
 * @example
 * <DigitalFormSectionSectionsAttributeInfinite
 *   digitalformsection={{
 *     sections: [
 *       { id: 1, name: "Section 1" },
 *       { id: 2, name: "Section 2" }
 *     ]
 *   }}
 * />
 */
export const DigitalFormSectionSectionsAttributeInfinite = ({digitalformsection, actionParams={}, ...props}) => { 
    const {sections} = digitalformsection

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={SectionsVisualiser} 
            preloadedItems={sections}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={DigitalFormSectionSectionsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `sections` from a `digitalformsection` entity.
 *
 * This component uses the `DigitalFormSectionSectionsAttributeAsyncAction` to asynchronously fetch
 * the `digitalformsection.sections` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each section item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalformsection - The digitalformsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `sections` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered sections or a loading/error placeholder.
 *
 * @example
 * <DigitalFormSectionSectionsAttributeLazy digitalformsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormSectionSectionsAttributeLazy
 *   digitalformsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormSectionSectionsAttributeLazy = ({digitalformsection, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormSectionSectionsAttributeAsyncAction, digitalformsection, {deferred: true})
    useEffect(() => {
        fetch(digitalformsection)
    }, [digitalformsection])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormSectionSectionsAttribute_old digitalformsection={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({section, children}) => <div>
    Probably {'<SectionMediumCard section={section} />'} <br />
    <pre>{JSON.stringify(section, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `sections` attribute of a digitalformsection entity.
 *
 * Applies an optional filter function to the sections array before rendering.
 * Supports infinite scrolling to load more items lazily.
 *
 * The `Layout` prop is used as a wrapper component for each rendered item and
 * is consistently applied in both static and infinite scroll rendering modes.
 * If different layouts are desired for infinite vs static modes,
 * consider conditionally passing different `Layout` props.
 *
 * @param {object} props - Component props.
 * @param {object} props.digitalformsection - The digitalformsection entity containing the `sections` array.
 * @param {Array<object>} [props.digitalformsection.sections] - Array of section items to render.
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv] - Component to render each section item.
 *   Receives `section` and optionally other props.
 * @param {boolean} [props.infinite=true] - Whether to enable infinite scrolling.
 * @param {React.ComponentType|string} [props.Layout=Col] - Wrapper component for each rendered item.
 *   This component is used consistently for both static rendering and infinite scroll loading.
 * @param {Function} [props.filter=Boolean] - Filter function to apply on sections before rendering.
 * @param {...any} props - Additional props forwarded to `Visualiser` and `InfiniteScroll`.
 *
 * @returns {JSX.Element|null} Rendered list or infinite scroll component, or null if no sections.
 *
 * @example
 * <DigitalFormSectionSectionsAttribute
 *   digitalformsection={digitalformsection}
 *   Visualiser={SectionMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const DigitalFormSectionSectionsAttribute = ({
    digitalformsection,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { sections: unfiltered } = digitalformsection
    if (typeof unfiltered === 'undefined') return null
    const sections = unfiltered.filter(filter)
    if (sections.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <DigitalFormSectionSectionsAttribute 
                {...props}    
                digitalformsection={{sections: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...digitalformsection, skip: 0, limit: 10 }}
                asyncAction={DigitalFormSectionSectionsAttributeAsyncAction}
                {...props}
                Visualiser={VisualiserWrapper}
                preloadedItems={sections}
            />
        );
    }

    return (
        <>
        {sections.map((section) => (
            <Layout key={section.id}>
                {section && <Visualiser {...props} section={section} />}
            </Layout>
        ))}
        </>
    );
};