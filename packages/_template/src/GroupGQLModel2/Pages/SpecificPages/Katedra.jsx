import { PlaceChild } from "../../../Base/Helpers/PlaceChild"
import { MediumCardScalars } from "../../../Base/Scalars/ScalarAttribute"
import { MediumCardVectors } from "../../../Base/Vectors/VectorAttribute"
import { Page } from "../Page"

export const PageKatedra = () => {
    return (
        <Page>
            Katedra
            <PlaceChild Component={MediumCardScalars}  />
            <PlaceChild Component={MediumCardVectors}  />
        </Page>
    )
}