import { useParams } from "react-router"
import { RequestTypePageContentLazy } from "./RequestTypePageContentLazy"
import { RequestTypeLiveEdit } from "../Components"

/**
 * RequestTypeEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `requesttype`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/requesttype/:id`).
 * - Vytvoří objekt `requesttype` s tímto `id` a předává jej do komponenty `RequestTypePageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `RequestTypePageContentLazy` vykresluje editační rozhraní pomocí `RequestTypeLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `requesttype` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { requesttype: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `RequestTypePageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (requesttype) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/requesttype/:id" element={<RequestTypeEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/requesttype/:id"
 *   element={
 *     <RequestTypeEditPage>
 *       {({ requesttype, onChange, onBlur }) => (
 *         <input value={requesttype.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </RequestTypeEditPage>
 *   }
 * />
 */
export const RequestTypeEditPage = ({children}) => {
    const {id} = useParams()
    const requesttype = {id}
    return (
        <RequestTypePageContentLazy requesttype={requesttype}>
            <RequestTypeLiveEdit requesttype={requesttype} />
            {children}
        </RequestTypePageContentLazy>
    )
}