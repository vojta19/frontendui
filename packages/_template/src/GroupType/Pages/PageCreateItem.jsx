import { ReadAsyncAction } from "../Queries"
import { Row } from "../../Base/Components/Row";
import { Col } from "../../Base/Components/Col";
import { LinkURI } from "../Components";
import { PageBase } from "./PageBase";
import { CreateBody } from "../Mutations/Create";

export const CreateItemURI = `${LinkURI.replace('view', 'create')}`

export const PageCreateItem = ({ children, queryAsyncAction=ReadAsyncAction, ...props }) => {
    return (
        <PageBase>
            <Row>
                <Col></Col>
                <Col></Col>
                <Col>
                    <CreateBody {...props} />
                </Col>
                <Col></Col>
            </Row>
        </PageBase>
    )
}
