import { useParams } from "react-router"
import { DigitalSubmissionPageContentLazy } from "./DigitalSubmissionPageContentLazy"
import { DigitalSubmissionLiveEdit } from "../Components"

/**
 * DigitalSubmissionEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `digitalsubmission`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/digitalsubmission/:id`).
 * - Vytvoří objekt `digitalsubmission` s tímto `id` a předává jej do komponenty `DigitalSubmissionPageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `DigitalSubmissionPageContentLazy` vykresluje editační rozhraní pomocí `DigitalSubmissionLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `digitalsubmission` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { digitalsubmission: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `DigitalSubmissionPageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (digitalsubmission) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/digitalsubmission/:id" element={<DigitalSubmissionEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/digitalsubmission/:id"
 *   element={
 *     <DigitalSubmissionEditPage>
 *       {({ digitalsubmission, onChange, onBlur }) => (
 *         <input value={digitalsubmission.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalSubmissionEditPage>
 *   }
 * />
 */
export const DigitalSubmissionEditPage = ({children}) => {
    const {id} = useParams()
    const digitalsubmission = {id}
    return (
        <DigitalSubmissionPageContentLazy digitalsubmission={digitalsubmission}>
            <DigitalSubmissionLiveEdit digitalsubmission={digitalsubmission} />
            {children}
        </DigitalSubmissionPageContentLazy>
    )
}