import { useEffect, useRef } from 'react'
import { Label } from './Label'
import { useMemo } from 'react'
import { useState } from 'react'

export const Input_ = ({ label, ariaHidden = false, ...props }) => {
    const { id, value, defaultValue, onChange = (e) => null, type } = props
    const fired = useRef(false)
    useEffect(() => {
        if (!fired.current) {
            const e = { target: { id, value: (value || defaultValue) } }
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
export const Input__ = ({ label, ariaHidden = false, children, ...props }) => {
    const { id, value, defaultValue, onChange = () => null, onBlur = () => null, type } = props;
    const fired = useRef(false);

    // Pomocná funkce pro konverzi hodnoty podle typu
    const coerceValue = (val) => {
        if (type === "number") {
            if (val === "" || val == null) return "";     // ← prázdno zůstává prázdno
            const num = Number(val);
            return Number.isNaN(num) ? "" : num;
        }
        return val ?? "";
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
    const handleChange = (next) => (e) => {
        const coercedValue = coerceValue(e.target.value);
        next({ target: { id, value: coercedValue } });
    };

    if (ariaHidden) return null;

    const inputElement = <input {...props} onChange={handleChange(onChange)} onBlur={handleChange(onBlur)} />;

    if (!label) return inputElement;

    return <Label title={label}>{inputElement}{children}</Label>;
};


export const Input2 = ({ label, ariaHidden = false, children, ...props }) => {
    const {
        id,
        value,
        defaultValue,
        onChange = () => null,
        onBlur = () => null,
        type,
        ...rest
    } = props;

    const touchedRef = useRef(false);

    const coerceValue = (val) => {
        if (type === "number") {
            if (val === "" || val == null) return "";
            const num = Number(val);
            return Number.isNaN(num) ? "" : num;
        }
        return val ?? "";
    };

    const emit = (cb) => (e) => {
        // uživatel něco udělal (change/blur), ale mount sem nikdy nejde
        const coercedValue = coerceValue(e.target.value);
        cb({ target: { id, value: coercedValue } });
    };

    const handleChange = (e) => {
        touchedRef.current = true;
        emit(onChange)(e);
    };

    const handleBlur = (e) => {
        // nechceme střílet blur, pokud uživatel reálně nic nezměnil
        if (!touchedRef.current) return;
        emit(onBlur)(e);
    };

    if (ariaHidden) return null;

    const inputElement = (
        <input
            id={id}
            type={type}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...rest}
        />
    );

    if (!label) return inputElement;

    return (
        <Label title={label}>
            {inputElement}
            {children}
        </Label>
    );
};


export const Input = ({ label, ariaHidden = false, children, ...props }) => {
    const {
        id,
        value,
        defaultValue,
        onChange = () => null,
        onBlur = () => null,
        type="text",
        ...rest
    } = props;

    const isControlled = value !== undefined; // klíčové
    const touchedRef = useRef(false);
    const [value_, setValue_] = useState(value)
    useEffect(() => setValue_(value), [value])
    const coerceValue = (val) => {
        if (type === "number") {
            if (val === "" || val == null) return "";
            const num = Number(val);
            return Number.isNaN(num) ? "" : num;
        }
        return val ?? "";
    };

    // reset "touched", když se změní hodnota zvenku (typicky reload / cancel / confirm)
    const externalValueKey = useMemo(
        () => (isControlled ? coerceValue(value) : undefined),
        [isControlled, value, type]
    );

    useEffect(() => {
        if (isControlled) touchedRef.current = false;
    }, [externalValueKey, isControlled]);

    const emit = (cb) => (e) => {
        const coercedValue = coerceValue(e.target.value);
        cb({ target: { id, value: coercedValue } });
    };

    const handleChange = (e) => {
        touchedRef.current = true;
        const value = e?.target?.value
        setValue_(value)
        emit(onChange)(e);
    };

    const handleBlur = (e) => {
        if (!touchedRef.current) return;
        emit(onBlur)(e);
    };

    if (ariaHidden) return null;

    const inputProps = {
        id,
        type,
        onChange: handleChange,
        onBlur: handleBlur,
        ...rest,
    };

    // Controlled vs uncontrolled:
    if (isControlled) {
        inputProps.value = coerceValue(value_);
    } else {
        inputProps.defaultValue = coerceValue(defaultValue);
    }

    if (value !== value_) {
        inputProps.className = (inputProps.className ? inputProps.className + " " : "") + "bg-warning";
    }
    // console.log("Input default", isControlled, defaultValue, inputProps)
    const inputElement = <input {...inputProps} />;

    if (!label) return inputElement;

    return (
        <Label title={label}>
            {inputElement}
            {/* value_: {value_} <br />
            value: {value}  */}

            {children}
        </Label>
    );
};