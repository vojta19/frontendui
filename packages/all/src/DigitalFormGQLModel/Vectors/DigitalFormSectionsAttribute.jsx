import { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"


/**
 * Inserts a SectionGQLModel item into a digitalform’s sections array and dispatches an update.
 *
 * @param {Object} digitalform - The current digitalform object containing a `sections` array.
 * @param {Object} sectionItem - The item to insert; must have `__typename === "SectionGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSectionItemInsert = (digitalform, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalform;
        const newDigitalFormSectionItems = [...sections, sectionItem];
        const newDigitalForm = { ...others, sections: newDigitalFormSectionItems };
        dispatch(ItemActions.item_update(newDigitalForm));
    }
};

/**
 * Replaces an existing SectionGQLModel item in a digitalform’s sections array and dispatches an update.
 *
 * @param {Object} digitalform - The current digitalform object containing a `sections` array.
 * @param {Object} sectionItem - The updated item; must have `__typename === "SectionGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSectionItemUpdate = (digitalform, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalform;
        const newDigitalFormSectionItems = sections.map(item =>
            item.id === sectionItem.id ? sectionItem : item
        );
        const newDigitalForm = { ...others, sections: newDigitalFormSectionItems };
        dispatch(ItemActions.item_update(newDigitalForm));
    }
};

/**
 * Removes a SectionGQLModel item from a digitalform’s sections array by its `id` and dispatches an update.
 *
 * @param {Object} digitalform - The current digitalform object containing a `sections` array.
 * @param {Object} sectionItem - The item to delete; must have `__typename === "SectionGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalFormSectionItemDelete = (digitalform, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalform;
        const newDigitalFormSectionItems = sections.filter(
            item => item.id !== sectionItem.id
        );
        const newDigitalForm = { ...others, sections: newDigitalFormSectionItems };
        dispatch(ItemActions.item_update(newDigitalForm));
    }
};

const DigitalFormSectionsAttributeQuery = `
query DigitalFormQueryRead($id: UUID!, $where: SectionInputFilter, $skip: Int, $limit: Int) {
    result: digitalformById(id: $id) {
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

const DigitalFormSectionsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(DigitalFormSectionsAttributeQuery,
        //SectionMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("sections")
)


/**
 * A component for displaying the `sections` attribute of a digitalform entity.
 *
 * This component checks if the `sections` attribute exists on the `digitalform` object. If `sections` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `sections` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the DigitalFormSectionsAttribute component.
 * @param {Object} props.digitalform - The object representing the digitalform entity.
 * @param {Array<Object>} [props.digitalform.sections] - An array of section items associated with the digitalform entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the sections array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `sections` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const digitalformEntity = { 
 *   sections: [
 *     { id: 1, name: "Section Item 1" }, 
 *     { id: 2, name: "Section Item 2" }
 *   ] 
 * };
 * <DigitalFormSectionsAttribute digitalform={digitalformEntity} />
 *
 * @example
 * // With a custom filter:
 * <DigitalFormSectionsAttribute 
 *   digitalform={digitalformEntity}
 *   filter={section => section.name.includes("1")}
 * />
 */
export const DigitalFormSectionsAttribute_old = ({digitalform, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { sections: unfiltered } = digitalform
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
 * Visualiser component for displaying a list of section items using `DigitalFormSectionsAttribute`.
 *
 * Wraps the `DigitalFormSectionsAttribute` component, passing the given `items` as the `sections` attribute
 * on a synthetic `digitalform` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of section items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `DigitalFormSectionsAttribute` (e.g., `filter`).
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
    <DigitalFormSectionsAttribute_old {...props} digitalform={{ sections: items }} />

/**
 * Infinite-scrolling component for the `sections` attribute of a digitalform entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `sections` array
 * associated with the provided `digitalform` object. It utilizes `SectionsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.digitalform - The digitalform entity containing the `sections` array.
 * @param {Array<Object>} [props.digitalform.sections] - (Optional) Preloaded section items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `SectionsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of sections.
 *
 * @example
 * <DigitalFormSectionsAttributeInfinite
 *   digitalform={{
 *     sections: [
 *       { id: 1, name: "Section 1" },
 *       { id: 2, name: "Section 2" }
 *     ]
 *   }}
 * />
 */
export const DigitalFormSectionsAttributeInfinite = ({digitalform, actionParams={}, ...props}) => { 
    const {sections} = digitalform

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={SectionsVisualiser} 
            preloadedItems={sections}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={DigitalFormSectionsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `sections` from a `digitalform` entity.
 *
 * This component uses the `DigitalFormSectionsAttributeAsyncAction` to asynchronously fetch
 * the `digitalform.sections` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each section item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalform - The digitalform entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `sections` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered sections or a loading/error placeholder.
 *
 * @example
 * <DigitalFormSectionsAttributeLazy digitalform={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalFormSectionsAttributeLazy
 *   digitalform={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalFormSectionsAttributeLazy = ({digitalform, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalFormSectionsAttributeAsyncAction, digitalform, {deferred: true})
    useEffect(() => {
        fetch(digitalform)
    }, [digitalform])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalFormSectionsAttribute_old digitalform={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({section, children}) => <div>
    Probably {'<SectionMediumCard section={section} />'} <br />
    <pre>{JSON.stringify(section, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `sections` attribute of a digitalform entity.
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
 * @param {object} props.digitalform - The digitalform entity containing the `sections` array.
 * @param {Array<object>} [props.digitalform.sections] - Array of section items to render.
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
 * <DigitalFormSectionsAttribute
 *   digitalform={digitalform}
 *   Visualiser={SectionMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const DigitalFormSectionsAttribute = ({
    digitalform,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { sections: unfiltered } = digitalform
    if (typeof unfiltered === 'undefined') return null
    const sections = unfiltered.filter(filter)
    if (sections.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <DigitalFormSectionsAttribute 
                {...props}    
                digitalform={{sections: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...digitalform, skip: 0, limit: 10 }}
                asyncAction={DigitalFormSectionsAttributeAsyncAction}
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