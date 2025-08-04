import { useParams } from "react-router"
import { DigitalFormFieldPageContentLazy } from "./DigitalFormFieldPageContentLazy"
import { DigitalFormFieldLiveEdit } from "../Components"

/**
 * DigitalFormFieldEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `digitalformfield`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/digitalformfield/:id`).
 * - Vytvoří objekt `digitalformfield` s tímto `id` a předává jej do komponenty `DigitalFormFieldPageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `DigitalFormFieldPageContentLazy` vykresluje editační rozhraní pomocí `DigitalFormFieldLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `digitalformfield` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { digitalformfield: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `DigitalFormFieldPageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (digitalformfield) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/digitalformfield/:id" element={<DigitalFormFieldEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/digitalformfield/:id"
 *   element={
 *     <DigitalFormFieldEditPage>
 *       {({ digitalformfield, onChange, onBlur }) => (
 *         <input value={digitalformfield.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalFormFieldEditPage>
 *   }
 * />
 */
export const DigitalFormFieldEditPage = ({children}) => {
    const {id} = useParams()
    const digitalformfield = {id}
    return (
        <DigitalFormFieldPageContentLazy digitalformfield={digitalformfield}>
            <DigitalFormFieldLiveEdit digitalformfield={digitalformfield} />
            {children}
        </DigitalFormFieldPageContentLazy>
    )
}