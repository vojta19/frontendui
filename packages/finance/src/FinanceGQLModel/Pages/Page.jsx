import { useMemo, useState } from "react"
import { useParams } from "react-router"

import { useGQLType } from "../../../../dynamic/src/Hooks/useGQLType"
import { FinanceTransferSunburst } from "../Components/FinanceTransferSunburst"
import { LargeCard } from "../../../../_template/src/Base/Components/LargeCard"
import { CardCapsule } from "../../../../_template/src/Base/Components/CardCapsule"
import { MediumCardScalars, ScalarAttribute } from "../../../../_template/src/Base/Scalars/ScalarAttribute"
import { MediumCardVectors, VectorAttribute } from "../../../../_template/src/Base/Vectors/VectorAttribute"
import { useGQLEntityContext, AsyncActionProvider } from "../../../../_template/src/Base/Helpers/GQLEntityProvider"
import { Row } from "../../../../_template/src/Base/Components/Row"
import { Col } from "../../../../_template/src/Base/Components/Col"
import { SimpleCardCapsuleRightCorner } from "@hrbolek/uoisfrontend-shared"
import { CopyButton } from "../../../../_template/src/Base/Components/CopyButton"
import { ReadAsyncAction } from "../Queries"

const getTransferSourceId = (transfer) => {
    return (
        transfer?.financeSourceId ??
        transfer?.financeTransfer_financeSourceId ??
        transfer?.sourceFinanceId ??
        transfer?.sourceId ??
        transfer?.financeSource?.id ??
        transfer?.source?.id ??
        null
    )
}

const getTransferDestinationId = (transfer) => {
    return (
        transfer?.financeDestinationId ??
        transfer?.financeTransfer_financeDestinationId ??
        transfer?.destinationFinanceId ??
        transfer?.destinationId ??
        transfer?.financeDestination?.id ??
        transfer?.destination?.id ??
        null
    )
}

const normalizeTransfer = (transfer) => {
    if (!transfer || typeof transfer !== "object") return null

    const financeSourceId = getTransferSourceId(transfer)
    const financeDestinationId = getTransferDestinationId(transfer)
    const amount = Number(
        transfer.amount ??
        transfer.financeTransfer_amount ??
        transfer.value ??
        0
    )

    if (!financeSourceId || !financeDestinationId || !Number.isFinite(amount) || amount === 0) {
        return null
    }

    return {
        ...transfer,
        financeSourceId,
        financeDestinationId,
        amount,
    }
}

const collectTransfers = (item) => {
    const transfers = []
    const visitedNodes = new Set()

    const collect = (node) => {
        if (!node || typeof node !== "object") return
        if (visitedNodes.has(node)) return
        visitedNodes.add(node)

        const possibleTransferArrays = [
            node.financeTransfers,
            node.transfers,
            node.incomingTransfers,
            node.outgoingTransfers,
            node.financeSourceTransfers,
            node.financeDestinationTransfers,
        ]

        possibleTransferArrays.forEach(array => {
            if (!Array.isArray(array)) return

            array.forEach(transfer => {
                const normalizedTransfer = normalizeTransfer(transfer)
                if (normalizedTransfer) transfers.push(normalizedTransfer)
            })
        })

        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(collect)
        }
    }

    collect(item)

    const transferMap = new Map()
    transfers.forEach((transfer, index) => {
        const key = transfer.id ?? `${transfer.financeSourceId}-${transfer.financeDestinationId}-${transfer.amount}-${index}`
        transferMap.set(key, transfer)
    })

    return [...transferMap.values()]
}

const applyTransfersToFinanceTree = (finances = [], transfers = []) => {
    return finances.map(finance => {
        const outgoing = transfers
            .filter(transfer => transfer.financeSourceId === finance.id)
            .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0)

        const incoming = transfers
            .filter(transfer => transfer.financeDestinationId === finance.id)
            .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0)

        return {
            ...finance,
            value: Number(finance.value || 0) - outgoing + incoming,
            subfinances: Array.isArray(finance.subfinances)
                ? applyTransfersToFinanceTree(finance.subfinances, transfers)
                : finance.subfinances,
        }
    })
}

const patchFinanceItem = (item, localTransfers = []) => {
    if (!item || typeof item !== "object") return item

    const normalizedLocalTransfers = localTransfers
        .map(normalizeTransfer)
        .filter(Boolean)

    return {
        ...item,
        subfinances: applyTransfersToFinanceTree(
            item.subfinances ?? [],
            normalizedLocalTransfers
        ),
    }
}

export const GeneratedContentBase = ({ item, onTransferInserted = () => {} }) => {
    const [localTransfers, setLocalTransfers] = useState([])

    const patchedItem = useMemo(() => {
        if (!item) return item

        const patchFinance = (finance) => {
            if (!finance || typeof finance !== "object") return finance

            const outgoing = localTransfers
                .filter(transfer => transfer.financeSourceId === finance.id)
                .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0)

            const incoming = localTransfers
                .filter(transfer => transfer.financeDestinationId === finance.id)
                .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0)

            return {
                ...finance,
                value: Number(finance.value || 0) - outgoing + incoming,
                subfinances: Array.isArray(finance.subfinances)
                    ? finance.subfinances.map(patchFinance)
                    : finance.subfinances,
            }
        }

        return patchFinance(item)
    }, [item, localTransfers])

    const handleTransferInserted = (transfer) => {
        console.log("GENERATEDCONTENTBASE DOSTAL TRANSFER:", transfer)

        setLocalTransfers(previousTransfers => [
            ...previousTransfers,
            {
                financeSourceId: transfer.financeSourceId,
                financeDestinationId: transfer.financeDestinationId,
                amount: Number(transfer.amount || 0),
                name: transfer.name,
            },
        ])

        onTransferInserted?.(transfer)
    }

    return (
        <>
            <FinanceTransferSunburst
                item={patchedItem}
                header="Graf finančních přesunů"
                onTransferInserted={handleTransferInserted}
            />

            <MediumCardVectors item={patchedItem} />
        </>
    )
}

const PageItemInnerStructure = ({
    PageNavbar = null,
    ItemLayout = LargeCard,
    SubPage = GeneratedContentBase,
    OtherComponents = [],
    children
}) => {
    const { item } = useGQLEntityContext()
    const [localTransfers, setLocalTransfers] = useState([])

    const handleTransferInserted = (transfer) => {
        console.log("PAGEITEMINNER DOSTAL TRANSFER:", transfer)

        setLocalTransfers(previousTransfers => [
            ...previousTransfers,
            {
                financeSourceId: transfer.financeSourceId,
                financeDestinationId: transfer.financeDestinationId,
                amount: Number(transfer.amount || 0),
            }
        ])
    }

    const patchedItem = useMemo(() => {
        if (!item) return item

        const patchFinance = (finance) => {
            if (!finance || typeof finance !== "object") return finance

            const outgoing = localTransfers
                .filter(transfer => transfer.financeSourceId === finance.id)
                .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0)

            const incoming = localTransfers
                .filter(transfer => transfer.financeDestinationId === finance.id)
                .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0)

            return {
                ...finance,
                value: Number(finance.value || 0) - outgoing + incoming,
                subfinances: Array.isArray(finance.subfinances)
                    ? finance.subfinances.map(patchFinance)
                    : finance.subfinances
            }
        }

        return patchFinance(item)
    }, [item, localTransfers])
    if (!item) return <>Položka nenalezena</>

    const content = (OtherComponents || []).reduceRight((acc, Component) => {
        if (!Component) return acc
        return <Component item={item}>{acc}</Component>
    }, children)

    return (
        <>
            {PageNavbar && <PageNavbar item={item} />}
            <ItemLayout item={patchedItem}>
                {SubPage ? (
                    <SubPage
                        item={patchedItem}
                        onTransferInserted={(transfer) => {
                            console.log("SUBPAGE INLINE CALLBACK DOSTAL TRANSFER:", transfer)
                            handleTransferInserted(transfer)
                        }}
                    >
                        {content}
                    </SubPage>
                ) : (
                    content
                )}
            </ItemLayout>
        </>
    )
}

export const PageItemBase = ({
    queryAsyncAction = ReadAsyncAction,
    PageNavbar = () => null,
    ItemLayout = LargeCard,
    SubPage = GeneratedContentBase,
    children
}) => {
    const { id } = useParams()
    const item = { id }

    return (
        <AsyncActionProvider item={item} queryAsyncAction={queryAsyncAction}>
            <PageItemInnerStructure
                PageNavbar={PageNavbar}
                ItemLayout={ItemLayout}
                SubPage={SubPage}
            >
                {children}
            </PageItemInnerStructure>
        </AsyncActionProvider>
    )
}

export const PageContent = ({ queryById, queryVector, mutations = {}, children, params }) => {
    const [localTransfers, setLocalTransfers] = useState([])
    const gqlContext = useGQLEntityContext()
    const { action = "view" } = useParams()
    const { item } = gqlContext || {}

    const patchedItem = useMemo(() => {
        return patchFinanceItem(item, localTransfers)
    }, [item, localTransfers])

    const handleTransferInserted = (transfer) => {
        const normalizedTransfer = normalizeTransfer(transfer)
        if (!normalizedTransfer) return

        setLocalTransfers(previousTransfers => [
            ...previousTransfers,
            normalizedTransfer,
        ])
    }

    if (!item) {
        return (
            <div>
                Položka nenalezena
                <pre>{JSON.stringify(gqlContext, null, 2)}</pre>
            </div>
        )
    }

    let content = children
    const attributeValue = patchedItem?.[action]

    console.log("FINANCE ITEM:", item)
    console.log("PATCHED ITEM:", patchedItem)
    console.log("LOCAL TRANSFERS:", localTransfers)
    console.log("COLLECTED TRANSFERS:", collectTransfers(item))

    if (action === "__def") {
        content = (
            <Row>
                <Col>
                    <CardCapsule header="queryById">
                        <SimpleCardCapsuleRightCorner>
                            <CopyButton className="btn btn-sm border-0" text={queryById} />
                        </SimpleCardCapsuleRightCorner>
                        <pre>{queryById?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                    </CardCapsule>
                </Col>
                <Col>
                    <CardCapsule header="queryVector">
                        <SimpleCardCapsuleRightCorner>
                            <CopyButton className="btn btn-sm border-0" text={queryVector} />
                        </SimpleCardCapsuleRightCorner>
                        <pre>{queryVector?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                    </CardCapsule>
                </Col>
                {Object.entries(mutations).map(([name, value]) => {
                    return (
                        <Col key={name}>
                            <CardCapsule header={name}>
                                <SimpleCardCapsuleRightCorner>
                                    <CopyButton className="btn btn-sm border-0" text={value} />
                                </SimpleCardCapsuleRightCorner>
                                <pre>{value?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                            </CardCapsule>
                        </Col>
                    )
                })}
            </Row>
        )
    } else if (action === "view") {
        content = (
            <>
                <FinanceTransferSunburst
                    item={patchedItem}
                    header="Graf finančních přesunů"
                    onTransferInserted={handleTransferInserted}
                />
                <MediumCardScalars key="MediumCardScalars" item={patchedItem} />
                <MediumCardVectors key="MediumCardVectors" item={patchedItem} />
            </>
        )
    } else if (Array.isArray(attributeValue)) {
        content = <VectorAttribute attribute_name={action} item={patchedItem} />
    } else if (attributeValue) {
        content = <ScalarAttribute attribute_name={action} item={patchedItem} />
    }

    return (
        <>
            <LargeCard item={patchedItem}>
                {content}
            </LargeCard>
            <Row>
                <Col>
                    <CardCapsule header="QueryById">
                        <pre>{queryById}</pre>
                    </CardCapsule>
                </Col>
                <Col>
                    <CardCapsule header="Parametry">
                        <pre>{JSON.stringify(params, null, 2)}</pre>
                    </CardCapsule>
                </Col>
                <Col>
                    <CardCapsule header="Response">
                        <pre>{JSON.stringify(patchedItem, null, 2)}</pre>
                    </CardCapsule>
                </Col>
            </Row>
        </>
    )
}

export const Page = ({ children }) => {
    const { id, typename } = useParams()
    const item = { id }
    const { ByIdAsyncAction, queryById, queryVector, mutations } = useGQLType(typename || "RoleGQLModel")

    return (
        <>
            {ByIdAsyncAction &&
                <AsyncActionProvider item={item} queryAsyncAction={ByIdAsyncAction}>
                    <PageContent queryById={queryById} queryVector={queryVector} mutations={mutations} params={item}>
                        {children}
                    </PageContent>
                </AsyncActionProvider>
            }
            {!ByIdAsyncAction &&
                <div>No ByIdAsyncAction for type {typename}</div>
            }
        </>
    )
}
