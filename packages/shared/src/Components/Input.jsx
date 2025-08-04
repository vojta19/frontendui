import { useEffect, useRef } from 'react'
import { Label } from './Label'

export const Input_ = ({label,  ariaHidden=false , ...props}) => {
    const {id, value, defaultValue, onChange=(e)=>null, type } = props
    const fired = useRef(false)
    useEffect(() => {
        if (!fired.current) {
            const e = {target:{id, value: (value || defaultValue)}}
            onChange(e)
            // console.log("Input.onChange", e)
            fired.current = true
        }
    })

    if (ariaHidden)
        return null

    if (!label)
        return (
            <input {...props} />
        )

    return (
        <Label title={label}>
            <input {...props} />
        </Label>
    )
}

/**
 * A reusable input component with automatic value coercion and initialization.
 *
 * This component wraps a native `<input>` element and ensures consistent behavior across controlled and uncontrolled usage.
 * For inputs of `type="number"`, it converts string values to actual `number` types before calling the `onChange` handler.
 * It also fires an initial `onChange` once on mount, using either `value` or `defaultValue`, to propagate initial state upward.
 *
 * @component
 * @param {Object} props - Props passed to the component.
 * @param {string} props.id - The HTML ID of the input field.
 * @param {string} [props.label] - Optional label to be displayed using the `Label` wrapper.
 * @param {string} [props.type] - Input type (e.g., `"text"`, `"number"`). Defaults to `"text"` if not specified.
 * @param {*} [props.value] - Controlled value of the input.
 * @param {*} [props.defaultValue] - Default value (for uncontrolled usage).
 * @param {function} [props.onChange] - Callback called with `{ target: { id, value } }` when the input changes.
 * @param {boolean} [props.ariaHidden=false] - If true, the input is visually hidden and not rendered.
 * @param {...any} props.rest - Any other props passed directly to the underlying `<input>` element.
 *
 * @returns {JSX.Element|null} The rendered input wrapped in a label (if `label` is provided), or `null` if `ariaHidden` is true.
 *
 * @example
 * <Input
 *   id="age"
 *   type="number"
 *   label="Age"
 *   defaultValue="25"
 *   onChange={(e) => console.log(e.target.value)} // Will log 25 as number
 * />
 */
export const Input = ({ label, ariaHidden = false, children, ...props }) => {
    const { id, value, defaultValue, onChange = () => null, type } = props;
    const fired = useRef(false);

    // Pomocná funkce pro konverzi hodnoty podle typu
    const coerceValue = (val) => {
        if (type === "number") {
            const num = Number(val);
            return isNaN(num) ? "" : num;
        }
        return val;
    };

    // Inicializační volání onChange s převedenou hodnotou
    useEffect(() => {
        if (!fired.current) {
            const initial = coerceValue(value ?? defaultValue);
            const e = { target: { id, value: initial } };
            onChange(e);
            fired.current = true;
        }
    }, [value, defaultValue, onChange, id, type]);

    // Obalující onChange handler
    const handleChange = (e) => {
        const coercedValue = coerceValue(e.target.value);
        onChange({ target: { id, value: coercedValue } });
    };

    if (ariaHidden) return null;

    const inputElement = <input {...props} onChange={handleChange} />;

    if (!label) return inputElement;

    return <Label title={label}>{inputElement}{children}</Label>;
};
