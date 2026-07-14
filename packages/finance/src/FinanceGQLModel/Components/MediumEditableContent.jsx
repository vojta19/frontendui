import { Input } from "../../../../_template/src/Base/FormControls/Input";

/**
 * Renders an editable form for a finance entity.
 *
 * The component provides form controls for editing the most commonly
 * modified properties of a finance record. It is primarily used inside
 * create and update dialogs.
 *
 * The edited values are propagated through the supplied event handlers.
 * Additional controls (such as Save or Cancel buttons) can be injected
 * through the `children` property.
 *
 * @component
 *
 * @param {Object} props
 * Component properties.
 *
 * @param {Object} props.item
 * Finance entity currently being edited.
 *
 * @param {string} [props.item.name]
 * Czech name of the finance entity.
 *
 * @param {string} [props.item.nameEn]
 * English name of the finance entity.
 *
 * @param {string} [props.item.description]
 * Description of the finance entity.
 *
 * @param {Function} [props.onChange]
 * Callback invoked whenever the value of an input field changes.
 *
 * @param {Function} [props.onBlur]
 * Callback invoked when an input field loses focus.
 *
 * @param {React.ReactNode} [props.children]
 * Optional additional controls rendered below the editable fields.
 *
 * @returns {JSX.Element}
 * Editable finance form.
 *
 * @example
 * <MediumEditableContent
 *     item={finance}
 *     onChange={handleChange}
 *     onBlur={handleBlur}
 * >
 *     <button className="btn btn-primary">
 *         Save
 *     </button>
 * </MediumEditableContent>
 */
export const MediumEditableContent = ({
    item,
    onChange = () => null,
    onBlur = () => null,
    children
}) => {
    return (
        <>
            <Input
                id="name"
                label="Jméno"
                className="form-control"
                value={item?.name ?? ""}
                placeholder="Název"
                onChange={onChange}
                onBlur={onBlur}
            />

            <Input
                id="nameEn"
                label="EN název"
                className="form-control"
                value={item?.nameEn ?? ""}
                placeholder="English name"
                onChange={onChange}
                onBlur={onBlur}
            />

            <Input
                id="description"
                label="Popis"
                className="form-control"
                value={item?.description ?? ""}
                placeholder="Popis"
                onChange={onChange}
                onBlur={onBlur}
            />

            {children}
        </>
    );
};