import { useMemo } from "react"
import { useNavigate } from "react-router"
import { CardCapsule } from "../../../../_template/src/Base/Components/CardCapsule"

const COLORS = [
    "#0d6efd",
    "#198754",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#20c997",
    "#fd7e14",
    "#0dcaf0"
]

const polarToCartesian = (cx, cy, r, angle) => {
    const a = (angle - 90) * Math.PI / 180

    return {
        x: cx + r * Math.cos(a),
        y: cy + r * Math.sin(a)
    }
}

const describeArc = (cx, cy, innerR, outerR, startAngle, endAngle) => {
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    const p1 = polarToCartesian(cx, cy, outerR, endAngle)
    const p2 = polarToCartesian(cx, cy, outerR, startAngle)
    const p3 = polarToCartesian(cx, cy, innerR, startAngle)
    const p4 = polarToCartesian(cx, cy, innerR, endAngle)

    return [
        `M ${p1.x} ${p1.y}`,
        `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${p2.x} ${p2.y}`,
        `L ${p3.x} ${p3.y}`,
        `A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${p4.x} ${p4.y}`,
        "Z"
    ].join(" ")
}

const getNodeLabel = (node) => {
    return (
        node?.name ||
        node?.label ||
        node?.title ||
        node?.typename ||
        node?.__typename ||
        node?.id ||
        "node"
    )
}
const getNodeUrl = (node) => {
    if (!node || typeof node !== "object") return null

    if (node.url) return node.url
    if (node.href) return node.href
    if (node.path) return node.path
    if (node.link) return node.link

    if (node.typename && node.id) {
        return `/finance/${node.typename}/view/${node.id}`
    }

    if (node.__typename && node.id) {
        return `/finance/${node.__typename}/view/${node.id}`
    }

    return null
}

const getNodeChildren = (node) => {
    if (!node || typeof node !== "object") return []

    if (Array.isArray(node.children)) return node.children
    if (Array.isArray(node.items)) return node.items
    if (Array.isArray(node.nodes)) return node.nodes

    return Object.entries(node)
        .filter(([key, value]) => {
            if (key.startsWith("_")) return false

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
                return false
            }

            return Array.isArray(value)
        })
        .flatMap(([key, value]) =>
            value.map((child) => ({
                ...child,
                name: getNodeLabel(child) || key
            }))
        )
}

const buildSunburstNodes = (root, maxDepth = 4) => {
    const result = []

    const walk = (node, depth, startAngle, endAngle, colorIndex) => {
        if (!node || depth > maxDepth) return

        result.push({
            node,
            depth,
            startAngle,
            endAngle,
            colorIndex
        })

        const children = getNodeChildren(node)
        if (!children.length) return

        const slice = (endAngle - startAngle) / children.length

        children.forEach((child, index) => {
            walk(
                child,
                depth + 1,
                startAngle + index * slice,
                startAngle + (index + 1) * slice,
                colorIndex + index + 1
            )
        })
    }

    walk(root, 0, 0, 360, 0)

    return result
}

export const SunburstDiagram = ({
    item,
    header = "Sunburst diagram",
    size = 420,
    maxDepth = 4
}) => {
    const navigate = useNavigate()

    const center = size / 2
    const ringWidth = 52

    const nodes = useMemo(() => {
        return buildSunburstNodes(item, maxDepth)
    }, [item, maxDepth])

    if (!item) return null

    return (
        <CardCapsule header={header}>
            <div className="d-flex justify-content-center align-items-center">
                <svg
                    width="100%"
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    role="img"
                    aria-label={header}
                >
                    {nodes.map((entry, index) => {
                        const {
                            node,
                            depth,
                            startAngle,
                            endAngle,
                            colorIndex
                        } = entry

                        const label = getNodeLabel(node)
                        const url = getNodeUrl(node)

                        const handleClick = () => {
                            if (!url) return
                            navigate(url)
                        }

                        const innerR = depth === 0 ? 0 : depth * ringWidth
                        const outerR = depth === 0
                            ? ringWidth
                            : (depth + 1) * ringWidth

                        const angle = (startAngle + endAngle) / 2
                        const labelR = innerR + (outerR - innerR) / 2
                        const labelPoint = polarToCartesian(
                            center,
                            center,
                            labelR,
                            angle
                        )

                        if (depth === 0) {
                            return (
                                <g key={index}
                                onClick={handleClick}
                                style={{ cursor: url ? "pointer" : "default" }}
                                >
                                    <circle
                                        cx={center}
                                        cy={center}
                                        r={outerR}
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
                                        fontSize="12"
                                        fill="white"
                                    >
                                        {String(label).slice(0, 18)}
                                    </text>
                                </g>
                            )
                        }

                        return (
                            <g key={index}
                            onClick={handleClick}
                            style={{ cursor: url ? "pointer" : "default" }}>
                                <path
                                    d={describeArc(
                                        center,
                                        center,
                                        innerR,
                                        outerR,
                                        startAngle,
                                        endAngle
                                    )}
                                    fill={COLORS[colorIndex % COLORS.length]}
                                    stroke="white"
                                    strokeWidth="2"
                                    opacity={0.88}
                                >
                                    <title>{label}</title>
                                </path>

                                {endAngle - startAngle > 14 && (
                                    <text
                                        x={labelPoint.x}
                                        y={labelPoint.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="10"
                                        fill="white"
                                        pointerEvents="none"
                                    >
                                        {String(label).slice(0, 12)}
                                    </text>
                                )}
                            </g>
                        )
                    })}
                </svg>
            </div>
        </CardCapsule>
    )
}