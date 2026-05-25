# UK (en-uk) - kontekst translatora

**Probka:** 5/5 sklepow - homepage + listing widoczne. Brak product page deep-dive (homepage only).
**Data:** 2026-05-24

## 1-zdanie esencji rynku

UK militaria = brytyjska terminologia (trousers/colour/MTP/PCS) + funkcjonalny ton "battle tested" + slownictwo MOD/SAS, ceny ex. VAT zaufanie przez "trading since YYYY".

## Sklepy w probie
| # | Domena | Pozycjonowanie |
|---|--------|----------------|
| 1 | uktactical.com | Special forces / "battle tested" operators |
| 2 | militarykit.com | Manchester surplus 2000, genuine British Army |
| 3 | military1st.co.uk | (HTML niepelny - skip cytatow) |
| 4 | tacticalkit.uk | Armed Forces & Police supplier (B2B feel) |
| 5 | bushcraftstore.co.uk | Bushcraft + Survival + Knives |
| 6 | militarymart.co.uk | Army Surplus + scout/guide camping |

## Cytaty per kryterium

**1. Naglowki:** "UK Tactical Kit Suppliers of Military Gear and Clothing" (uk-tactical.html), "Army Surplus Store UK - Clothing, Boots & Equipment" (uk-militarykit.html). Wzorzec: [Kategoria] + [UK marker] + [Produkty].

**2. CTA:** "Shop Now" (10x uk-tactical, 8x uk-militarymart) - 8 znakow. "Add to Basket" (uk-tacticalkit, uk-bushcraftstore) i "Add to Cart" (Shopify default - uk-militarymart, uk-militarykit). "Quick view" (10x militarymart). "Buy Now", "View Product".

**3. Formalnosc:** Profesjonalna ale dostepna. "Our kit is battle tested" (uk-tactical) - lacznie "we/our" + slang "kit".

**4. Terminologia EN bez tlumaczenia:** MTP (295x militarykit), DPM (41x), PCS (154x), UBACS, PLCE, MOD, SAS, Para, NATO, NSN, Recce. To brytyjski military jargon - NIE tlumaczyc na inne EN.

**5. Opisy produktow:** Krotkie, funkcjonalne. Meta: "high quality tactical & military equipment for the Armed Forces and Police" (tacticalkit) - 11 slow, bez ozdobnikow.

**6. SEO meta:** Zawsze "UK" + "British" + zaufanie ("trading since 2000", "180 day returns", "same day dispatch") - militarykit.

**7. UI koszyk:** "Cart" 3/5 (Shopify default - militarymart 150x, militarykit 142x, bushcraftstore 39x). "Basket" 2/5 (tacticalkit, bushcraftstore mix). **Decyzja:** uzywaj "Basket" jako preferowane brytyjskie + akceptuj "Cart" jako tech default.

**8. Marketing:** "Free UK Delivery" (4x militarykit), "FREE DELIVERY" (bushcraftstore). Trust signals: "180 day returns", "same day dispatch for orders before 2pm" (militarykit).

**9. Dlugosc:** Meta description 11-35 slow. Tytuly 5-10 slow. Krocej niz US.

**10. Specyfika UK:** "Manchester-based" (lokalnosc), "British Army surplus", "UK Mainland delivery" (wyklucza wyspy). Ceny "ex. VAT" (20x tacticalkit - B2B), inne sklepy "inc. VAT".

**11. vs Polska:** PL = emocjonalne ("najlepsza jakosc"), UK = funkcjonalne ("battle tested"). PL "spodnie taktyczne" -> UK "tactical trousers" (NIE "tactical pants"). PL latarka -> torch.

## DO WDROZENIA w MARKET_PROFILES.en-uk

### Tone of voice
Funkcjonalny, profesjonalny, zwiezly, bez ozdobnikow.

### Konwencje:
- Waluta: £X.XX (np. £59.99)
- Data: DD/MM/YYYY
- Jednostki: metryczne (cm, kg) - potwierdzone w UK militaria branzy
- Pisownia: colour, calibre, defence, organisation, tyre, centre
- Koszyk: "Basket" preferowane (brytyjskie), "Cart" akceptowalne (Shopify)
- Spodnie: "trousers" (NIE "pants" - to brytyjska bielizna!)
- Latarka: "torch" (NIE "flashlight")
- Sweter: "jumper" (NIE "sweater")
- VAT: B2B "ex. VAT", B2C "inc. VAT" lub bez wzmianki

### Top 5 CTA native:
1. "Shop Now" (8)
2. "Add to Basket" (13) / "Add to Cart" (12 - Shopify)
3. "Quick view" (10)
4. "Buy Now" (7)
5. "View Product" (12)

### Akronimy do keepAsIs:
MTP, DPM, PCS, CS95, UBACS, PLCE, PRR, MOD, SAS, SBS, NATO, NSN, Para, Recce, RAF, RM, MoD, BFPO.

### Top 3 pulapki PL->EN-UK:
1. "spodnie" -> "trousers" (NIGDY "pants" = bielizna w UK)
2. "latarka" -> "torch" (NIE "flashlight" = US)
3. "kolor/obrona/kaliber" -> "colour/defence/calibre" (UK spelling)

### Specyfika kulturowa UK:
- Trust signals = wiek firmy ("trading since YYYY")
- Lokalnosc = miasto bazy ("Manchester-based")
- Zwroty: "180 day returns", "same day dispatch", "UK Mainland delivery"
- Ton bez przesady: "battle tested" zamiast "the best ever"

### Sample prompt do wklejenia w prompts.js:
```
RYNEK: Wielka Brytania (en-GB). 
TON: Funkcjonalny, profesjonalny, zwiezly. Bez superlatywow ("the best", "ultimate"). Wzorzec "battle tested", "trusted by", "Armed Forces grade".
KONWENCJE: £X.XX, DD/MM/YYYY, metryczne (cm, kg). UK spelling: colour, calibre, defence, organisation, centre, tyre. 
SLOWNICTWO: "Basket" preferowane (lub "Cart" - Shopify OK). "Trousers" NIE "pants". "Torch" NIE "flashlight". "Jumper" NIE "sweater". "Boot" NIE "trunk".
TERMINOLOGIA WOJSKOWA (keepAsIs): MTP, DPM, PCS, CS95, UBACS, PLCE, MOD, SAS, SBS, NATO, NSN, Para, Recce, RAF, RM, BFPO.
TRUST SIGNALS: dodawaj gdy w oryginale ("trading since YYYY", "same day dispatch", "free UK delivery", "X day returns").
RYZYKO PRAWNE: Offensive Weapons Act 2019 + Bladed Articles - opisy nozy/replik/wiatrowek tonem neutralnym, NIE "deadly", "lethal", "combat ready" przy ostrzach. Restricted shipping disclaimers gdy w oryginale.
NIE: amerykanizmy (pants/flashlight/sweater/cart only/color/defense), superlatywy, ozdobniki, ALL CAPS poza nagloowkami CTA.
DLUGOSC: tytul 5-10 slow, meta 15-35 slow, opis produktu max 80% dlugosci oryginalu PL.
```
