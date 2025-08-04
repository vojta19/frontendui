import { useParams } from "react-router"
import { DigitalSubmissionFieldPageContentLazy } from "./DigitalSubmissionFieldPageContentLazy"
import { DigitalSubmissionFieldLiveEdit } from "../Components"

/**
 * DigitalSubmissionFieldEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `digitalsubmissionfield`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/digitalsubmissionfield/:id`).
 * - Vytvoří objekt `digitalsubmissionfield` s tímto `id` a předává jej do komponenty `DigitalSubmissionFieldPageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `DigitalSubmissionFieldPageContentLazy` vykresluje editační rozhraní pomocí `DigitalSubmissionFieldLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `digitalsubmissionfield` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { digitalsubmissionfield: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `DigitalSubmissionFieldPageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (digitalsubmissionfield) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/digitalsubmissionfield/:id" element={<DigitalSubmissionFieldEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/digitalsubmissionfield/:id"
 *   element={
 *     <DigitalSubmissionFieldEditPage>
 *       {({ digitalsubmissionfield, onChange, onBlur }) => (
 *         <input value={digitalsubmissionfield.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalSubmissionFieldEditPage>
 *   }
 * />
 */
export const DigitalSubmissionFieldEditPage = ({children}) => {
    const {id} = useParams()
    const digitalsubmissionfield = {id}
    return (
        <DigitalSubmissionFieldPageContentLazy digitalsubmissionfield={digitalsubmissionfield}>
            <DigitalSubmissionFieldLiveEdit digitalsubmissionfield={digitalsubmissionfield} />
            {children}
        </DigitalSubmissionFieldPageContentLazy>
    )
}