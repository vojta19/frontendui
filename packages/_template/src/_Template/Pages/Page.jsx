import { PlaceChild } from "../../Base/Helpers/PlaceChild"
import { MediumCardScalars } from "../../Base/Scalars/ScalarAttribute"
import { MediumCardVectors } from "../../Base/Vectors/VectorAttribute"

import { PageCapsule } from "./PageCapsule"
import { PageContent } from "./PageContent"

export const Page = ({ children }) => {
    return (
        <PageCapsule>
            <PlaceChild Component={PageContent}>
                {children?children:<>
                    <PlaceChild Component={MediumCardScalars}  />
                    <PlaceChild Component={MediumCardVectors}  />
                </>}
            </PlaceChild>
        </PageCapsule>
    )
}

export const PageMediumCard = () => {
    return (
        <Page>
            <PlaceChild Component={MediumCardScalars}  />
            <PlaceChild Component={MediumCardVectors}  />
        </Page>
    )
}