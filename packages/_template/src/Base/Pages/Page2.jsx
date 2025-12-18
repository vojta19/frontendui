import { useParams } from "react-router"
import { LargeCard } from "../Components/LargeCard"
import { MediumCardScalars } from "../Scalars/ScalarAttribute"
import { MediumCardVectors } from "../Vectors/VectorAttribute"
import { AsyncActionProvider } from "../../Template/Utils/GQLEntityProvider"
import { useGQLType } from "../../../../dynamic/src/Hooks/useGQLType"
import { useGQLEntityContext } from "../../Template/Utils/GQLEntityProvider"
import { Row } from "../Helpers/Row"
import { Col } from "../Helpers/Col"
import { CardCapsule } from "../Components/CardCapsule"

export const PageContent = ({children}) => {
     const gqlContext= useGQLEntityContext()
     const { item } = gqlContext || {}
    if (!item) return (<div>Položka nenalezena<pre>{JSON.stringify(gqlContext)}</pre></div>)
    return (
        <LargeCard item={item} >
            {children?children:<>
                <MediumCardScalars item={item} />
                <MediumCardVectors item={item} />
            </>}
        </LargeCard>
    )
}

export const Page2 = ({ children }) => {
    const {id, typename} = useParams()
    // const id = "51d101a0-81f1-44ca-8366-6cf51432e8d6";
    const item = {id}
    const { ByIdAsyncAction, queryById } = useGQLType(typename || "RoleGQLModel")    
    return (
        // <div>Hello</div>
        <>{ByIdAsyncAction&&
            <AsyncActionProvider item={item} queryAsyncAction={ByIdAsyncAction}>
                <PageContent>
                    {children}
                </PageContent>
            </AsyncActionProvider>
        }
        {!ByIdAsyncAction&&
            <div>No ByIdAsyncAction for type {typename}</div>
        }
        <Row>
            <Col>
                <CardCapsule header="QueryById">
                    <pre>{queryById}</pre>
                </CardCapsule>
            </Col>
            <Col>
                <CardCapsule header="Parametry">
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                </CardCapsule>
            </Col>
        </Row>
        </>
    )
}