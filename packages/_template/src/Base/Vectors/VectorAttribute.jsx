import { CardCapsule } from "../Components/CardCapsule"
import { Table } from "../Components/Table"
import { Col } from "../Components/Col"
import { Row } from "../Components/Row"
import { useState } from "react"

export const VectorAttributeFactory = (attribute_name) => ({ item }) => {
    const attribute_value = item?.[attribute_name] || []
    return (
        <Row key={attribute_name}>
            <Col className="col-2"><b>{attribute_name}</b></Col>
            <Col className="col-10">
                <CardCapsule item={item}>
                    <Table data={attribute_value} />
                </CardCapsule>
            </Col>
        </Row>
    )
}

export const VectorAttribute = ({ attribute_name, item }) => {
    const attribute_value = item?.[attribute_name] || []
    return (
        <CardCapsule item={item} header={attribute_name+'[]'}>
            <Table data={attribute_value} />
        </CardCapsule>
    )
}

export const MediumCardVectors = ({ item }) => {
    return (
        <CardCapsule item={item} header={"Vektorové atributy"}>
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) {
                    return <VectorAttribute key={attribute_name} attribute_name={attribute_name} item={item} />
                } else {
                    return null
                }
            })}
        </CardCapsule>
    )
}



const isPlainObject = (v) =>
    v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);

const SimpleValue = ({ label, value }) => (<><b>{label}</b><br/> {`${value}`} </>)

const TreeSimpleValues = ({ item }) => {
    return (<Row>
        {Object.entries(item).map(([attribute_name, attribute_value]) => {
            if (attribute_value === null) return null
            if (Array.isArray(attribute_value)) return null
            if (isPlainObject(attribute_value)) return null
            return (
                <Col key={attribute_name} >
                    <SimpleValue label={attribute_name} value={attribute_value} />
                </Col>
            )
        })}
    </Row>)
}

const TreeDict = ({ item }) => {
    const [collapsed, setCollapsed] = useState(true)
    const toggle = () => setCollapsed(prev => !prev)

    return (<>
        <button className="btn btn-outline-secondary form-control" onClick={toggle}>
            <TreeSimpleValues item={item} />
        </button>
        {!collapsed && (<>
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) return null
                if (isPlainObject(attribute_value)) return (<Row>
                        <Col className={"col-1"}><b>{attribute_name}</b></Col>
                        <Col className={"col-11"}>
                        <TreeDict key={attribute_name} item={attribute_value} />
                        </Col>
                    </Row>)
                return null
            })}
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) return (
                    <Row>
                        <Col className={"col-1"}>
                            <b>{attribute_name} []</b>
                        </Col>
                        <Col className={"col-11"}>
                            <TreeArray key={attribute_name} items={attribute_value} />
                        </Col>
                    </Row>
                )
                
                return null
            })}
        </>)}
    </>)
}

const TreeArray = ({ items }) => {
    const [collapsed, setCollapsed] = useState(true)
    const toggle = () => setCollapsed(prev => !prev)
    return (<>
        <button className="btn btn-outline-secondary form-control" onClick={toggle}>
            {collapsed ? "Open" : "Close"}
        </button>
        {!collapsed && items?.map((item, index) => (
            <Row>
                <Col className={"col-1"}>
                    <b>{index}</b>
                </Col>
                <Col className={"col-11"}>
                    <TreeDict key={item?.id} item={item} />
                </Col>
            </Row>
        )
        )}
    </>)
}

export const Tree = ({ item }) => {
    return (
        <CardCapsule item={item} header={"Tree"}>
            <TreeDict item={item} />
        </CardCapsule>
    )
}

