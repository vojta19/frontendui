import { useParams } from "react-router"
import { DigitalFormSectionPageContentLazy } from "./DigitalFormSectionPageContentLazy"
import { DigitalFormSectionLiveEdit } from "../Components"

/**
 * DigitalFormSectionEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `digitalformsection`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/digitalformsection/:id`).
 * - Vytvoří objekt `digitalformsection` s tímto `id` a předává jej do komponenty `DigitalFormSectionPageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `DigitalFormSectionPageContentLazy` vykresluje editační rozhraní pomocí `DigitalFormSectionLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `digitalformsection` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { digitalformsection: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `DigitalFormSectionPageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (digitalformsection) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/digitalformsection/:id" element={<DigitalFormSectionEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/digitalformsection/:id"
 *   element={
 *     <DigitalFormSectionEditPage>
 *       {({ digitalformsection, onChange, onBlur }) => (
 *         <input value={digitalformsection.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalFormSectionEditPage>
 *   }
 * />
 */
export const DigitalFormSectionEditPage = ({children}) => {
    const {id} = useParams()
    const digitalformsection = {id}
    return (
        <DigitalFormSectionPageContentLazy digitalformsection={digitalformsection}>
            <DigitalFormSectionLiveEdit digitalformsection={digitalformsection} />
            {children}
        </DigitalFormSectionPageContentLazy>
    )
}