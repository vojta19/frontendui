// Importuje výchozí asynchronní síťovou akci (thunk) pro načítání dat záznamu ze souboru Queries
import { ReadAsyncAction } from "../Queries";

// Importuje layout komponentu Row pro definici řádků flexibilní mřížky ze šablony
import { Row } from "../../../../_template/src/Base/Components/Row";

// Importuje komponentu CreateBody (celostránkový formulář pro vytvoření entity) z lokálního adresáře Mutations
import { CreateBody } from "../Mutations/Create";

// Importuje předdefinované layoutové sloupce (LeftColumn, MiddleColumn) ze sdíleného balíčku frontend utilit
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared";

// Importuje základní obalovou komponentu stránky (PageItemBase) z lokálního souboru PageBase
import { PageItemBase } from "./PageBase";

// Definuje vnitřní layout komponentu PageBody, která rozřazuje obsah formuláře do dvousloupcové mřížky
const PageBody = ({ ...props }) => (
    // Obaluje sloupce do jednoho řádku mřížky
    <Row>
        {/* Vykresluje levý postranní sloupec (např. pro navigaci nebo boční panely) */}
        <LeftColumn />
        
        {/* Vykresluje hlavní středový sloupec, do kterého vkládá celostránkový formulář CreateBody a předává mu všechny props */}
        <MiddleColumn>
            <CreateBody {...props} />
        </MiddleColumn>
    </Row>
); // Konec definice komponenty PageBody

// Definuje a exportuje hlavní komponentu PageCreateItem reprezentující celou stránku pro vytvoření nového záznamu
export const PageCreateItem = ({ 
    SubPage = PageBody, // Nastavuje dříve definovanou komponentu PageBody jako výchozí podstránku layoutu
    ...props // Zachytává všechny ostatní vlastnosti (jako jsou thunky, rbac nastavení nebo children) pro přeposlání
}) => {
    
    // Vrací základní obalovou stránku (PageItemBase), které předává nakonfigurovanou SubPage a zbylé parametry
    return (
        <PageItemBase 
            SubPage={SubPage} // Registruje dvousloupcový layout s formulářem do základní stránky
            {...props} // Rozbaluje všechny ostatní parametry přímo na komponentu
        />
    ); // Konec návratové hodnoty komponenty PageCreateItem
}; // Konec definice komponenty PageCreateItem