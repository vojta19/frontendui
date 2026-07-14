import { useMemo } from "react";

import { CardCapsule } from "../../../../_template/src/Base/Components/CardCapsule";


/**
 * Color palette used cyclically for Sunburst sectors.
 *
 * @constant
 * @type {string[]}
 */
const COLORS = [
    "#0d6efd",
    "#198754",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#20c997",
    "#fd7e14",
    "#0dcaf0"
];


/**
 * Converts polar coordinates into Cartesian SVG coordinates.
 *
 * The angle is expressed in degrees and rotated by 90 degrees so that
 * zero degrees starts at the top of the diagram.
 *
 * @param {number} centerX
 * Horizontal coordinate of the diagram center.
 *
 * @param {number} centerY
 * Vertical coordinate of the diagram center.
 *
 * @param {number} radius
 * Distance from the diagram center.
 *
 * @param {number} angle
 * Angle in degrees.
 *
 * @returns {{x: number, y: number}}
 * Cartesian point corresponding to the supplied polar coordinates.
 *
 * @example
 * polarToCartesian(300, 300, 100, 90);
 *
 * // Returns a point located 100 pixels to the right of the center.
 */
const polarToCartesian = (
    centerX,
    centerY,
    radius,
    angle
) => {
    const angleInRadians =
        ((angle - 90) * Math.PI) / 180;

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    };
};


/**
 * Builds an SVG path describing an annular sector.
 *
 * The generated path contains an outer arc, a radial connection, an inner
 * arc and a closing segment. It is used to draw all non-root Sunburst nodes.
 *
 * @param {number} centerX
 * Horizontal coordinate of the diagram center.
 *
 * @param {number} centerY
 * Vertical coordinate of the diagram center.
 *
 * @param {number} innerRadius
 * Inner radius of the sector.
 *
 * @param {number} outerRadius
 * Outer radius of the sector.
 *
 * @param {number} startAngle
 * Starting angle in degrees.
 *
 * @param {number} endAngle
 * Ending angle in degrees.
 *
 * @returns {string}
 * SVG path definition suitable for the `d` attribute of a path element.
 */
const describeArc = (
    centerX,
    centerY,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle
) => {
    const largeArcFlag =
        endAngle - startAngle <= 180 ? "0" : "1";

    const outerEnd = polarToCartesian(
        centerX,
        centerY,
        outerRadius,
        endAngle
    );

    const outerStart = polarToCartesian(
        centerX,
        centerY,
        outerRadius,
        startAngle
    );

    const innerStart = polarToCartesian(
        centerX,
        centerY,
        innerRadius,
        startAngle
    );

    const innerEnd = polarToCartesian(
        centerX,
        centerY,
        innerRadius,
        endAngle
    );

    return [
        `M ${outerEnd.x} ${outerEnd.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerStart.x} ${outerStart.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
        "Z"
    ].join(" ");
};


/**
 * Resolves the preferred display label of a finance node.
 *
 * The function checks commonly used title properties in priority order and
 * falls back to the entity identifier or a generic label.
 *
 * @param {Object|null|undefined} node
 * Finance or hierarchy node.
 *
 * @returns {string}
 * Human-readable node label.
 */
const getNodeLabel = (node) => {
    return (
        node?.name ||
        node?.nameEn ||
        node?.label ||
        node?.title ||
        node?.typename ||
        node?.__typename ||
        node?.id ||
        "node"
    );
};


/**
 * Resolves an application URL for a finance node.
 *
 * Explicit navigation properties are preferred. When no explicit URL is
 * available, the function builds a model detail URL from the GraphQL type and
 * identifier. The helper is currently available for future navigation support.
 *
 * @param {Object|null|undefined} node
 * Finance node whose URL should be resolved.
 *
 * @returns {string|null}
 * Resolved application URL, or `null` when the node cannot be linked.
 */
const getNodeUrl = (node) => {
    if (!node || typeof node !== "object") {
        return null;
    }

    if (node.url) return node.url;
    if (node.href) return node.href;
    if (node.path) return node.path;
    if (node.link) return node.link;

    if (node.typename && node.id) {
        return `/finance/${node.typename}/view/${node.id}`;
    }

    if (node.__typename && node.id) {
        return `/finance/${node.__typename}/view/${node.id}`;
    }

    if (node.id) {
        return `/finance/FinanceGQLModel/view/${node.id}`;
    }

    return null;
};


/**
 * Returns child nodes from different supported hierarchy structures.
 *
 * Standard properties such as `children`, `items` and `nodes` are preferred.
 * If none of them is present, the helper scans other array-valued properties
 * and merges them into a normalized child collection.
 *
 * @param {Object|null|undefined} node
 * Parent hierarchy node.
 *
 * @returns {Object[]}
 * Normalized collection of direct child nodes.
 */
const getNodeChildren = (node) => {
    if (!node || typeof node !== "object") {
        return [];
    }

    if (Array.isArray(node.children)) {
        return node.children;
    }

    if (Array.isArray(node.items)) {
        return node.items;
    }

    if (Array.isArray(node.nodes)) {
        return node.nodes;
    }

    return Object.entries(node)
        .filter(([key, value]) => {
            if (key.startsWith("_")) {
                return false;
            }

            if (
                [
                    "id",
                    "name",
                    "label",
                    "title",
                    "typename",
                    "__typename"
                ].includes(key)
            ) {
                return false;
            }

            return Array.isArray(value);
        })
        .flatMap(([key, value]) => {
            return value.map((child) => ({
                ...child,
                name: getNodeLabel(child) || key
            }));
        });
};


/**
 * Transforms a hierarchical finance structure into flat Sunburst sectors.
 *
 * The function performs a depth-first traversal. Every node receives its
 * depth, angular range and palette index. Child sectors are sized
 * proportionally according to their `value` property. Missing or zero values
 * use a fallback weight of one so that every node remains visually present.
 *
 * @param {Object} root
 * Root finance node.
 *
 * @param {number} [maxDepth=4]
 * Maximum hierarchy depth included in the diagram.
 *
 * @returns {Array<{
 *   node: Object,
 *   depth: number,
 *   startAngle: number,
 *   endAngle: number,
 *   colorIndex: number
 * }>}
 * Flat collection of renderable Sunburst sectors.
 */
const buildSunburstNodes = (
    root,
    maxDepth = 4
) => {
    const result = [];

    const walk = (
        node,
        depth,
        startAngle,
        endAngle,
        colorIndex
    ) => {
        if (!node || depth > maxDepth) {
            return;
        }

        result.push({
            node,
            depth,
            startAngle,
            endAngle,
            colorIndex
        });

        const children = getNodeChildren(node);

        if (!children.length) {
            return;
        }

        const totalValue = children.reduce(
            (sum, child) =>
                sum + (Number(child.value) || 1),
            0
        );

        let currentAngle = startAngle;
        const availableAngle = endAngle - startAngle;

        children.forEach((child, index) => {
            const childValue = Number(child.value) || 1;
            const slice =
                (childValue / totalValue) * availableAngle;

            walk(
                child,
                depth + 1,
                currentAngle,
                currentAngle + slice,
                colorIndex + index + 1
            );

            currentAngle += slice;
        });
    };

    walk(root, 0, 0, 360, 0);

    return result;
};


/**
 * Displays an interactive SVG Sunburst diagram of a finance hierarchy.
 *
 * The component converts a nested finance structure into concentric sectors.
 * Sector sizes correspond to finance values, while hierarchy depth determines
 * the rendered ring. The root finance is displayed as a central circle.
 *
 * The diagram supports selecting individual nodes through `onSelect`. A
 * selected source is rendered with diagonal hatching, while a selected target
 * receives a thicker border and glow effect.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Root finance entity displayed in the diagram.
 *
 * @param {string} [props.header="Sunburst diagram"]
 * Heading displayed by the surrounding card and used as the SVG accessible
 * label.
 *
 * @param {number} [props.size=600]
 * Diagram height and base coordinate size in pixels.
 *
 * @param {number} [props.maxDepth=4]
 * Maximum hierarchy depth rendered by the diagram.
 *
 * @param {Function} [props.onSelect]
 * Callback invoked after clicking a node. Receives the selected finance node.
 *
 * @param {string|null} [props.selectedSourceId=null]
 * Identifier of the node highlighted as the transfer source.
 *
 * @param {string|null} [props.selectedTargetId=null]
 * Identifier of the node highlighted as the transfer destination.
 *
 * @returns {JSX.Element|null}
 * SVG Sunburst diagram wrapped in a card, or `null` when no root item exists.
 *
 * @example
 * <SunburstDiagram
 *     item={finance}
 *     header="Struktura rozpočtu"
 *     onSelect={(node) => console.log(node)}
 *     selectedSourceId={sourceId}
 *     selectedTargetId={targetId}
 * />
 */
export const SunburstDiagram = ({
    item,
    header = "Sunburst diagram",
    size = 600,
    maxDepth = 4,
    onSelect,
    selectedSourceId = null,
    selectedTargetId = null
}) => {
    const center = size / 2;
    const ringWidth = 85;

    const nodes = useMemo(() => {
        return buildSunburstNodes(item, maxDepth);
    }, [item, maxDepth]);

    if (!item) {
        return null;
    }

    return (
        <CardCapsule header={header}>
            <div className="d-flex justify-content-center align-items-center">
                <svg
                    width="100%"
                    height={size}
                    viewBox={`-120 -120 ${size + 240} ${size + 240}`}
                    role="img"
                    aria-label={header}
                >
                    <defs>
                        <pattern
                            id="diagonalHatch"
                            patternUnits="userSpaceOnUse"
                            width="8"
                            height="8"
                            patternTransform="rotate(45)"
                        >
                            <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="8"
                                stroke="blue"
                                strokeWidth="3"
                                opacity="0.5"
                            />
                        </pattern>

                        <filter id="glow">
                            <feGaussianBlur
                                stdDeviation="4"
                                result="coloredBlur"
                            />

                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {nodes.map((entry, index) => {
                        const {
                            node,
                            depth,
                            startAngle,
                            endAngle,
                            colorIndex
                        } = entry;

                        const label = getNodeLabel(node);
                        const children = getNodeChildren(node);
                        const isLeaf = children.length === 0;
                        const isSource =
                            node?.id === selectedSourceId;
                        const isTarget =
                            node?.id === selectedTargetId;

                        const handleClick = (event) => {
                            event.stopPropagation();

                            if (!node?.id) {
                                return;
                            }

                            onSelect?.(node);
                        };

                        const innerRadius =
                            depth === 0
                                ? 0
                                : depth * ringWidth;

                        const outerRadius =
                            depth === 0
                                ? ringWidth
                                : (depth + 1) * ringWidth;

                        const labelRadius =
                            innerRadius +
                            (outerRadius - innerRadius) * 0.5;

                        const angle =
                            (startAngle + endAngle) / 2;

                        const labelPoint =
                            polarToCartesian(
                                center,
                                center,
                                labelRadius,
                                angle
                            );

                        if (depth === 0) {
                            return (
                                <g
                                    key={node?.id || index}
                                    onClick={handleClick}
                                    style={{
                                        cursor: node?.id
                                            ? "pointer"
                                            : "default"
                                    }}
                                >
                                    <circle
                                        cx={center}
                                        cy={center}
                                        r={outerRadius}
                                        fill={COLORS[0]}
                                        opacity="0.9"
                                    >
                                        <title>{label}</title>
                                    </circle>

                                    <text
                                        x={center}
                                        y={center}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="18"
                                        fill="white"
                                        pointerEvents="none"
                                    >
                                        {String(label)
                                            .match(/.{1,14}(\s|$)/g)
                                            ?.map((line, lineIndex) => (
                                                <tspan
                                                    key={lineIndex}
                                                    x={center}
                                                    dy={
                                                        lineIndex === 0
                                                            ? "-0.6em"
                                                            : "1.2em"
                                                    }
                                                >
                                                    {line.trim()}
                                                </tspan>
                                            ))}
                                    </text>
                                </g>
                            );
                        }

                        return (
                            <g
                                key={node?.id || index}
                                onClick={handleClick}
                                style={{
                                    cursor: node?.id
                                        ? "pointer"
                                        : "default"
                                }}
                            >
                                <path
                                    d={describeArc(
                                        center,
                                        center,
                                        innerRadius,
                                        outerRadius,
                                        startAngle,
                                        endAngle
                                    )}
                                    fill={
                                        isSource
                                            ? "url(#diagonalHatch)"
                                            : COLORS[
                                                colorIndex % COLORS.length
                                            ]
                                    }
                                    stroke={
                                        isTarget
                                            ? "#000000"
                                            : "black"
                                    }
                                    strokeWidth={
                                        isTarget ? "10" : "4"
                                    }
                                    opacity={
                                        isSource || isTarget
                                            ? "1"
                                            : "0.88"
                                    }
                                    filter={
                                        isTarget
                                            ? "url(#glow)"
                                            : undefined
                                    }
                                >
                                    <title>{label}</title>
                                </path>

                                {endAngle - startAngle > 8 && (
                                    <text
                                        x={labelPoint.x}
                                        y={labelPoint.y}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        transform={
                                            `rotate(${ 
                                                angle > 90 && angle < 270
                                                    ? angle + 180
                                                    : angle
                                            } ${labelPoint.x} ${labelPoint.y})`
                                        }
                                        fontSize={
                                            depth >= 2 ? "13" : "15"
                                        }
                                        fill={
                                            isSource
                                                ? "#000000"
                                                : "white"
                                        }
                                        pointerEvents="none"
                                        aria-hidden="true"
                                        data-leaf={isLeaf}
                                    >
                                        {String(label)
                                            .match(/.{1,12}/g)
                                            ?.slice(0, 3)
                                            .map((line, lineIndex) => (
                                                <tspan
                                                    key={lineIndex}
                                                    x={labelPoint.x}
                                                    dy={
                                                        lineIndex === 0
                                                            ? "-0.5em"
                                                            : "1.1em"
                                                    }
                                                >
                                                    {line}
                                                </tspan>
                                            ))}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </CardCapsule>
    );
};

// Kept available for future navigation support and documentation tooling.
void getNodeUrl;