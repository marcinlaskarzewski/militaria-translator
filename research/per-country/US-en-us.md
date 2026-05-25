# US (en-us) - kontekst translatora

**Probka:** 6 sklepow (us-elite, lapolicegear, tacticalgear, botach, rangerjoes, galls). Brownells/Midwayusa zablokowane (403/Cloudflare) - akceptowalne 6/8.
**Data:** 2026-05-24

## 1-zdanie esencji rynku
US militaria = profesjonalny premium ton, "duty gear" zamiast "guns", silne sygnaly law enforcement/first responder/veteran-owned, terminologia angielska keep-as-is.

## Sklepy w probie
| # | Domena | Pozycjonowanie |
|---|---|---|
| 1 | us-elite.com | Veteran-Vetted premium tactical |
| 2 | lapolicegear.com | LE/military superstore, value |
| 3 | tacticalgear.com | mass-market tactical professional |
| 4 | botach.com | LE/military, body armor/optics |
| 5 | rangerjoes.com | military since 1963, soldier-first |
| 6 | galls.com | uniformy LE/EMS/fire (public safety) |

## Cytaty per kryterium

**1. Naglowki:** "U.S. Elite Gear - Veteran-Vetted Premium Tactical Gear" (us-elite); "Tactical Gear Superstore" (tacticalgear); "Tactical Gear, Armor & Optics for Police & Military" (botach); "Since 1963, providing military products to today's soldiers" (rangerjoes).

**2. CTA:** "Add to Cart" (us-elite 13x, rangerjoes 5x, botach 13x), "View Product" (lapolicegear 18x, us-elite 10x), "Quick view" (botach 26x, rangerjoes 10x), "Shop Now" (tacticalgear). Brak "Buy Now" jako default. Dlugosc: 8-12 znakow.

**3. Formalnosc:** swobodna profesjonalna, "you/your", brak Sir/Madam - "your online tactical store for all your Tactical Gear needs" (lapolicegear meta), "Shop our huge selection of clothing, footwear & gear for the tactical professional" (tacticalgear).

**4. Terminologia EN keep-as-is:** MOLLE, EDC (69x botach, 69x rangerjoes), AR-15, plate carrier (16x tacticalgear), holster, optics, red dot, night vision (33x lapolicegear), NVG, IFAK, chest rig, battle belt, kydex, duty gear, Glock, HK, FN, 5.11. 2A wspominane subtelnie (kategoria), nie agresywnie.

**5. Opisy:** krotkie, korzysci > specy. "U.S. Elite Gear has the best tactical gear from Arc'teryx LEAF, Salomon Forces and many more" (us-elite meta, 18 slow); "Find premium tactical gear from brands like 5.11, Under Armour, and NIKE" (tacticalgear, 12 slow).

**6. SEO meta pattern:** "[Brand/Product Category] | [Audience: Police & Military/Tactical Professional]" - "Tactical Gear, Armor & Optics for Police & Military | Botach"; "Tactical Gear Superstore | TacticalGear.com".

**7. UI:** "Cart" 100% (414x lapolicegear, 102x botach, 35x rangerjoes), ZERO "Basket". "Checkout" (73x botach, 68x rangerjoes). "Account", "Wishlist", "Sign In".

**8. Marketing:** premium > agresywny. "FREE Shipping" (tacticalgear, ALL-CAPS sporadycznie), "Free shipping on orders over $150" (tacticalgear). "Sale" jako tag (29x us-elite, 26x tacticalgear), brak "Save 30% NOW!". "Law enforcement" (9x botach), "First Responder" (lapolicegear, botach).

**9. Dlugosc:** zdania krotkie 8-15 slow, paragrafy 2-3 zdania. Ekspansja vs PL: +5/+10% (angielski technical zwiezly, ale dluzsze CTA "Add to Cart" vs "Do koszyka").

**10. Specyfika US:** (a) "Veteran-Owned" jako wyroznik (us-elite explicit), (b) "Made in the USA" jako sygnal jakosci (botach, lapolicegear, rangerjoes), (c) LE/First Responder discount jako standard - kategoria w menu.

**11. vs Polska:** (a) US podkresla audience (police/military/first responder) - PL czesciej "dla milosnikow militariow"; (b) US "duty gear" / "tactical professional" zamiast "broń"; (c) brak emoji, brak "!!!", brak "MEGA OKAZJA".

## DO WDROZENIA w MARKET_PROFILES.en-us

### Tone of voice
profesjonalny, bezposredni, premium-bez-hype, soldier-first.

### Konwencje (constants):
- Waluta: `$X.XX` PRZED liczba (np. `$199.95`)
- Data: `MM/DD/YYYY`
- Jednostki: imperialne (in, lb, oz, ft) + metryczne w nawiasie dla optyki/balistyki
- Pisownia: color (NIE colour), caliber (NIE calibre), defense (NIE defence), armor (NIE armour), gray (NIE grey), license (NIE licence)
- Koszyk: "Cart" (NIE "Basket")
- Spodnie: "pants" (NIE "trousers")
- Latarka: "flashlight" (NIE "torch")
- Buty: "boots/footwear" (NIE "shoes" dla taktycznych)

### Top CTA native:
1. "Add to Cart" (11)
2. "View Product" (12)
3. "Quick view" (10)
4. "Shop Now" (8)
5. "Checkout" (8)
6. "Sign In" (7)

### Akronimy keepAsIs:
MOLLE, EDC, IFAK, AR-15, NVG, LE (law enforcement), 2A, IR, FDE, OD (olive drab), MultiCam, FR (flame resistant), NIJ (poziomy plyt), LEO, EMS, SOF.

### Top 3 pulapki PL->EN-US:
1. NIE "Basket" - to UK-ism, US wszedzie "Cart"
2. NIE "trousers" - US "pants"; "torch" - US "flashlight"
3. NIE brytyjska pisownia (colour/armour/defence/calibre/grey/licence) - US: color/armor/defense/caliber/gray/license

### Specyfika kulturowa US (do prompt):
- "Veteran-Owned" i "Made in USA" = silne wyrozniki, eksponuj jesli sklep ma
- "Law Enforcement / First Responder discount" = standard, tlumacz jako kategoria nie promocja
- 2A subtelnie: kategoria "duty gear / hunting / sport shooting" zamiast jezyka politycznego
- Patriotyzm tak, ale stonowany ("Built in America", nie "USA #1!!!")
- Audience labels: "tactical professional", "warfighter", "first responder", "LE professional"

### Czego NIE robic:
- NIE agresywne "Crush the competition!" - US militaria = profesjonalny premium, nie alpha-bro
- NIE wykrzykniki w naglowkach produktow (poza "FREE Shipping" w bannerze)
- NIE tanio budowac urgency ("Hurry!! Only 2 left!!!") - LE customer to nie impuls
- NIE tlumaczyc "Glock/HK/FN/5.11/Crye/Arc'teryx LEAF" - brand names always EN

### Sample prompt do wklejenia (gotowy do prompts.js):
```
RYNEK: USA (en-US). Audience: tactical professional, LE, military, first responder. Ton: profesjonalny premium, bezposredni "you", bez hype.
KONWENCJE: $X.XX przed liczba, MM/DD/YYYY, imperialne (in/lb/oz) z metryka w nawiasie dla balistyki/optyki. Pisownia US: color, armor, defense, caliber, gray, license. Cart NIE Basket, pants NIE trousers, flashlight NIE torch.
TERMINOLOGIA: zachowaj akronimy taktyczne (MOLLE, EDC, IFAK, AR-15, NVG, LE, 2A, NIJ, FR, MultiCam) i nazwy brandow (Glock, HK, FN, 5.11, Crye, Arc'teryx LEAF).
WYROZNIKI: Veteran-Owned, Made in USA, LE/First Responder discount - eksponuj jesli sklep posiada.
2A I BRON: jezyk profesjonalny "duty gear / hunting / sport shooting", NIE polityczny. Subtelnie. Sklepy militaria sa zwykle stonowane.
TON: "tactical-grade", "duty-rated", "mission-ready" zamiast hype. Krotkie zdania (8-15 slow). CTA 8-12 znakow ("Add to Cart", "Shop Now").
NIE: brytyjskie wyrazenia (Basket/trousers/colour), wykrzykniki spamem, tanio budowana urgency, agresywny alpha-bro ton.
```
