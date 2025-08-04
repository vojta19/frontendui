import { use, useEffect } from "react";
import { Col } from "react-bootstrap";

import { useAsyncAction, createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { ErrorHandler, InfiniteScroll, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

import { MembershipMediumFragment } from "../../MembershipGQLModel"
/**
 * Inserts a MembershipGQLModel item into a group’s memberships array and dispatches an update.
 *
 * @param {Object} group - The current group object containing a `memberships` array.
 * @param {Object} membershipItem - The item to insert; must have `__typename === "MembershipGQLModel"`.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpGroupMembershipItemInsert = (group, membershipItem, dispatch) => {
    const { __typename } = membershipItem;
    if (__typename === "MembershipGQLModel") {
        const { memberships, ...others } = group;
        const newGroupMembershipItems = [...memberships, membershipItem];
        const newGroup = { ...others, memberships: newGroupMembershipItems };
        dispatch(ItemActions.item_update(newGroup));
    }
};

/**
 * Replaces an existing MembershipGQLModel item in a group’s memberships array and dispatches an update.
 *
 * @param {Object} group - The current group object containing a `memberships` array.
 * @param {Object} membershipItem - The updated item; must have `__typename === "MembershipGQLModel"` and an `id` field matching an existing item.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpGroupMembershipItemUpdate = (group, membershipItem, dispatch) => {
    const { __typename } = membershipItem;
    if (__typename === "MembershipGQLModel") {
        const { memberships, ...others } = group;
        const newGroupMembershipItems = memberships.map(item =>
            item.id === membershipItem.id ? membershipItem : item
        );
        const newGroup = { ...others, memberships: newGroupMembershipItems };
        dispatch(ItemActions.item_update(newGroup));
    }
};

/**
 * Removes a MembershipGQLModel item from a group’s memberships array by its `id` and dispatches an update.
 *
 * @param {Object} group - The current group object containing a `memberships` array.
 * @param {Object} membershipItem - The item to delete; must have `__typename === "MembershipGQLModel"` and an `id` field.
 * @param {Function} dispatch - Redux dispatch function (or similar) to call the update action.
 */
const followUpGroupMembershipItemDelete = (group, membershipItem, dispatch) => {
    const { __typename } = membershipItem;
    if (__typename === "MembershipGQLModel") {
        const { memberships, ...others } = group;
        const newGroupMembershipItems = memberships.filter(
            item => item.id !== membershipItem.id
        );
        const newGroup = { ...others, memberships: newGroupMembershipItems };
        dispatch(ItemActions.item_update(newGroup));
    }
};

const GroupMembershipsAttributeQuery = `
query GroupQueryRead($id: UUID!, $where: MembershipInputWhereFilter, $skip: Int, $limit: Int) {
    result: groupById(id: $id) {
        __typename
        id
        memberships(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
            ...MembershipMediumFragment
        }
    }
}
`

const GroupMembershipsAttributeAsyncAction = createAsyncGraphQLAction(
    createQueryStrLazy(GroupMembershipsAttributeQuery,
        MembershipMediumFragment
    ),
    processVectorAttributeFromGraphQLResult("memberships")
)


/**
 * A component for displaying the `memberships` attribute of a group entity.
 *
 * This component checks if the `memberships` attribute exists on the `group` object. If `memberships` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the (optionally filtered) `memberships` array
 * and displays a placeholder message and a JSON representation for each item.
 *
 * @component
 * @param {Object} props - The props for the GroupMembershipsAttribute component.
 * @param {Object} props.group - The object representing the group entity.
 * @param {Array<Object>} [props.group.memberships] - An array of membership items associated with the group entity.
 *   Each item is expected to have a unique `id` property.
 * @param {Function} [props.filter=Boolean] - (Optional) A function to filter the memberships array before rendering.
 *
 * @returns {JSX.Element|null} A JSX element displaying the (filtered) `memberships` items or `null` if the attribute is undefined or empty.
 *
 * @example
 * // Basic usage:
 * const groupEntity = { 
 *   memberships: [
 *     { id: 1, name: "Membership Item 1" }, 
 *     { id: 2, name: "Membership Item 2" }
 *   ] 
 * };
 * <GroupMembershipsAttribute group={groupEntity} />
 *
 * @example
 * // With a custom filter:
 * <GroupMembershipsAttribute 
 *   group={groupEntity}
 *   filter={membership => membership.name.includes("1")}
 * />
 */
export const GroupMembershipsAttribute_old = ({group, filter=Boolean, Visualiser=TrivialVisualiserDiv}) => {
    const { memberships: unfiltered } = group
    if (typeof unfiltered === 'undefined') return null
    const memberships = unfiltered.filter(filter)
    if (memberships.length === 0) return null
    return (
        <>
            {memberships.map(
                membership => <Visualiser id={membership.id} key={membership.id} membership={membership} />
            )}
        </>
    )
}

/**
 * Visualiser component for displaying a list of membership items using `GroupMembershipsAttribute`.
 *
 * Wraps the `GroupMembershipsAttribute` component, passing the given `items` as the `memberships` attribute
 * on a synthetic `group` object. All other props are forwarded.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.items - The array of membership items to be visualized.
 * @param {...any} [props] - Additional props forwarded to `GroupMembershipsAttribute` (e.g., `filter`).
 *
 * @returns {JSX.Element|null} Rendered list of memberships or `null` if none are provided.
 *
 * @example
 * <MembershipsVisualiser
 *   items={[
 *     { id: 1, name: "Membership 1" },
 *     { id: 2, name: "Membership 2" }
 *   ]}
 *   filter={v => v.name.includes("1")}
 * />
 */
const MembershipsVisualiser = ({ items, ...props }) => 
    <GroupMembershipsAttribute_old {...props} group={{ memberships: items }} />

/**
 * Infinite-scrolling component for the `memberships` attribute of a group entity.
 *
 * Uses the generic `InfiniteScroll` component to fetch, merge, and display the `memberships` array
 * associated with the provided `group` object. It utilizes `MembershipsVisualiser` for rendering,
 * and handles pagination, lazy-loading, and merging of items as the user scrolls.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.group - The group entity containing the `memberships` array.
 * @param {Array<Object>} [props.group.memberships] - (Optional) Preloaded membership items.
 * @param {Object} [props.actionParams={}] - Optional extra parameters for the async fetch action (merged with pagination).
 * @param {...any} [props] - Additional props passed to `InfiniteScroll` or `MembershipsVisualiser`.
 *
 * @returns {JSX.Element} An infinite-scrolling list of memberships.
 *
 * @example
 * <GroupMembershipsAttributeInfinite
 *   group={{
 *     memberships: [
 *       { id: 1, name: "Membership 1" },
 *       { id: 2, name: "Membership 2" }
 *     ]
 *   }}
 * />
 */
export const GroupMembershipsAttributeInfinite = ({group, actionParams={}, ...props}) => { 
    const {memberships} = group

    return (
        <InfiniteScroll 
            {...props}
            Visualiser={MembershipsVisualiser} 
            preloadedItems={memberships}
            actionParams={{...actionParams, skip: 0, limit: 10}}
            asyncAction={GroupMembershipsAttributeAsyncAction}
        />
    )
}

/**
 * A lazy-loading component for displaying filtered `memberships` from a `group` entity.
 *
 * This component uses the `GroupMembershipsAttributeAsyncAction` to asynchronously fetch
 * the `group.memberships` data. It shows a loading spinner while fetching, handles errors,
 * and filters the resulting list using a custom `filter` function (defaults to `Boolean` to remove falsy values).
 *
 * Each membership item is rendered as a `<div>` with its `id` as both the `key` and the `id` attribute,
 * and displays a formatted JSON preview using `<pre>`.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.group - The group entity or identifying query variables used to fetch it.
 * @param {Function} [props.filter=Boolean] - A filtering function applied to the `memberships` array before rendering.
 *
 * @returns {JSX.Element} A rendered list of filtered memberships or a loading/error placeholder.
 *
 * @example
 * <GroupMembershipsAttributeLazy group={{ id: "abc123" }} />
 *
 * 
 * @example
 * <GroupMembershipsAttributeLazy
 *   group={{ id: "abc123" }}
 *   filter={(v) => v.status === "active"}
 * />
 */
export const GroupMembershipsAttributeLazy = ({group, filter=Boolean, ...props}) => {
    const {loading, error, entity, fetch} = useAsyncAction(GroupMembershipsAttributeAsyncAction, group, {deferred: true})
    useEffect(() => {
        fetch(group)
    }, [group])

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorHandler errors={error} />

    return <GroupMembershipsAttribute_old group={entity} filter={filter} {...props}/>    
}

const TrivialVisualiserDiv = ({membership, children}) => <div>
    Probably {'<MembershipMediumCard membership={membership} />'} <br />
    <pre>{JSON.stringify(membership, null, 4)}</pre>
    {children}
</div>

/**
 * Component to render the filtered `memberships` attribute of a group entity.
 *
 * Applies an optional filter function to the memberships array before rendering.
 * Supports infinite scrolling to load more items lazily.
 *
 * The `Layout` prop is used as a wrapper component for each rendered item and
 * is consistently applied in both static and infinite scroll rendering modes.
 * If different layouts are desired for infinite vs static modes,
 * consider conditionally passing different `Layout` props.
 *
 * @param {object} props - Component props.
 * @param {object} props.group - The group entity containing the `memberships` array.
 * @param {Array<object>} [props.group.memberships] - Array of membership items to render.
 * @param {React.ComponentType} [props.Visualiser=TrivialVisualiserDiv] - Component to render each membership item.
 *   Receives `membership` and optionally other props.
 * @param {boolean} [props.infinite=true] - Whether to enable infinite scrolling.
 * @param {React.ComponentType|string} [props.Layout=Col] - Wrapper component for each rendered item.
 *   This component is used consistently for both static rendering and infinite scroll loading.
 * @param {Function} [props.filter=Boolean] - Filter function to apply on memberships before rendering.
 * @param {...any} props - Additional props forwarded to `Visualiser` and `InfiniteScroll`.
 *
 * @returns {JSX.Element|null} Rendered list or infinite scroll component, or null if no memberships.
 *
 * @example
 * <GroupMembershipsAttribute
 *   group={group}
 *   Visualiser={MembershipMediumCard}
 *   Layout={Col}
 *   filter={(v) => v.active}
 *   infinite={true}
 * />
 */
export const GroupMembershipsAttribute = ({
    group,
    Visualiser = TrivialVisualiserDiv,
    infinite = true,
    Layout = Col, // 'list' | 'grid' | 'infinite'
    filter = Boolean,
    ...props
}) => {

    const { memberships: unfiltered } = group
    if (typeof unfiltered === 'undefined') return null
    const memberships = unfiltered.filter(filter)
    if (memberships.length === 0) return null



    if (infinite) {
        // Pro infinite scroll použijeme komponentu InfiniteScroll
        // Visualiser zde je komponenta, která přijímá pole položek (items)
        // a zobrazí je – proto vytvoříme wrapper, který předá Visualiser správně

        const VisualiserWrapper = ({ items }) => ( 
            <GroupMembershipsAttribute 
                {...props}    
                group={{memberships: items}} 
                Visualiser={Visualiser} 
                infinite={false} 
                Layout={Layout} 
                filter={filter}
            />
        );

        return (
            <InfiniteScroll
                actionParams={{ ...group, skip: 0, limit: 10 }}
                asyncAction={GroupMembershipsAttributeAsyncAction}
                {...props}
                Visualiser={VisualiserWrapper}
                preloadedItems={memberships}
            />
        );
    }

    return (
        <>
        {memberships.map((membership) => (
            <Layout key={membership?.id}>
                <Visualiser {...props} membership={membership} />
            </Layout>
        ))}
        </>
    );
};