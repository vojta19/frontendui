import { useParams } from "react-router"
import { DigitalFormPageContentLazy } from "./DigitalFormPageContentLazy"
import { DigitalFormLiveEdit } from "../Components"

/**
 * DigitalFormEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `digitalform`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/digitalform/:id`).
 * - Vytvoří objekt `digitalform` s tímto `id` a předává jej do komponenty `DigitalFormPageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `DigitalFormPageContentLazy` vykresluje editační rozhraní pomocí `DigitalFormLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `digitalform` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { digitalform: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `DigitalFormPageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (digitalform) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/digitalform/:id" element={<DigitalFormEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/digitalform/:id"
 *   element={
 *     <DigitalFormEditPage>
 *       {({ digitalform, onChange, onBlur }) => (
 *         <input value={digitalform.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </DigitalFormEditPage>
 *   }
 * />
 */
export const DigitalFormEditPage = ({children}) => {
    const {id} = useParams()
    const digitalform = {id}
    return (
        <DigitalFormPageContentLazy digitalform={digitalform}>
            <DigitalFormLiveEdit digitalform={digitalform} />
            {children}
        </DigitalFormPageContentLazy>
    )
}