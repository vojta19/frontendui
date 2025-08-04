import { SimpleCardCapsule } from "./SimpleCardCapsule"

export const Label = ({tools, children, ...props}) => {
    return (
        <SimpleCardCapsule {...props}>
            {tools}
            {children}
        </SimpleCardCapsule>
    )
}