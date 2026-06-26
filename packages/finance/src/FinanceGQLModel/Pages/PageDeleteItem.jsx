// Importuje základní obalovou komponentu stránky (PageItemBase) z lokálního souboru PageBase
import { PageItemBase } from "./PageBase";

// Importuje komponentu DeleteBody (celostránkový workflow pro smazání entity) z lokálního adresáře Mutations
import { DeleteBody } from "../Mutations/Delete";

// Definuje a exportuje komponentu PageDeleteItem reprezentující celou stránku pro odstranění záznamu
export const PageDeleteItem = ({ 
    SubPage = DeleteBody, // Nastavuje celostránkové mazání (DeleteBody) jako výchozí podstránku layoutu
    ...props // Zachytává všechny ostatní vlastnosti (např. thunky, item, rbac) pro přeposlání
}) => {
    
    // Vrací základní obalovou stránku (PageItemBase), které předává nakonfigurovanou SubPage a zbylé parametry
    return (
        <PageItemBase
            SubPage={SubPage} // Registruje celostránkové mazání do základní stránky
            {...props} // Rozbaluje všechny ostatní parametry přímo na komponentu
        />
    ); // Konec návratové hodnoty komponenty PageDeleteItem
}; // Konec definice komponenty PageDeleteItem