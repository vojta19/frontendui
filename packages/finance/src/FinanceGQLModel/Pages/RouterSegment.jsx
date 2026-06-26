// Importuje celostránkovou komponentu pro přehled kolekce/vektoru dat (PageVector)
import { PageVector } from "./PageVector";

// Importuje celostránkovou komponentu pro úpravu položky (PageUpdateItem)
import { PageUpdateItem } from "./PageUpdateItem";

// Importuje celostránkovou komponentu pro vytvoření nové položky (PageCreateItem)
import { PageCreateItem } from "./PageCreateItem";

// Importuje celostránkovou komponentu pro čtení detailu položky (PageReadItem)
import { PageReadItem } from "./PageReadItem";

// Importuje celostránkovou komponentu pro smazání položky (PageDeleteItem)
import { PageDeleteItem } from "./PageDeleteItem";

// Importuje konstanty URI cest pro operace smazání a úpravy z lokálního adresáře Components
import { DeleteItemURI, UpdateItemURI } from "../Components";

// Importuje konstanty URI cest pro operace vytvoření, zobrazení a výpisu seznamu z lokálního adresáře Components
import { CreateURI, ReadItemURI, VectorItemsURI } from "../Components";

/**
 * Definice segmentů rout pro Template stránky.
 *
 * Každý objekt v tomto poli popisuje jednu trasu (route) v aplikaci:
 * - `path`: Stringová URL s parametrem `:id`, která identifikuje konkrétní instanci template entity.
 * - `element`: React komponenta, která se má renderovat při shodě s cestou.
 *
 * Pokud komponenta stránky podporuje children jako render funkci,
 * všechny children předané přes router budou dostávat objekt:
 * - `template` — načtená entita podle `:id`
 * - `onChange` — callback pro změnu hodnoty pole
 * - `onBlur` — callback pro blur event (například při opuštění pole)
 *
 * @constant
 * @type {Array<{ path: string, element: JSX.Element }>}
 *
 * @example
 * // Tato route reaguje na URL jako "/template/123"
 * {
 * path: "/template/:id",
 * element: <TemplatePage />
 * }
 *
 * // Editační route: "/template/edit/123"
 * {
 * path: "/template/edit/:id",
 * element: <TemplateEditPage />
 * }
 */
// Exportuje konfigurační pole objektů definující aplikační cesty (routes) pro celý finanční subsystém
export const FinanceGQLModelRouterSegments = [
    {
        // Route cesta pro založení nového finančního záznamu
        path: CreateURI,
        // Přiřazená komponenta, která vykreslí celostránkový vytvářecí formulář
        element: (<PageCreateItem />),
    },
    {
        // Route cesta pro zobrazení přehledové tabulky (seznamu) všech prvků
        path: VectorItemsURI,
        // Přiřazená komponenta s tabulkou a nekonečným scrollováním
        element: (<PageVector />),
    },
    {
        // Route cesta pro zobrazení detailu konkrétní položky podle jejího ID v URL
        path: ReadItemURI,
        // Přiřazená komponenta s interaktivním Sunburst grafem a přehledy
        element: (<PageReadItem />),
    },
    {
        // Route cesta pro přechod na celostránkový editační formulář položky podle ID
        path: UpdateItemURI,
        // Přiřazená komponenta zajišťující sběr dat a odeslání mutace úpravy
        element: (<PageUpdateItem />),
    },   
    {
        // Route cesta pro zobrazení celostránkového potvrzení ke smazání položky podle ID
        path: DeleteItemURI,
        // Přiřazená komponenta se systémem odstranění záznamu
        element: (<PageDeleteItem />),
    },   
    // PŮVODNÍ ZAKOMENTOVANÁ ROUTE PRO ROLÍCH NA ENTITĚ:
    // {
    // path: "sad",
    // element: (<PageReadItemRolesOn />)
    // },
    {
        // Dynamická catch-all route pro výpisy: nahrazuje fixní "list" v URL zástupným parametrem ":any"
        path: VectorItemsURI.replace("list", ":any"),
        // Zachytává alternativní URL schémata seznamu a směruje je na standardní PageVector
        element: (<PageVector />),
    },
    {
        // Dynamická catch-all route pro detaily: nahrazuje fixní "view" v URL zástupným parametrem ":any"
        path: ReadItemURI.replace("view", ":any"),
        // Zachytává alternativní nebo doplňková URL schémata detailu a směruje je na standardní PageReadItem
        element: (<PageReadItem />),
    }    
]; // Konec definice pole FinanceGQLModelRouterSegments