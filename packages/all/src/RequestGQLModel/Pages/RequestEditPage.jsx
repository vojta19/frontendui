import { useParams } from "react-router"
import { RequestPageContentLazy } from "./RequestPageContentLazy"
import { RequestLiveEdit } from "../Components"

/**
 * RequestEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `request`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/request/:id`).
 * - Vytvoří objekt `request` s tímto `id` a předává jej do komponenty `RequestPageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `RequestPageContentLazy` vykresluje editační rozhraní pomocí `RequestLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `request` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { request: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `RequestPageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (request) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/request/:id" element={<RequestEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/request/:id"
 *   element={
 *     <RequestEditPage>
 *       {({ request, onChange, onBlur }) => (
 *         <input value={request.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </RequestEditPage>
 *   }
 * />
 */
export const RequestEditPage = ({children}) => {
    const {id} = useParams()
    const request = {id}
    return (
        <RequestPageContentLazy request={request}>
            <RequestLiveEdit request={request} />
            {children}
        </RequestPageContentLazy>
    )
}