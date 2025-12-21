import { CardCapsule } from "../Components"
import { Insert } from "./Insert"
import { Update } from "./Update"

export const InteractiveMutations = ({ item }) => {
    return (
    <CardCapsule item={item} title="Nástroje">
        <Update className="btn btn-outline-success" item={item} buttonLabel={"Update"} />
        <Insert className="btn btn-outline-success" item={item} buttonLabel={"Insert"} />
    </CardCapsule>)
}
