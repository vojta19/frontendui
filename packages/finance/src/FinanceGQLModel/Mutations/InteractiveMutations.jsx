// Importuje obalovou kartu (CardCapsule) a výchozí URI seznamu položek (VectorItemsURI) z lokálních komponent
import { CardCapsule, VectorItemsURI } from "../Components";

// Importuje komponenty pro operaci vytvoření (CreateButton, CreateLink) z lokálního adresáře Create
import { CreateButton, CreateLink } from "./Create";

// Importuje komponenty pro operaci aktualizace (UpdateButton, UpdateLink) z lokálního adresáře Update
import { UpdateButton, UpdateLink } from "./Update";

// Importuje optimalizovanou komponentu ProxyLink pro bezpečné vnitřní routování ze sdílené šablony
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";

// Importuje tlačítko pro operaci smazání (DeleteButton) z lokálního adresáře Delete
import { DeleteButton } from "./Delete";

// Definuje a exportuje komponentu PageLink pro rychlé odkazování na celkovou kolekci/seznam modelů
export const PageLink = ({ children, preserveHash = true, preserveSearch = true, ...props }) => {
    
    // Vrací komponentu ProxyLink nastavenou pro navigaci na VectorItemsURI
    return (
        <ProxyLink
            to={VectorItemsURI} // Cílová URL adresa (seznam prvků)
            preserveHash={preserveHash} // Volba zachování kotev (#) v URL adrese při přesměrování
            preserveSearch={preserveSearch} // Volba zachování vyhledávacích parametrů (?query=) v URL adrese
            {...props} // Přeposílá všechny zbylé atributy (např. className nebo titulek)
        >
            {/* Vykresluje vnitřní text nebo elementy odkazu */}
            {children}
        </ProxyLink>
    ); // Konec návratové hodnoty komponenty PageLink
}; // Konec definice komponenty PageLink

// Definuje a exportuje komponentu InteractiveMutations, která sdružuje všechna akční tlačítka (nástroje) pro danou entitu
export const InteractiveMutations = ({ item }) => {
    
    // Vrací designovou kartu (kapsli) naplněnou sadou odkazů a tlačítek pro mutaci dat
    return (
        // Obaluje tlačítka do karty s nadpisem "Nástroje" a předává jí aktuální položku
        <CardCapsule item={item} title="Nástroje">
            
            {/* Odkaz typu tlačítko pro přechod na hlavní přehledovou stránku seznamu */}
            <PageLink className="btn btn-outline-success">Stránka</PageLink>
            
            {/* Odkaz pro celostránkový přechod na editační formulář konkrétní položky */}
            <UpdateLink className="btn btn-outline-success" item={item}>Upravit</UpdateLink>
            
            {/* Tlačítko, které otevře modální dialogové okno pro inline úpravu položky na místě */}
            <UpdateButton className="btn btn-outline-success" item={item}>Upravit Dialog</UpdateButton>
            
            {/* Tlačítko, které otevře modální dialog pro vytvoření nové položky s prázdným RBAC kontextem */}
            <CreateButton className="btn btn-outline-success" rbacitem={{}}>Vytvořit nový</CreateButton>
            
            {/* Destruktivní tlačítko červené barvy, které vyvolá potvrzovací dialog pro smazání této položky */}
            <DeleteButton className="btn btn-outline-danger" item={item}>Odstranit</DeleteButton>
            
        </CardCapsule> // Konec obalové komponenty karty
    ); // Konec návratové hodnoty komponenty InteractiveMutations
}; // Konec definice komponenty InteractiveMutations