# Deníček změn

## 13.7.2026
**Co bylo změněno**
- Sjednocena dokumentace hlavních komponent pomocí JSDoc.
- Doplněny popisy komponent v adresářích `finance/Components` , `finance/Mutations` , `finance/Queries` , `finance/Pages`.
- Vytvořen konfigurační soubor `jsdoc.json`.
- Doplnění `package.json` o podporu generování dokumentace.
- Úspěšně vygenerovaná HTML dokumentace projektu do složky `packages/finance/docs`.

**Co jsme objevili**
- Byla potřeba upravit a doplnit klíčové komponenty o speciální JSDoc komentáře.
- Některé soubory speciální komentáře vůbec neobsahovali nebo byli nepřesné.

**Problém**
- Struktura a popisy neodpovídali jednomu z požadavků hodnocení ke zkoušce.
- Chyběl konfigurační soubor a samotný spouštěcí command pro chod JSDoc dokumentace.

**Řešení**
- Zformátovali jsme všechny soubory s klíčovými komponenty.
- Vytvořili jsem složku `docs` , která obsahuje odkazy na všechny důležité funkce.
- Sestavili jsme kompletní složku s dokumentací a souborem `index.html` k jejímu přístupu.

## 28.6.2026
**Co bylo změněno**
- Úprava logiky finančních přesunů pomocí souboru `Store.js`.
- Komentáře některých souborů.

**Co jsme objevili**
- Logika finančních přesunů nebyla úplně správně uchopena a potřebovala vylepšit.
- Popisy klíčových funkcí neexistovali.

**Problém**
- Data při finančních přesunech se nikam neukládali a byli "naprázdno".
- Komentáře u některých souborů nebyli přehledné a výstižné.

**Řešení**
- Tvorba souboru `Store.js` který tento problém řeší.
- Slouží jako dočasná paměť při přesunech, aplikace si po dotazu vytáhne data právě z této paměti a použije je při transakcích.
- Úprava komentářové sekce.

## 26.6.2026
**Co bylo změněno**
- Úprava formátování všech souborů v rámci `packages/finance/src/FinanceGQLModel`.
- Přidání komentářů.

**Co jsme objevili**
- Je potřeba upravit projekt dle správné šablony.

**Problém**
- Soubory nebyly upravené podle ukázkové předlohy a požadavků ke zkoušce.

**Řešení**
- Úprava správného formátování a okomentování jednotlivých souborů.


## 11.6.2026
**Co bylo změněno**
- Aktualizace verze `package.json` pro `app_finance`.
- Publikace nové verze balíčku `npms`.
- Úpravy v `Table.jsx`, `Filter.jsx` a `MediumContent.jsx` pro přehlednější úvodní tabulku financí.

**Co jsme objevili**
- Problém nebyl jen v datech, ale také v tom, jak se data zobrazují a filtrují.

**Problém**
- Rozhraní financí bylo málo čitelné a uživatelé se ztráceli ve výsledcích.

**Řešení**
- Komponenty tabulky a filtru jsme upravili tak, aby byly informace jasnější a dostupnější.


## 1.6.2026
**Co bylo změněno**
- Publikace nové verze balíčku `npms`.
- Další úpravy v `FinanceTransferSunburst.jsx`, `Page.jsx`, `Fragments`, `FinanceTransferInsertAsyncAction.jsx` a `FinanceTransferPageAsyncAction.jsx`.

**Co jsme objevili**
- Přenosy financí vyžadují synchronizaci mezi vizualizací a backend akcemi.

**Problém**
- Část přesunů se zobrazovala správně, ale editace nebyla vždy stabilní.

**Řešení**
- Sladit logiku v async akcích s komponentou Sunburst a stránkou pro editaci.


## 30.5. a 31.5.2026
**Co bylo změněno**
- Publikace nové verze balíčku `npms`.
- Úprava `FinanceTransferSunburst.jsx` a `Page.jsx`.

**Co jsme objevili**
- Je třeba vylepšit interakci při pohybu financí.

**Problém**
- Uživatelský tok při přesunu položek byl nepřehledný a pomalý.

**Řešení**
- Upravit vizualizaci a stránku tak, aby byl pohyb financí jasnější a plynulejší.


## 28.5.2026
**Co bylo změněno**
- Úprava ovládání a vzhledu stránky při přesunech financí v `FinanceTransferSunburst.jsx`.
- Dodatečné vylepšení režimu úprav.

**Co jsme objevili**
- Současný vzhled nezdůrazňoval klíčové části editace.

**Problém**
- Uživateli chyběla zpětná vazba v režimu úprav.

**Řešení**
- Zlepšit UI, přidat jasnější ovládací prvky a stavy pro editaci.


## 13.5.2026
**Co bylo změněno**
- Vytvoření `FinanceTransferSunburst.jsx` pro finanční přesuny mezi položkami.
- Úprava uživatelského rozhraní.
- Publikace nové verze balíčku `npms`.
- Dokončení modelu v režimu úprav.

**Co jsme objevili**
- Sunburst pomáhá rychle najít, kam finance přesměrovat.

**Problém**
- Složitější data bylo třeba udržet přehledná.

**Řešení**
- Vytvořit samostatnou komponentu pro nabídku přesunů a doplnit ji o lepší UI.


## 7.5.2026
**Co bylo změněno**
- Vytvoření `SunBurstDiagram.jsx` pro naše data.
- Úprava grafické stránky a přehlednější UI.

**Co jsme objevili**
- Grafická reprezentace dat zvyšuje orientaci ve financích.

**Problém**
- Základní tabulka nestačila pro komplexní finanční vztahy.

**Řešení**
- Vytvořit diagram Sunburst pro vizualizaci vrstev a vztahů.


## 28.4.2026
**Co bylo změněno**
- Aktualizace `docker.compose.hk2026.json` a `systemdata.hk2026.json`.
- Úprava souborů a dokumentů.
- Příprava GQL modelu v režimu úprav.
- Úprava `MediumEditableContent.jsx` pro sjednocení detailového okna.

**Co jsme objevili**
- Konfigurace Dockeru a systémových dat je klíčová pro běh modelu.

**Problém**
- Bez aktualizované konfigurace nefungoval GQL model správně.

**Řešení**
- Aktualizovat `docker-compose` a systémová data pro nový model.


## 13.4.2026
**Co bylo změněno**
- Úprava queries a grafického zobrazení v prohlížeči.
- Přidání štítků pro přehlednější čtení.

**Co jsme objevili**
- Chybějící popisky zhoršovaly čitelnost výsledků.

**Problém**
- Výsledky se zobrazovaly bez dostatečného kontextu.

**Řešení**
- Přidat popisky a upravit queries pro lepší prezentaci.


## 9.4.2026
**Co bylo změněno**
- Klíčová aktualizace `docker.compose.hk2026.json` a `systemdata.hk2026.json`.

**Co jsme objevili**
- Konfigurace nasazení ještě není úplně doladěná.

**Problém**
- Některé části GQL modelu se nespouštěly správně v lokálním prostředí.

**Řešení**
- Zopakovaná aktualizace konfigurace a testování nasazení.


## 7.4.2026
**Co bylo změněno**
- Implementace `docker.compose.hk2026.json` a `systemdata.hk2026.json` pro náš GQL model.

**Co jsme objevili**
- Závislosti modelu a Docker konfigurace musí být v souladu.

**Problém**
- Bez správných datových souborů nebyla možná stabilní práce s modelem.

**Řešení**
- Připravit konfiguraci a datové soubory pro GraphQL model.


## 1.4.2026
**Co bylo změněno**
- Vytvoření `app_finance` se všemi potřebnými soubory.

**Co jsme objevili**
- Je potřeba samostatná finance aplikace v monorepu.

**Problém**
- Finance komponenty chyběly a projekt nebyl hotový.

**Řešení**
- Vytvořit `app_finance` jako novou aplikaci se všemi základními soubory.


## 27.3.2026
**Co bylo změněno**
- Tvorba URI segmentu a `package.json`.

**Co jsme objevili**
- Struktura balíčku musí odpovídat monorepu.

**Problém**
- Bez správného URI segmentu a `package.json` nelze aplikaci spustit.

**Řešení**
- Vytvořit základní URI segment a nastavení balíčku.

## Časová osa commitů
| Datum | Hlavní změna | Stručný popis |
|---|---|---|
| 13.7.2026 | JSDoc dokumentace | Tvorba kompletní HTML dokumentace `docs` pro klíčové komponenty. |
| 28.6.2026 | Vytvoření store | Úprava komentářů a vylepšení samotné logiky přesunů pomocí `Store.js`. | 
| 26.6.2026 | Formátování a komentáře | Editace všech souborů v rámci našeho FinaceGQL Modelu. |
| 11.6.2026 | Přehlednější tabulka | Vylepšení `Table`, `Filter` a `MediumContent` pro čitelnější výsledky. |
| 1.6.2026 | Synchronizace logiky | Sladění vizualizace a backend logiky pro stabilní editace. |
| 30.5. – 31.5.2026 | Doladění přesunů | Zrychlení uživatelské interakce a upřesnění toku přenosů. |
| 28.5.2026 | Lepší ovládání přesunů | Vylepšení UI a zpětné vazby v `FinanceTransferSunburst.jsx`. |
| 13.5.2026 | FinanceTransfer Sunburst | Přidání komponenty pro finanční přesuny a dokončení režimu úprav. |
| 7.5.2026 | SunBurst diagram | Přidání `SunBurstDiagram.jsx` pro lepší grafickou orientaci. |
| 28.4.2026 | Režim úprav | Příprava GQL modelu, aktualizace systémových dat a sjednocení detailového okna. |
| 13.4.2026 | Lepší vizualizace | Úpravy queries a přidání štítků pro přehlednější čtení. |
| 9.4.2026 | Ladění konfigurace | Testování lokálního nasazení a stabilizace GQL modelu. |
| 7.4.2026 | Nasazení GQL modelu | Implementace `docker.compose.hk2026.json` a `systemdata.hk2026.json`. |
| 1.4.2026 | Vytvoření `app_finance` | Přidání samostatné finance aplikace se základními soubory. |
| 27.3.2026 | URI segment a `package.json` | Založení základní struktury aplikace v monorepu. |

# Jak spustit konkrétní app

```cmd
npm run dev -w @vojta19/app_finance
```

# Jak sestavit konkrétní app

```cmd
npm run build -w @vojta19/app_finance
```
