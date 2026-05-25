# CZ (cs) - kontekst translatora

**Probka:** 4 sklepy CZ + 1 portal (armed, military-shop, armyshop, armybazar; tarra.cz SKIP - pyrotechnika nie militaria). Wszystkie zwrocily `lang="cs"` (brak global English).
**Data:** 2026-05-25

## 1-zdanie esencji rynku
CZ militaria = rzeczowy outdoor/army-surplus ton z silnymi sygnalami "skladem" + "AČR/Policie", liberalne prawo o broni (CZ-75/Glock w katalogu home), waska diakrytyka czeska obowiazkowa, vykaní jako default.

## Sklepy w probie
| # | Domena | Pozycjonowanie |
|---|---|---|
| 1 | armed.cz | "největší army shop v ČR", 4 pobocki (Praha/Brno/Tábor/Vyškov) |
| 2 | military-shop.cz | lokalny Plzeň, od roku 1992 |
| 3 | armyshop.cz | "největší český e-shop army a military" |
| 4 | armybazar.eu | portal inzeratow C2C/B2C (military surplus) |

## Cytaty per kryterium

**1. Naglowki/title:** "Army zboží online ↑ největší army shop v ČR ↑ | ARMED.cz" (armed); "Army shop – Vojenské oblečení boty batohy a vybavení pro outdoor a military" (armyshop); "Military Shop Plzeň" (military-shop). H2: "Doporučené kategorie", "Novinky", "Nejprodávanější", "Magazín", "Výrobci" (armed); "Oblékněte se pohodlně v military fashion stylu" (armyshop).

**2. CTA:** "Detail" dominuje (23x armed, 28x military-shop), "Koupit" (6x armed, 2x military-shop), "Do košíku" (2x armed, 3x armyshop, 1x military-shop), "Skladem" jako badge (11x armed, 63x armyshop), "Více info" (1x armed). BRAK "Objednat" w armed/armyshop (tylko 2x military-shop). Dlugosc: 6-10 znakow.

**3. Formalnosc:** vykaní obecne ale uzywane oszczednie - "Registrujte se a získáte výhody" (armyshop), "Vám" (10x armed, 6x armyshop), "Vaše" (1-2x). Wiekszosc copy w trzeciej osobie/imperatywie ("Oblékněte se pohodlně"), nie w bezposrednim "Vy".

**4. Terminologia EN keep-as-is:** MultiCam (26x armyshop), Glock (17x armed), EDC (6x armed), IFAK (4x armed), MOLLE (2x military-shop), 5.11 (52x armed), Mil-Tec (41x armed), Helikon (20x armed), Magnum (32x armed), LOWA. Brand names + akronimy taktyczne BEZ tlumaczenia.

**5. Opisy:** krotkie rzeczowe. Meta armed: "Army shop ARMED ⭐ Široký sortiment army zboží za skvělé ceny! Poštovné zdarma nad 2000 kč ✅ 96% zboží skladem ✅ Online nebo na pobočce - Praha, Brno, Tábor, Vyškov." (33 slowa). Armyshop meta: "Armyshop.cz je největší český e-shop s kompletní nabídkou army a military oblečení, obuvi a vybavení v té nejvyšší kvalitě." (19 slow). Recenzje klientow w pierwszej osobie: "Mám teprve krátce. Akorát chybí inzerovaná ozdobná páska..." (armyshop).

**6. SEO meta pattern:** "[Kategoria/Brand] | [Brand sklepu]" z emoji ⭐✅↑ jako separator wizualny (armed). Format: "Army zboží online ↑ největší army shop v ČR ↑ | ARMED.cz".

**7. UI:** "Košík" 100% (NIE "Basket"/"Cart"), "Skladem" jako kluczowy badge (63x armyshop = ABSOLUTNY priorytet vs "Add to Cart" w US), "Detail" zamiast "View Product", "Doprava zdarma" jako trust line.

**8. Marketing:** "Novinka" (26x armed, 36x armyshop), "Sleva" (16x armed), "Hit" (7x armed, 13x armyshop), "Akce". Brak "MEGA OKAZJA!!!". Stonowane: "Poštovné zdarma nad 2000 kč" (armed meta), "od roku 1992" (military-shop).

**9. Dlugosc:** zdania krotkie 8-14 slow. Ekspansja vs PL: ~0 do -5% (czeski leksykalnie bliski polskiemu, czesto krocej: "Do košíku" 9 znakow = "Do koszyka" 10). CTA krocej niz EN.

**10. Specyfika CZ:**
(a) **Pobocki/kamienne sklepy eksponowane** w meta - "Online nebo na pobočce - Praha, Brno, Tábor, Vyškov" (armed) - silny trust signal CZ;
(b) **AČR** (Armáda České republiky) i **Policie** jako sygnaly autentycznosci (1x AČR + 2x Policie armed);
(c) **Myslivost/lov** (lowiectwo) jako wlasny segment (6x myslivost + 11x lov armed);
(d) **Cena format "7 110 Kč"** - liczba ze spacja tysiecznika, "Kč" PO liczbie z odstepem (armyshop);
(e) Liberalne prawo bronowe - "Glock" otwarcie w katalogu home (17x armed), brak ostrzezen prawnych typu DE.

**11. vs Polska:** (a) CZ uzywa "army shop / military" jako neutralnych anglicyzmow bez polonizacji - PL czesciej "sklep militarny / militaria"; (b) "Skladem" jako badge priorytetowy (armyshop 63x) - PL czesciej "Dostepny" bez tej dominacji; (c) CZ "Vám" pisane wielka litera w copy = ekwiwalent PL "Tobie/Panu" z duzej; (d) CZ format ceny "7 110 Kč" (spacja jako separator tysiecy) - PL "7 110 zl" lub "7.110 zl".

## DO WDROZENIA w MARKET_PROFILES.cs

### Tone of voice
rzeczowy outdoor/army-surplus, profesjonalny ale przystepny, vykaní z respektu nie z dystansu.

### Konwencje (constants):
- Waluta: `7 110 Kč` (spacja jako separator tysiecy, "Kč" PO liczbie z odstepem)
- Data: `DD.MM.YYYY`
- Jednostki: metryczne (cm, kg, l)
- Diakrytyka czeska OBOWIAZKOWA: č, ř, ž, š, ť, ň, ě, ů, á, í, é, ý, ú
- Koszyk: "Košík" / "Do košíku"
- Akronimy: zachowaj EN (MOLLE, EDC, IFAK, MultiCam)

### Top CTA native:
1. "Detail" (zamiast "View product")
2. "Do košíku"
3. "Koupit"
4. "Skladem" (badge dostepnosci - PRIORYTET, eksponuj zawsze)
5. "Doprava zdarma"
6. "Více info"

### Akronimy keepAsIs:
MOLLE, EDC, IFAK, MultiCam, Cordura, Kevlar, NATO, AČR (czeski!), Picatinny, NVG, FDE, OD, Glock, HK, FN, CZ-75, 5.11, Helikon, Mil-Tec, Crye, UF Pro.

### Top 3 pulapki PL->CS:
1. NIE "Koszyk" - po czesku "Košík" (z dlugim Í)
2. NIE "zl" - czeska korona "Kč" PO liczbie z odstepem ("199 Kč" NIE "199Kč")
3. NIE pomijaj diakrytyki czeskiej (č/ř/ž/ě) - sklepy bez diakrytyki = sygnal taniej lokalizacji, klient tego nie kupi

### Specyfika kulturowa CZ (do prompt):
- **AČR + Policie** = silne sygnaly autentycznosci jesli sklep ma kontrakty wojskowe/policyjne, eksponuj
- **Pobocki/kamienne sklepy** = trust signal w CZ, wymien miasta jesli sa ("Praha, Brno, Tábor")
- **Myslivost/lov** (lowiectwo) to wlasny segment - "lovecké oblečení", "myslivecká obuv"
- **Liberalne prawo bronowe** - Glock/CZ-75 w katalogu OK, NIE dodawaj polskich ostrzezen prawnych
- **Vykaní** w tresci formalnej (regulamin/checkout/maile), "Vám/Vaše" z DUZEJ litery jako wyraz szacunku
- Czeski leksykalnie bliski polskiemu - NIE kalkuj 1:1 (falszywi przyjaciele: "zápach" = zapach NEGATYWNY w CS, "stůl" = stol)

### Czego NIE robic:
- NIE wykrzykniki spamem ("MEGA AKCE!!!") - CZ militaria = rzeczowe, podobnie do DE
- NIE tlumacz brand names (Helikon-Tex, Mil-Tec, 5.11, Glock, CZ-75) - zostaja EN
- NIE pisz "ČSR/Československo" - to historyczne, dzisiejsza armia = AČR (Armáda České republiky)
- NIE myl "vojenský" (wojskowy) z "vojenský zákon" - kontekst militaria nie ustawodawstwo
- NIE dodawaj ostrzezen prawnych "wymaga zezwolenia" jak w DE/FR - w CZ otwarcie

### Sample prompt do wklejenia (gotowy do prompts.js):
```
RYNEK: Czechy (cs-CZ). Audience: outdoor/army-surplus, mysliwi, kolekcjonerzy, AČR/Policie. Ton: rzeczowy profesjonalny, vykaní (forma "Vy" z duzej w copy formalnym).
KONWENCJE: jednostki metryczne (cm, kg), data DD.MM.YYYY, koruna "7 110 Kč" PO liczbie ze spacja tysiecznika. Diakrytyka czeska OBOWIAZKOWA (č, ř, ž, š, ť, ň, ě, ů). Koszyk = "Košík" / "Do košíku", dostepnosc = "Skladem" (priorytetowy badge eksponowany na karcie produktu).
TERMINOLOGIA: zachowaj akronimy taktyczne (MOLLE, EDC, IFAK, MultiCam, NVG, NATO, AČR) i nazwy brandow (Helikon, Mil-Tec, 5.11, Glock, CZ-75, Crye). Polskie kalki blokowane - uzywaj "voják", "vojenský", "myslivost", "lov".
WYROZNIKI CZ: pobocki/kamienne sklepy (eksponuj miasta), kontrakty AČR/Policie, segment "myslivost/lov" jako wlasny.
RYZYKO PRAWNE: Czechy maja liberalne prawo o broni (zezwolenia dostepne dla obywateli) - NIE dodawaj polskich ostrzezen prawnych typu DE/FR. Glock/CZ-75 w katalogu home otwarcie.
CTA native: "Detail", "Do košíku", "Koupit", "Skladem", "Doprava zdarma" (6-10 znakow).
NIE: kalka 1:1 z PL (falszywi przyjaciele: zápach, stůl), pisownia bez diakrytyki, "zl" zamiast "Kč", wykrzykniki spamem, tlumaczenie brand names.
```
