import { Col } from "../Helpers/Col";
import { Row } from "../Helpers/Row";
// import { MediumCardScalars } from "../Scalars/ScalarAttribute";
// import { MediumCardVectors } from "../Vectors/VectorAttribute";
import { MediumCard } from "./MediumCard";

export const LargeCard = ({ item, children }) => {
    return (
        <Row>
            <Col className="col-4">
                <MediumCard item={item} />
            </Col>
            <Col className="col-8">
                {/* <MediumCardScalars item={item} />
                <MediumCardVectors item={item} /> */}
                {children}
            </Col>
        </Row>
    );
}