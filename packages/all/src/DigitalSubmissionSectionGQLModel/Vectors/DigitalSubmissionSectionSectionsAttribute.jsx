import { useEffect, useMemo, useState, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionSectionLargeContent } from "../Components/DigitalSubmissionSectionLargeContent";


/**
 * Inserts a SectionGQLModel item into a digitalsubmissionsection’s sections array and dispatches an update.
 *
 * @param {Object} digitalsubmissionsection - The current digitalsubmissionsection object containing a `sections` array.
 * @param {Object} sectionItem - The item to insert; must have `__typename === "SectionGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionSectionSectionItemInsert = (digitalsubmissionsection, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalsubmissionsection;
        const newDigitalSubmissionSectionSectionItems = [...sections, sectionItem];
        const newDigitalSubmissionSection = { ...others, sections: newDigitalSubmissionSectionSectionItems };
        dispatch(ItemActions.item_update(newDigitalSubmissionSection));
    }
};

/**
 * Replaces an existing SectionGQLModel item in a digitalsubmissionsection’s sections array and dispatches an update.
 *
 * @param {Object} digitalsubmissionsection - The current digitalsubmissionsection object containing a `sections` array.
 * @param {Object} sectionItem - The updated item; must have `__typename === "SectionGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionSectionSectionItemUpdate = (digitalsubmissionsection, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalsubmissionsection;
        const newDigitalSubmissionSectionSectionItems = sections.map(item =>
            item.id === sectionItem.id ? sectionItem : item
        );
        const newDigitalSubmissionSection = { ...others, sections: newDigitalSubmissionSectionSectionItems };
        dispatch(ItemActions.item_update(newDigitalSubmissionSection));
    }
};

/**
 * Removes a SectionGQLModel item from a digitalsubmissionsection’s sections array by its `id` and dispatches an update.
 *
 * @param {Object} digitalsubmissionsection - The current digitalsubmissionsection object containing a `sections` array.
 * @param {Object} sectionItem - The item to delete; must have `__typename === "SectionGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpDigitalSubmissionSectionSectionItemDelete = (digitalsubmissionsection, sectionItem, dispatch) => {
    const { __typename } = sectionItem;
    if (__typename === "SectionGQLModel") {
        const { sections, ...others } = digitalsubmissionsection;
        const newDigitalSubmissionSectionSectionItems = sections.filter(
            item => item.id !== sectionItem.id
        );
        const newDigitalSubmissionSection = { ...others, sections: newDigitalSubmissionSectionSectionItems };
        dispatch(ItemActions.item_update(newDigitalSubmissionSection));
    }
};

const DigitalSubmissionSectionSectionsAttributeQuery = `
query DigitalSubmissionSectionQueryRead($id: UUID!, $where: SectionInputFilter, $skip: Int, $limit: Int) {
    result: digitalsubmissionsectionById(id: $id) {
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

const DigitalSubmissionSectionSectionsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(DigitalSubmissionSectionSectionsAttributeQuery,
        //SectionMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("sections")
)


/**
 * A component for displaying the `sections` attribute of a digitalsubmissionsection entity.
 *
 * This component checks if the `sections` attribute exists on the `digitalsubmissionsection` object. If `sections` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `sections` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the DigitalSubmissionSectionSectionsAttribute component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {Array<Object>} [props.digitalsubmissionsection.sections] - An array of section items associated with the digitalsubmissionsection entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the sections array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `sections` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const digitalsubmissionsectionEntity = { 
 *   sections: [
 *     { id: 1, name: "Section Item 1" }, 
 *     { id: 2, name: "Section Item 2" }
 *   ] 
 * };
 * <DigitalSubmissionSectionSectionsAttribute digitalsubmissionsection={digitalsubmissionsectionEntity} />
 *
 * @example
 * // With a custom filter:
 * <DigitalSubmissionSectionSectionsAttribute 
 *   digitalsubmissionsection={digitalsubmissionsectionEntity}
 *   filter={section => section.name.includes("1")}
 * />
 */
export const DigitalSubmissionSectionSectionsAttribute_old = ({digitalsubmissionsection, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { sections: unfiltered } = digitalsubmissionsection
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
 * Visualiser component for displaying a list of section items using `DigitalSubmissionSectionSectionsAttribute`.
 *
 * Wraps the `DigitalSubmissionSectionSectionsAttribute` component, passing the given `items` as the `sections` attribute
 * on a synthetic `digitalsubmissionsection` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of section items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `DigitalSubmissionSectionSectionsAttribute` (e.g., `filter`).
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
    <DigitalSubmissionSectionSectionsAttribute_old {...props} digitalsubmissionsection={{ sections: items }} />

/**
 * Infinite-scrolling component for the `sections` attribute of a digitalsubmissionsection entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `sections` array
 * associated with the provided `digitalsubmissionsection` object. It utilizes `SectionsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.digitalsubmissionsection - The digitalsubmissionsection entity containing the `sections` array.
 * @param {Array<Object>} [props.digitalsubmissionsection.sections] - (Optional) Preloaded section items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `SectionsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of sections.
 *
 * @example
 * <DigitalSubmissionSectionSectionsAttributeInfinite
 *   digitalsubmissionsection={{
 *     sections: [
 *       { id: 1, name: "Section 1" },
 *       { id: 2, name: "Section 2" }
 *     ]
 *   }}
 * />
 */
export const DigitalSubmissionSectionSectionsAttributeInfinite = ({digitalsubmissionsection, actionParams={}, ...props}) => { 
    const {sections} = digitalsubmissionsection

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={SectionsVisualiser} 
            preloadedItems={sections}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={DigitalSubmissionSectionSectionsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `sections` from a `digitalsubmissionsection` entity.
 *
 * This component uses the `DigitalSubmissionSectionSectionsAttributeAsyncAction` to asynchronously fetch
 * the `digitalsubmissionsection.sections` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each section item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.digitalsubmissionsection - The digitalsubmissionsection entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `sections` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered sections or a loading/error placeholder.
 *
 * @example
 * <DigitalSubmissionSectionSectionsAttributeLazy digitalsubmissionsection={{ id: "abc123" }} />
 *
 * 
 * @example
 * <DigitalSubmissionSectionSectionsAttributeLazy
 *   digitalsubmissionsection={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const DigitalSubmissionSectionSectionsAttributeLazy = ({digitalsubmissionsection, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(DigitalSubmissionSectionSectionsAttributeAsyncAction, digitalsubmissionsection, {deferred: true})
    useEffect(() => {
        fetch(digitalsubmissionsection)
    }, [digitalsubmissionsection])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <DigitalSubmissionSectionSectionsAttribute_old digitalsubmissionsection={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({section, children}) => <div>
    Probably {'<SectionMediumCard section={section} />'} <br />
    <pre>{JSON.stringify(section, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `sections` attribute of a digitalsubmissionsection entity.
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
 * @param {object} props.digitalsubmissionsection - The digitalsubmissionsection entity containing the `sections` array.
 * @param {Array<object>} [props.digitalsubmissionsection.sections] - Array of section items to render.
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
 * <DigitalSubmissionSectionSectionsAttribute
 *   digitalsubmissionsection={digitalsubmissionsection}
 *   Visualiser={SectionMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const DigitalSubmissionSectionSectionsAttribute_ = ({
    digitalsubmissionsection,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { sections: unfiltered } = digitalsubmissionsection
    if (typeof unfiltered === 'undefined') return null
    const sections = unfiltered.filter(filter)
    if (sections.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <DigitalSubmissionSectionSectionsAttribute 
                {...props}    
                digitalsubmissionsection={{sections: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...digitalsubmissionsection, skip: 0, limit: 10 }}
                asyncAction={DigitalSubmissionSectionSectionsAttributeAsyncAction}
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

const groupFieldsByFormFieldOrdered = (sections) => {
    const groupMap = new Map();

    for (const section of sections) {
        const formSection = section?.formSection;
        const id = formSection?.id;
        if (!id) continue;

        if (!groupMap.has(id)) {
        groupMap.set(id, {
            formSection,
            items: []
        });
        }

        groupMap.get(id).items.push(section);
    }

    // Seřadíme záznamy podle formField.order (vzestupně)
    const sorted = [...groupMap.values()].sort((a, b) => {
        const aOrder = a.formSection?.order ?? 0;
        const bOrder = b.formSection?.order ?? 0;
        return aOrder - bOrder;
    });

    return sorted;
}


const useContainerWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

export const DigitalSubmissionSections = ({ sections }) => {
    const [rowRef, width] = useContainerWidth();
    const grouped = useMemo(() => groupFieldsByFormFieldOrdered(sections), [sections]);

    const isNarrow = width < 2000;
    return (
        <div ref={rowRef}>"DigitalSubmissionSections"
            {/* <pre>{JSON.stringify(sections, null, 4)}</pre> */}
            <br/>{grouped.map(({formSection, items}) => (
            <Row key={formSection?.id}>
                <Col md={isNarrow ? 12 : 3} xs={12}>
                    <strong>{formSection?.label || formSection?.name}</strong>
                    {/* <pre>{JSON.stringify(formSection, null, 2)}</pre> */}
                </Col>
                <Col md={isNarrow ? 12 : 9} xs={12}>
                    {items.length > 1 && items.map((section, index) => {
                        <div key={section.id} >
                            <strong>[{index + 1}]</strong><br/>
                        <DigitalSubmissionSectionLargeContent key={section.id} digitalsubmissionsection={section}/>
                        </div>
                    })}
                    {items.length === 1 && (
                        <DigitalSubmissionSectionLargeContent digitalsubmissionsection={items[0]}/>
                    )}
                </Col>
            </Row>
        ))}
    </div>
    )
}

export const DigitalSubmissionSectionSectionsAttribute = ({ digitalsubmissionsection }) => {
    const {sections = []} = digitalsubmissionsection;
    return (
        <DigitalSubmissionSections sections={sections} />
    )
}
