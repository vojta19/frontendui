import { useParams } from "react-router"
import { DigitalSubmissionSectionPageContentLazy } from "./DigitalSubmissionSectionPageContentLazy"
import { DigitalSubmissionSectionLiveEdit } from "../Components"

/**
 * DigitalSubmissionSectionEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `digitalsubmissionsection`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/digitalsubmissionsection/:id`).
 * - Vytvoří objekt `digitalsubmissionsection` s tímto `id` a předává jej do komponenty `DigitalSubmissionSectionPageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `DigitalSubmissionSectionPageContentLazy` vykresluje editační rozhraní pomocí `DigitalSubmissionSectionLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `digitalsubmissionsection` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { digitalsubmissionsection: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `DigitalSubmissionSectionPageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (digitalsubmissionsection) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/digitalsubmissionsection/:id" element={<DigitalSubmissionSectionEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/digitalsubmissionsection/:id"
 *   element={
 *     <DigitalSubmissionSectionEditPage>
 *       {({ digitalsubmissionsection, onChange, onBlur }) => (
 *         <input value={digitalsubmissionsection.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalSubmissionSectionEditPage>
 *   }
 * />
 */
export const DigitalSubmissionSectionEditPage = ({children}) => {
    const {id} = useParams()
    const digitalsubmissionsection = {id}
    return (
        <DigitalSubmissionSectionPageContentLazy digitalsubmissionsection={digitalsubmissionsection}>
            <DigitalSubmissionSectionLiveEdit digitalsubmissionsection={digitalsubmissionsection} />
            {children}
        </DigitalSubmissionSectionPageContentLazy>
    )
}