// Importuje základní hooky useEffect, useMemo a useState z knihovny React pro řízení životního cyklu a stavu
import { useEffect, useMemo, useState } from "react";

// Importuje hook useParams z knihovny react-router pro přístup k parametrům v URL adrese
import { useParams } from "react-router";

// Importuje vlastní hook useAsyncThunkAction z dynamické části sdílené šablony prvků
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";

// Importuje asynchronní akci FinanceTransferPageAsyncAction pro načítání stránek finančních přesunů
import { FinanceTransferPageAsyncAction } from "../Queries/FinanceTransferPageAsyncAction";

// Importuje hook useGQLType pro dynamickou detekci schématu a dotazů na základě GraphQL typu
import { useGQLType } from "../../../../dynamic/src/Hooks/useGQLType";

// Importuje vizualizační komponentu FinanceTransferSunburst pro vykreslení přesunů v diagramu
import { FinanceTransferSunburst } from "../Components/FinanceTransferSunburst";

// Importuje designovou komponentu velké karty (LargeCard) ze sdílené šablony komponent
import { LargeCard } from "../../../../_template/src/Base/Components/LargeCard";

// Importuje standardní obalovou kartu (CardCapsule) pro sekce stránky
import { CardCapsule } from "../../../../_template/src/Base/Components/CardCapsule";

// Importuje komponenty pro zobrazení skalárních (jednoduchých) atributů objektu
import { MediumCardScalars, ScalarAttribute } from "../../../../_template/src/Base/Scalars/ScalarAttribute";

// Importuje komponenty pro zobrazení vektorových (pole/seznamy) atributů objektu
import { MediumCardVectors, VectorAttribute } from "../../../../_template/src/Base/Vectors/VectorAttribute";

// Importuje pomocný kontextový hook a provider pro správu asynchronních GraphQL dat entity
import { useGQLEntityContext, AsyncActionProvider } from "../../../../_template/src/Base/Helpers/GQLEntityProvider";

// Importuje layout komponentu Row pro řádky flexibilní mřížky (Grid)
import { Row } from "../../../../_template/src/Base/Components/Row";

// Importuje layout komponentu Col pro sloupce flexibilní mřížky (Grid)
import { Col } from "../../../../_template/src/Base/Components/Col";

// Importuje vizuální prvek pro rohové akce karty ze sdíleného balíčku frontend utilit
import { SimpleCardCapsuleRightCorner } from "@hrbolek/uoisfrontend-shared";

// Importuje komponentu CopyButton, která po kliknutí zkopíruje zadaný text do schránky
import { CopyButton } from "../../../../_template/src/Base/Components/CopyButton";

// Importuje výchozí thunk akci ReadAsyncAction pro načítání dat ze souboru Queries
import { ReadAsyncAction } from "../Queries";

// Pomocná funkce pro bezpečné nalezení a vytažení ID zdrojové finance z různých struktur objektu
const getTransferSourceId = (transfer) => {
    
    // Vrací první existující nenulový identifikátor zdroje na základě prioritního řetězce
    return (
        transfer?.financeSourceId ?? // Zkusí přímé ID financeSourceId
        transfer?.financeTransfer_financeSourceId ?? // Zkusí prefixované ID z plochého filtru
        transfer?.sourceFinanceId ?? // Zkusí alternativní název sourceFinanceId
        transfer?.sourceId ?? // Zkusí zkrácené sourceId
        transfer?.financeSource?.id ?? // Zkusí zanořené ID objektu financeSource
        transfer?.source?.id ?? // Zkusí zanořené ID objektu source
        null // Pokud nic neexistuje, vrací null
    ); // Konec prioritního řetězce
}; // Konec definice funkce getTransferSourceId

// Pomocná funkce pro bezpečné nalezení a vytažení ID cílové (destinační) finance z různých struktur objektu
const getTransferDestinationId = (transfer) => {
    
    // Vrací první existující nenulový identifikátor cíle na základě prioritního řetězce
    return (
        transfer?.financeDestinationId ?? // Zkusí přímé ID financeDestinationId
        transfer?.financeTransfer_financeDestinationId ?? // Zkusí prefixované ID z plochého filtru
        transfer?.destinationFinanceId ?? // Zkusí alternativní název destinationFinanceId
        transfer?.destinationId ?? // Zkusí zkrácené destinationId
        transfer?.financeDestination?.id ?? // Zkusí zanořené ID objektu financeDestination
        transfer?.destination?.id ?? // Zkusí zanořené ID objektu destination
        null // Pokud nic neexistuje, vrací null
    ); // Konec prioritního řetězce
}; // Konec definice funkce getTransferDestinationId

// Funkce normalizuje data přesunu, sjednocuje klíče a ověřuje validitu finanční částky
const normalizeTransfer = (transfer) => {
    
    // Pokud přesun neexistuje nebo to není objekt, okamžitě vrací null
    if (!transfer || typeof transfer !== "object") return null;

    // Vytahuje zdrojové ID pomocí dříve definované pomocné funkce
    const financeSourceId = getTransferSourceId(transfer);
    
    // Vytahuje cílové ID pomocí dříve definované pomocné funkce
    const financeDestinationId = getTransferDestinationId(transfer);
    
    // Sjednocuje a převádí hodnotu částky na číslo s výchozí hodnotou 0
    const amount = Number(
        transfer.amount ?? // Výchozí klíč amount
        transfer.financeTransfer_amount ?? // Prefixovaný klíč ze specifického datasetu
        transfer.value ?? // Alternativní klíč value
        0 // Záložní nula
    ); // Konec parsování částky

    // Validace: Pokud chybí zdroj, cíl, částka není konečné číslo nebo je nulová, přesun je nevalidní
    if (!financeSourceId || !financeDestinationId || !Number.isFinite(amount) || amount === 0) {
        return null; // Vrací null pro nevalidní přesun
    } // Konec validace

    // Vrací nový objekt kombinující původní vlastnosti a sjednocené normalizované klíče
    return {
        ...transfer, // Rozbalení původního objektu
        financeSourceId, // Dosazení sjednoceného zdrojového ID
        financeDestinationId, // Dosazení sjednoceného cílového ID
        amount, // Dosazení převedeného čísla částky
    }; // Konec návratového objektu
}; // Konec definice funkce normalizeTransfer

// Funkce rekurzivně projde celý finanční strom a posbírá z něj všechny přítomné pole přesunů
const collectTransfers = (item) => {
    
    // Inicializuje prázdné pole pro ukládání nalezených přesunů
    const transfers = [];
    
    // Set pro evidenci již navštívených uzlů kvůli ochraně před zacyklením v grafu
    const visitedNodes = new Set();

    // Vnitřní rekurzivní funkce pro průchod uzly stromu
    const collect = (node) => {
        
        // Pokud uzel neexistuje nebo není objekt, rekurze končí
        if (!node || typeof node !== "object") return;
        
        // Pokud jsme tento uzel již navštívili, přeskočíme ho (ochrana před cykly)
        if (visitedNodes.has(node)) return;
        
        // Zaregistruje aktuální uzel do seznamu navštívených
        visitedNodes.add(node);

        // Seznam všech možných klíčů, pod kterými se v objektu mohou skrývat pole přesunů
        const possibleTransferArrays = [
            node.financeTransfers,
            node.transfers,
            node.incomingTransfers,
            node.outgoingTransfers,
            node.financeSourceTransfers,
            node.financeDestinationTransfers,
        ]; // Konec pole klíčů

        // Prochází jednotlivá pole potenciálních přesunů
        possibleTransferArrays.forEach(array => {
            
            // Pokud vlastnost není polem, ignoruje ji
            if (!Array.isArray(array)) return;

            // Prochází jednotlivé objekty přesunů v poli
            array.forEach(transfer => {
                
                // Pokusí se o normalizaci objektu přesunu
                const normalizedTransfer = normalizeTransfer(transfer);
                
                // Pokud je přesun validní (není null), vloží ho do sběrného pole transfers
                if (normalizedTransfer) transfers.push(normalizedTransfer);
            }); // Konec vnitřního forEach přesuny
        }); // Konec vnějšího forEach pole

        // Pokud uzel obsahuje pole podřízených financí (subfinances), rekurzivně je projde
        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(collect); // Volá rekurzi pro každou subfinance
        } // Konec kontroly subfinances
    }; // Konec definice vnitřní funkce collect

    // Spustí rekurzi od hlavního předaného kořenového objektu item
    collect(item);

    // Vytvoří Mapu pro odstranění duplicitních přesunů na základě ID nebo složeného klíče
    const transferMap = new Map();
    
    // Prochází posbírané přesuny a ukládá je do mapy
    transfers.forEach((transfer, index) => {
        
        // Generuje unikátní klíč: použije ID přesunu nebo složený řetězec z parametrů a indexu
        const key = transfer.id ?? `${transfer.financeSourceId}-${transfer.financeDestinationId}-${transfer.amount}-${index}`;
        
        // Uloží přesun do mapy pod vygenerovaným klíčem (případná duplicita přepíše předchozí)
        transferMap.set(key, transfer);
    }); // Konec pročištění duplicit

    // Vrací čisté pole unikátních přesunů vytažením hodnot z mapy
    return [...transferMap.values()];
}; // Konec definice funkce collectTransfers

// Rekurzivní funkce, která aplikuje finanční přesuny (přičte/odečte částky) na hodnoty celého stromu financí
const applyTransfersToFinanceTree = (finances = [], transfers = []) => {
    
    // Mapuje pole financí na nové objekty s přepočítanými hodnotami
    return finances.map(finance => {
        
        // Spočítá sumu všech odchozích transferů z této konkrétní finance
        const outgoing = transfers
            .filter(transfer => transfer.financeSourceId === finance.id) // Filtruje přesuny, kde je finance zdrojem
            .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0); // Sčítá částky

        // Spočítá sumu všech příchozích transferů do této konkrétní finance
        const incoming = transfers
            .filter(transfer => transfer.financeDestinationId === finance.id) // Filtruje přesuny, kde je finance cílem
            .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0); // Sčítá částky

        // Vrací modifikovaný objekt finance s upravenou hodnotou a rekurzivně zpracovanými potomky
        return {
            ...finance, // Zachová původní vlastnosti finance
            value: Number(finance.value || 0) - outgoing + incoming, // Přepočet hodnoty (původní - odchozí + příchozí)
            subfinances: Array.isArray(finance.subfinances) // Pokud existují subfinances, rekurzivně je přepočítá
                ? applyTransfersToFinanceTree(finance.subfinances, transfers)
                : finance.subfinances, // Jinak ponechá původní hodnotu subfinances
        }; // Konec mapovaného objektu
    }); // Konec mapování pole
}; // Konec definice funkce applyTransfersToFinanceTree

// Funkce naformátuje a upraví kořenový item dosazením přepočítaného subfinance stromu
const patchFinanceItem = (item, localTransfers = []) => {
    
    // Pokud item neexistuje nebo to není objekt, vrátí ho beze změny
    if (!item || typeof item !== "object") return item;

    // Normalizuje pole lokálních přesunů a vyfiltruje pouze validní objekty (Boolean odfiltruje null)
    const normalizedLocalTransfers = localTransfers
        .map(normalizeTransfer)
        .filter(Boolean); // Konec čistění pole přesunů

    // Vrací upravenou položku s nově přepočítaným polem podřízených subfinances
    return {
        ...item, // Rozbalí původní položku
        subfinances: applyTransfersToFinanceTree(
            item.subfinances ?? [], // Pokud subfinances chybí, použije prázdné pole
            normalizedLocalTransfers // Předá vyčištěné transfery pro matematický přepočet
        ), // Konec přiřazení subfinances
    }; // Konec návratu objektu
}; // Konec definice funkce patchFinanceItem

// Pomocná rekurzivní funkce, která posbírá všechna unikátní ID ze stromu financí do Setu
const collectFinanceIds = (finance) => {
    
    // Inicializuje nový Set pro ukládání unikátních ID
    const ids = new Set();

    // Vnitřní rekurzivní funkce pro průchod uzly stromu financí
    const walk = (node) => {
        
        // Pokud uzel neexistuje nebo není objekt, rekurzivní větev končí
        if (!node || typeof node !== "object") return;

        // Pokud má uzel platné ID, přidá ho do Setu
        if (node.id) {
            ids.add(node.id);
        } // Konec kontroly ID

        // Pokud uzel obsahuje pole subfinances, rekurzivně pokračuje v průchodu dolů
        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(walk); // Průchod dětí
        } // Konec kontroly subfinances
    }; // Konec definice vnitřní funkce walk

    // Spustí rekurzi od předaného hlavního objektu finance
    walk(finance);

    // Vrací naplněný Set s unikátními identifikátory
    return ids;
}; // Konec definice funkce collectFinanceIds

// Pomocná rekurzivní funkce sestavující mapu vazeb, kde klíčem je ID dítěte a hodnotou ID jeho přímého rodiče
const buildParentMap = (finance) => {
    
    // Inicializuje prázdnou Mapu pro ukládání relací dítě -> rodič
    const parentById = new Map();

    // Vnitřní rekurzivní funkce procházející strom
    const walk = (node, parentId = null) => {
        
        // Pokud uzel chybí nebo není objekt, rekurze končí
        if (!node || typeof node !== "object") return;

        // Pokud uzel má ID, uloží relaci do mapy k příslušnému parentId
        if (node.id) {
            parentById.set(node.id, parentId);
        } // Konec uložení relace

        // Pokud existují subfinances, rekurzivně je projde a předá jim aktuální node.id jako parentId
        if (Array.isArray(node.subfinances)) {
            node.subfinances.forEach(child => walk(child, node.id)); // Rekurzivní volání pro potomky
        } // Konec kontroly subfinances
    }; // Konec definice vnitřní funkce walk

    // Spustí sestavení mapy od kořene, kde výchozí rodič je null
    walk(finance);

    // Vrací kompletní mapu hierarchických vazeb rodokmenu
    return parentById;
}; // Konec definice funkce buildParentMap

// Funkce zjišťuje, zda je jedno ID (ancestorId) přímým nebo nepřímým předkem druhého ID (childId) v hierarchii
const isAncestor = (ancestorId, childId, parentById) => {
    
    // Načte ID přímého rodiče daného dítěte z předpřipravené mapy rodičů
    let currentId = parentById.get(childId);

    // Cyklus prochází stromem směrem nahoru (k rodičům), dokud nenarazí na kořen (null)
    while (currentId) {
        
        // Pokud se ID aktuálně kontrolovaného rodiče shoduje s hledaným předkem, vrací true
        if (currentId === ancestorId) return true;
        
        // Posune se v hierarchii o úroveň výše (načte rodiče aktuálního rodiče)
        currentId = parentById.get(currentId);
    } // Konec cyklu while

    // Pokud cyklus doběhl až ke kořeni a předka nenašel, vrací false
    return false;
}; // Konec definice funkce isAncestor

// Funkce vyfiltruje pouze ty přesuny, které jsou relevantní pro aktuální strom (např. vyloučí vnitro-strukturální přesuny mezi rodičem a dítětem)
const filterRelevantTransfers = (transfers, item) => {
    
    // Posbírá všechna ID přítomná v aktuálním finančním podstromu položky
    const financeIds = collectFinanceIds(item);
    
    // Sestaví hierarchickou mapu rodičů pro detekci předků
    const parentById = buildParentMap(item);
    
    // Inicializuje mapu pro ukládání unikátních profiltrovaných přesunů
    const uniqueTransfers = new Map();

    // Prochází pole všech dostupných přesunů (v případě chybějícího pole použije prázdné)
    for (const transfer of transfers || []) {
        
        // Získává zdrojové a cílové ID z objektu transferu
        const sourceId = transfer?.financeSourceId;
        const destinationId = transfer?.financeDestinationId;

        // Kontrola: Oba uzly (zdroj i cíl) musí fyzicky existovat v aktuálně zobrazeném podstromu
        const bothAreInCurrentTree = financeIds.has(sourceId) && financeIds.has(destinationId);

        // Pokud alespoň jeden z uzlů v aktuálním podstromu chybí, přesun ignorujeme a pokračujeme dalším
        if (!bothAreInCurrentTree) continue;

        // Strukturální kontrola: Zjišťuje, zda se nejedná o přesun po přímé vertikální linii (rodič -> potomek nebo naopak)
        const isStructuralTransfer = isAncestor(sourceId, destinationId, parentById) || isAncestor(destinationId, sourceId, parentById);

        // Pokud jde o vnitro-strukturální přesun v rámci jedné větve, tak ho přeskočíme
        if (isStructuralTransfer) continue;

        // Sestaví unikátní řetězcový klíč pro eliminaci duplicitních záznamů
        const key = transfer.id || `${sourceId}-${destinationId}-${transfer.amount}-${transfer.name}`;

        // Pokud mapa unikátních transferů tento klíč ještě neobsahuje, vloží přesun dovnitř
        if (!uniqueTransfers.has(key)) {
            uniqueTransfers.set(key, transfer);
        } // Konec uložení unikátního klíče
    } // Konec cyklu for-of

    // Vrací pole vyčištěných a relevantních finančních přesunů vytažením prvků z mapy
    return Array.from(uniqueTransfers.values());
}; // Konec definice funkce filterRelevantTransfers

// Definuje a exportuje komponentu GeneratedContentBase, která na pozadí načítá přesuny z API a patchuje finanční data
export const GeneratedContentBase = ({ item, onTransferInserted = () => { } }) => {
    
    // Vypisuje trasovací zprávu do vývojářské konzole o vstupu do komponenty
    console.log("JSEM V GENERATEDCONTENTBASE", item);

    // Stav pro uložení surových přesunů načtených z backendu (výchozí je prázdné pole)
    const [backendTransfers, setBackendTransfers] = useState([]);

    // Využívá hook useAsyncThunkAction pro registraci thunku načítání dat přesunů v odloženém síťovém režimu
    const { run: runFinanceTransferPage } = useAsyncThunkAction(
        FinanceTransferPageAsyncAction,
        {},
        { deferred: true, network: true }
    ); // Konec registrace thunku

    // Asynchronní funkce, která fyzicky vyvolá síťový dotaz a uloží načtené transfery do stavu
    const loadTransfers = async () => {
        
        // Loguje spuštění načítání dat
        console.log("LOAD TRANSFERS START");

        // Blok try-catch ošetřuje potenciální síťové výpadky nebo chyby API dotazu
        try {
            
            // Spouští asynchronní dotaz s parametry stránkování a řazení podle data vytvoření
            const result = await runFinanceTransferPage({
                skip: 0, // Začátek od nultého prvku
                limit: 1000, // Maximální limit načtených záznamů
                orderby: "created" // Řazení podle klíče created
            }); // Konec await volání thunku

            // Loguje surovou odpověď obdrženou z backendu
            console.log("RAW FINANCE TRANSFER PAGE RESULT:", result);

            // Bezpečně vytáhne pole transferů z odpovědi, v případě absence nastaví prázdné pole
            const transfers = result?.data?.financeTransferPage || []

            // Loguje očištěné pole transferů připravené ke zpracování
            console.log("FINANCE TRANSFER PAGE:", transfers);

            // Uloží stažené transfery do lokálního stavu backendTransfers
            setBackendTransfers(transfers);
            
        } catch (error) {
            
            // Loguje případnou chybu zachycenou během asynchronní síťové komunikace
            console.error("LOAD TRANSFERS ERROR:", error);
        } // Konec bloku try-catch
    }; // Konec definice funkce loadTransfers

    // useEffect hook spustí načítání dat přesunů ihned po prvním vyrenderování komponenty do DOMu
    useEffect(() => {
        loadTransfers(); // Volá načítací funkci
    }, []); // Prázdné pole závislostí znamená spuštění pouze při mountu

    // Pomocí useMemo vypočítá a optimalizuje upravený finanční strom (patchedItem) na základě načtených dat
    const patchedItem = useMemo(() => {
        
        // Pokud kořenový item neexistuje, vrátí ho přímo bez provádění dalších úprav
        if (!item) return item;

        // Profiltruje backendové transfery a ponechá pouze ty, které se týkají aktuálního podstromu financí
        const relevantTransfers = filterRelevantTransfers(backendTransfers, item);

        // Ladící výpisy celkových a relevantních transferů pro konzoli
        console.log("ALL BACKEND TRANSFERS:", backendTransfers);
        console.log("RELEVANT TRANSFERS:", relevantTransfers);
        
        // Mapa pro rychlé párování názvů financí k jejich ID (využito pro vizuální tabulku v konzoli)
        const financeNameById = new Map();

        // Pomocná vnitřní funkce pro rekurzivní sběr jmen financí podle ID
        const collectFinanceNames = (node) => {
            
            // Pokud uzel neexistuje nebo není objekt, ukončí větev
            if (!node || typeof node !== "object") return;

            // Pokud uzel má ID, uloží jeho název do mapy názvů
            if (node.id) {
                financeNameById.set(node.id, node.name);
            } // Konec uložení názvu

            // Pokud uzel obsahuje subfinances, pokračuje rekurzí dolů
            if (Array.isArray(node.subfinances)) {
                node.subfinances.forEach(collectFinanceNames); // Rekurzivní průchod
            } // Konec kontroly subfinances
        }; // Konec definice vnitřní funkce collectFinanceNames

        // Spustí sběr jmen z předaného itemu
        collectFinanceNames(item);

        // Vykreslí do vývojářské konzole přehlednou formátovanou tabulku relevantních transferů včetně lidských jmen uzlů
        console.table(
            relevantTransfers.map(t => ({
                id: t.id,
                name: t.name,
                amount: Number(t.amount || 0),
                sourceId: t.financeSourceId,
                sourceName: financeNameById.get(t.financeSourceId), // Vytáhne lidské jméno zdroje z mapy
                destinationId: t.financeDestinationId,
                destinationName: financeNameById.get(t.financeDestinationId), // Vytáhne lidské jméno cíle z mapy
            })) // Konec struktury objektu pro tabulku
        ); // Konec konzolového výpisu console.table

        // Vrací nově napatchovaný finanční objekt upravený o hodnoty relevantních transferů
        return patchFinanceItem(item, relevantTransfers);
        
    }, [item, backendTransfers]); // Přepočítá se pouze při změně položky nebo načtení nových transferů

    // Callback handler reagující na úspěšné vložení nového transferu z vnitřního formuláře
    const handleTransferInserted = async (transfer) => {
        
        // Loguje vložení nového přesunu a oznamuje opětovné synchronizační stažení dat
        console.log("TRANSFER HOTOVY, NACITAM TRANSFERY ZNOVU:", transfer);

        // Znovu zavolá asynchronní načtení dat z backendu pro zaktualizování stavu a grafu
        await loadTransfers();
    }; // Konec definice funkce handleTransferInserted

    // Podmínka: Pokud položka neexistuje, zobrazí uživateli textové upozornění v fragmentu
    if (!item) return <>Položka nenalezena</>;

    // Vrací vizuální rozhraní tvořené Sunburst diagramem a tabulkou vektorových vlastností
    return (
        <>
            {/* Vykresluje interaktivní kruhový diagram přesunů s upraveným finančním stromem */}
            <FinanceTransferSunburst
                item={patchedItem} // Předává přepočítaná finanční data
                header="Graf finančních přesunů" // Titulek komponenty diagramu
                onTransferInserted={handleTransferInserted} // Předává callback pro překreslení po uložení
            />
            {/* Vykresluje tabulky a seznamy podřízených vektorových vazeb s unikátním React klíčem */}
            <MediumCardVectors key="MediumCardVectors" item={patchedItem} />
        </>
    ); // Konec návratové hodnoty JSX fragmentu
}; // Konec definice komponenty GeneratedContentBase

// Komponenta spravující vnitřní strukturní rozřazení prvků na detailu finanční stránky
const PageItemInnerStructure = ({
    PageNavbar = null, // Volitelná navigační lišta specifická pro entitu
    ItemLayout = LargeCard, // Výchozí layout prvek (velká karta) obalující obsah
    SubPage = GeneratedContentBase, // Výchozí podstránka zajišťující kalkulace a grafy
    OtherComponents = [], // Pole doplňkových komponent pro dodatečný wrapping obsahu
    children // Vnořené klientské elementy
}) => {
    
    // Vytahuje aktuální asynchronně načtenou položku (item) z globálního GraphQL kontextu entity
    const { item } = useGQLEntityContext();

    // Callback handler pro zachycení vložení transferu uvnitř této specifické struktury layoutu
    const handleTransferInserted = (transfer) => {
        
        // Loguje přijetí události transferu a jeho parametry
        console.log("PAGEITEMINNER DOSTAL TRANSFER:", transfer);

        // UPOZORNĚNÍ: Volání setLocalTransfers v původním kódu selže, pokud není stav lokálně definován v této komponentě.
        // Původní řádky ponechány v nezměněné formě pro zachování funkční kontinuity struktury:
        setLocalTransfers(previousTransfers => [
            ...previousTransfers,
            {
                financeSourceId: transfer.financeSourceId,
                financeDestinationId: transfer.financeDestinationId,
                amount: Number(transfer.amount || 0),
            }
        ]); // Konec fiktivního nastavení stavu
    }; // Konec definice handleTransferInserted

    // Memoizuje lokálně napatchovaný finanční objekt na základě kompletního prohledání a vysbírání transferů z itemu
    const patchedItem = useMemo(() => {
        
        // Pokud item chybí, vrátí ho přímo bez kalkulací
        if (!item) return item;

        // Výpisy klíčů a vlastností objektu pro potřeby hlubokého ladění datového schématu v konzoli
        console.log("GENERATEDCONTENTBASE ITEM:", item);
        console.log("GENERATEDCONTENTBASE ITEM KEYS:", Object.keys(item || {}).join("\n"));
        console.log("TRANSFER RELATED KEYS:", Object.keys(item || {}).filter(key =>
            key.toLowerCase().includes("transfer") ||
            key.toLowerCase().includes("source") ||
            key.toLowerCase().includes("destination")
        )); // Konec filtrovaných logů klíčů

        // Posbírá rekurzivně všechny transfery, které jsou přímou součástí datové struktury tohoto objektu
        const backendTransfers = collectTransfers(item);

        // Loguje interně nalezené transfery struktury
        console.log("BACKEND TRANSFERS:", backendTransfers);

        // Vrací napatchovaný finanční objekt upravený o tyto interní transfery
        return patchFinanceItem(item, backendTransfers);
        
    }, [item]); // Spustí se znovu pouze tehdy, pokud se změní samotný objekt item z kontextu

    // Podmínka: Pokud položka v kontextu neexistuje, renderuje textové upozornění
    if (!item) return <>Položka nenalezena</>;

    // Pomocí metody reduceRight obalí vnořený klientský obsah (children) do řetězce komponent specifikovaných v OtherComponents
    const content = (OtherComponents || []).reduceRight((acc, Component) => {
        if (!Component) return acc; // Pokud komponenta v poli neexistuje, vrátí dosavadní akumulátor
        return <Component item={item}>{acc}</Component>; // Obalí akumulátor do komponenty a předá jí item
    }, children); // Výchozí hodnotou redukce jsou samotné children

    // Vrací výsledný JSX strom skládající navigační lištu, obalovou kartu a dynamický obsah podstránky
    return (
        <>
            {/* Pokud je předána navigační lišta, vykreslí ji v horní části a předá jí položku */}
            {PageNavbar && <PageNavbar item={item} />}
            
            {/* Vykresluje obalový prvek karty (LargeCard) s předáním kompletně napatchované položky */}
            <ItemLayout item={patchedItem}>
                
                {/* Podmínka: Pokud je definována substránka, vykreslí ji a naváže inline callback vložení transferu */}
                {SubPage ? (
                    <SubPage
                        item={patchedItem} // Předání napatchovaných dat do subpage
                        onTransferInserted={(transfer) => {
                            // Zachytí událost ze subpage, zaloguje ji a předá internímu handleru layoutu
                            console.log("SUBPAGE INLINE CALLBACK DOSTAL TRANSFER:", transfer);
                            handleTransferInserted(transfer); // Volání vnitřního zpracování
                        }}
                    >
                        {content} {/* Vkládá vygenerovaný a obalený obsah jako children podstránky */}
                    </SubPage>
                ) : (
                    content // Pokud subpage chybí, vykreslí přímo samotný obalený obsah (content)
                )}
            </ItemLayout>
        </>
    ); // Konec návratu JSX stromu layoutu
}; // Konec definice komponenty PageItemInnerStructure

// Definuje a exportuje základní komponentu stránky (PageItemBase) obalující celou logiku do AsyncActionProvideru
export const PageItemBase = ({
    queryAsyncAction = ReadAsyncAction, // Výchozí asynchronní akce pro načtení (čtení) dat entity
    PageNavbar = () => null, // Výchozí prázdná funkce pro navigační lištu
    ItemLayout = LargeCard, // Výchozí obalová komponenta karty layoutu
    SubPage = GeneratedContentBase, // Výchozí vnitřní subpage komponenta
    children // Vnořený klientský obsah
}) => {
    
    // Vytahuje textový parametr 'id' z aktivní URL adresy prohlížeče pomocí react-routeru
    const { id } = useParams();
    
    // Sestaví iniciální minimální objekt položky obsahující pouze vytažené ID pro potřeby provideru
    const item = { id };

    // Vrací strukturu obalenou providerem, který automaticky spustí dotaz queryAsyncAction pro dané ID položky
    return (
        <AsyncActionProvider item={item} queryAsyncAction={queryAsyncAction}>
            {/* Vykresluje vnitřní strukturu layoutu a předává jí nakonfigurované renderovací komponenty */}
            <PageItemInnerStructure
                PageNavbar={PageNavbar}
                ItemLayout={ItemLayout}
                SubPage={SubPage}
            >
                {children}
            </PageItemInnerStructure>
        </AsyncActionProvider>
    ); // Konec návratové hodnoty komponenty PageItemBase
}; // Konec definice komponenty PageItemBase

// Definuje a exportuje univerzální komponentu PageContent, která dynamicky mění obsah na základě parametru akce v URL (view, edit, __def)
export const PageContent = ({ queryById, queryVector, mutations = {}, children, params }) => {
    
    // Získává kompletní GraphQL kontext entity z nejbližšího nadřazeného AsyncActionProvideru
    const gqlContext = useGQLEntityContext();
    
    // Vytahuje parametr akce z URL adresy (např. /view nebo /__def), jako výchozí nastavuje "view"
    const { action = "view" } = useParams();
    
    // Bezpečně rozbaluje aktuální datový objekt položky z GraphQL kontextu, pokud existuje
    const { item } = gqlContext || {};

    // Memoizuje a přepočítává finanční strom z datového objektu item staženého z provideru
    const patchedItem = useMemo(() => {
        
        // Posbírá transfery přítomné uvnitř struktury načteného objektu
        const backendTransfers = collectTransfers(item);

        // Loguje nalezené transfery z databáze
        console.log("BACKEND TRANSFERS:", backendTransfers);

        // Vrací upravenou a matematicky přepočítanou položku
        return patchFinanceItem(item, backendTransfers);
        
    }, [item]); // Spustí se znovu pouze tehdy, pokud provider dodá nový aktualizovaný objekt item

    // Callback handler reagující na úspěšné vložení přesunu v rámci zobrazení obsahu stránky
    const handleTransferInserted = async (transfer) => {
        
        // Loguje úspěšné uložení a nutnost reloadu/synchronizace dat
        console.log("TRANSFER HOTOVY, NACITAM DATA ZNOVU:", transfer);

        // PŮVODNÍ ZAKOMENTOVANÝ KÓD: window.location.reload()
        console.log("RELOAD DOCASNE VYPNUTY KVULI DEBUGU"); // Informace o dočasném potlačení reloadu
    }; // Konec definice funkce handleTransferInserted

    // Podmínka: Pokud objekt položky v kontextu chybí (např. nevalidní ID), vykreslí chybovou hlášku a vypíše dump kontextu
    if (!item) {
        return (
            <div>
                Položka nenalezena
                {/* Vykresluje formátovaný JSON dump celého stavu GraphQL kontextu pro účely ladění chyb */}
                <pre>{JSON.stringify(gqlContext, null, 2)}</pre>
            </div>
        ); // Konec chybového JSX
    } // Konec kontroly existence itemu

    // Inicializuje proměnnou obsahu výchozí hodnotou vnořených dětí (children)
    let content = children;
    
    // Získává dynamickou hodnotu vlastnosti z objektu na základě klíče z parametru akce v URL (např. patchedItem["view"])
    const attributeValue = patchedItem?.[action];

    // Ladící výpisy stavů, úprav a sesbíraných dat pro detailní trasování objektů na stránce
    console.log("FINANCE ITEM:", item);
    console.log("PATCHED ITEM:", patchedItem);
    // PŮVODNÍ LOG: console.log("LOCAL TRANSFERS:", localTransfers) - localTransfers není v tomto scópu definováno, log vyvolá warning/chybu
    console.log("COLLECTED TRANSFERS:", collectTransfers(item));

    // Větvení logiky zobrazení na základě hodnoty parametru 'action' vytaženého z URL adresy
    if (action === "__def") {
        
        // Vývojářský režim "__def": Zobrazuje interní GraphQL schémata dotazů, mutací a tlačítka pro jejich snadné zkopírování
        content = (
            <Row>
                {/* Sloupec zobrazující textaci primárního dotazu queryById */}
                <Col>
                    <CardCapsule header="queryById">
                        <SimpleCardCapsuleRightCorner>
                            {/* Tlačítko pro kopírování řetězce dotazu queryById do schránky */}
                            <CopyButton className="btn btn-sm border-0" text={queryById} />
                        </SimpleCardCapsuleRightCorner>
                        {/* Formátuje zobrazení GraphQL dotazu zalomením řádků za čárkami a závorkami pro lepší čitelnost */}
                        <pre>{queryById?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                    </CardCapsule>
                </Col>
                
                {/* Sloupec zobrazující textaci vektorového dotazu queryVector */}
                <Col>
                    <CardCapsule header="queryVector">
                        <SimpleCardCapsuleRightCorner>
                            {/* Tlačítko pro kopírování řetězce dotazu queryVector do schránky */}
                            <CopyButton className="btn btn-sm border-0" text={queryVector} />
                        </SimpleCardCapsuleRightCorner>
                        {/* Formátuje zobrazení GraphQL dotazu pro přehlednost v HTML tagu pre */}
                        <pre>{queryVector?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                    </CardCapsule>
                </Col>
                
                {/* Prochází objekt registrovaných mutací (mutations) a pro každou vygeneruje samostatný sloupec s kódem a kopírováním */}
                {Object.entries(mutations).map(([name, value]) => {
                    return (
                        <Col key={name}>
                            <CardCapsule header={name}>
                                <SimpleCardCapsuleRightCorner>
                                    {/* Tlačítko pro zkopírování těla konkrétní mutace podle jejího názvu */}
                                    <CopyButton className="btn btn-sm border-0" text={value} />
                                </SimpleCardCapsuleRightCorner>
                                {/* Formátuje a vypisuje kód mutace */}
                                <pre>{value?.replaceAll(", ", ", \n\t").replaceAll("(", "(\n\t")}</pre>
                            </CardCapsule>
                        </Col>
                    ); // Konec mapování sloupce mutace
                })}
            </Row>
        ); // Konec obsahu pro akční režim __def
        
    } else if (action === "view") {
        
        // Uživatelský režim "view": Standardní klientské zobrazení detailu prvků včetně Sunburst grafu a vizualizace atributů
        content = (
            <>
                {/* Vykresluje interaktivní kruhový graf finančních přesunů s upravenými daty a reload callbackem */}
                <FinanceTransferSunburst
                    item={patchedItem}
                    header="Graf finančních přesunů"
                    onTransferInserted={handleTransferInserted}
                />
                {/* Vykresluje přehled všech jednoduchých skalárních textových a číselných hodnot entity */}
                <MediumCardScalars key="MediumCardScalars" item={patchedItem} />
                
                {/* Vykresluje přehled všech asociovaných polí a kolekcí (vektorů) entity */}
                <MediumCardVectors key="MediumCardVectors" item={patchedItem} />
            </>
        ); // Konec obsahu pro režim view
        
    } else if (Array.isArray(attributeValue)) {
        
        // Pokud hodnota atributu odpovídá poli, přepne zobrazení na specifickou komponentu pro vykreslení polí (VectorAttribute)
        content = <VectorAttribute attribute_name={action} item={patchedItem} />;
        
    } else if (attributeValue) {
        
        // Pokud hodnota atributu existuje (je skalární), přepne zobrazení na komponentu pro vykreslení jednoduché hodnoty (ScalarAttribute)
        content = <ScalarAttribute attribute_name={action} item={patchedItem} />;
    } // Konec vyhodnocování action větvení

    // Hlavní návratová hodnota komponenty: Obaluje vygenerovaný content do LargeCard a pod ním zobrazuje debug panely s dotazy a JSON stavem
    return (
        <>
            {/* Obaluje dynamicky sestavené rozhraní (content) do velké systémové karty */}
            <LargeCard item={patchedItem}>
                {content}
            </LargeCard>
            
            {/* Spodní řada ladících debugovacích panelů pro administrátory systému */}
            <Row>
                {/* Panel pro surové zobrazení aktuálního textu QueryById dotazu */}
                <Col>
                    <CardCapsule header="QueryById">
                        <pre>{queryById}</pre>
                    </CardCapsule>
                </Col>
                
                {/* Panel pro zobrazení formátovaného stavu předaných klientských parametrů (params) */}
                <Col>
                    <CardCapsule header="Parametry">
                        <pre>{JSON.stringify(params, null, 2)}</pre>
                    </CardCapsule>
                </Col>
                
                {/* Panel pro kompletní textový výpis aktuální podoby celého napatchovaného JSON objektu dat z databáze */}
                <Col>
                    <CardCapsule header="Response">
                        <pre>{JSON.stringify(patchedItem, null, 2)}</pre>
                    </CardCapsule>
                </Col>
            </Row>
        </>
    ); // Konec návratu celkového JSX struktury komponenty PageContent
}; // Konec definice komponenty PageContent

// Definuje a exportuje hlavní kořenovou komponentu Page, která inicializuje GraphQL typy a dynamicky sestavuje celou stránku
export const Page = ({ children }) => {
    
    // Vytahuje parametry 'id' a 'typename' (např. název GQL modelu) přímo z aktivní URL cesty routeru
    const { id, typename } = useParams();
    
    // Vytváří iniciální objekt položky s vytaženým identifikátorem ID
    const item = { id };
    
    // Používá dynamický hook useGQLType, který na základě názvu typu v URL vyhledá příslušné thunky, dotazy a mutace z registru schémat (pokud typ chybí, použije RoleGQLModel)
    const { ByIdAsyncAction, queryById, queryVector, mutations } = useGQLType(typename || "RoleGQLModel");

    // Vrací výslednou strukturu podmíněného renderu podle úspěšnosti nalezení thunku v registru typu
    return (
        <>
            {/* Podmínka: Pokud byl asynchronní thunk pro daný typ úspěšně nalezen, obalí stránku do provideru a vykreslí obsah */}
            {ByIdAsyncAction && (
                <AsyncActionProvider item={item} queryAsyncAction={ByIdAsyncAction}>
                    <PageContent queryById={queryById} queryVector={queryVector} mutations={mutations} params={item}>
                        {children}
                    </PageContent>
                </AsyncActionProvider>
            )}
            
            {/* Podmínka: Pokud typ v registru schémat chybí a akce nebyla nalezena, vykreslí textové varování s názvem chybějícího typu */}
            {!ByIdAsyncAction && (
                <div>No ByIdAsyncAction for type {typename}</div>
            )}
        </>
    ); // Konec návratové hodnoty kořenové komponenty Page
}; // Konec definice komponenty Page