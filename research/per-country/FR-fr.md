# FR (fr-FR) - kontekst translatora

**Probka:** 4 sklepy (welkit, surplus-militaire, armurerie-auxerre, armurerie-lavaux). tactical-airsoft.fr zwrocil HTTP 402 (paywall/anti-bot), equipement-de-securite.fr SSL handshake failed (exit 35). Akceptowalne 4/5 (probowano 2 alternatywy: commando-ranger/surplus-arme = DNS fail).
**Data:** 2026-05-25

## 1-zdanie esencji rynku
FR militaria = elegancki "vous", trojpodzial sklepow (surplus-militaire / equipement-tactique / armurerie regulowana z kategoriami A-D), typografia FR sztywna (spacja przed `: ; ! ?`), trust signals "Depuis YYYY" + "Livraison offerte".

## Sklepy w probie
| # | Domena | Pozycjonowanie |
|---|---|---|
| 1 | welkit.com | Equipement militaire/tactique/outdoor premium, "qualite pro" pour militaires/FDO/passionnes, ISO 9001 |
| 2 | surplus-militaire.com | Blog + boutique Stock US, surplus & camouflage & airsoft (broad consumer) |
| 3 | armurerie-auxerre.com | Armurerie en ligne, tir sportif/loisir/chasse/defense, cat. B + C |
| 4 | armurerie-lavaux.com | "Premiere Armurerie en ligne", carabines/pistolets air comprime + 22LR + cat. B + defense |

## Cytaty per kryterium

**1. Naglowki:** "ARMURERIE AUXERRE, VOTRE SPECIALISTE DES ARMES EN LIGNE" (armurerie-auxerre h1); "Welkit | Equipement Militaire, Tactique & Outdoor" (welkit title); "Surplus Militaire : Camouflage, vetements, chaussures, accessoires et equipement" (surplus h4); "A la Une cette semaine" / "Top Marques" / "Vos camarades s'equipent" (welkit h2 sections).

**2. CTA:** Dominuja `Voir` (188 lavaux, 63 armurerie, 58 welkit) jako short universal CTA. `Ajouter au panier` (30 armurerie). `En savoir plus` (5 armurerie, 1 welkit, 1 lavaux). `Decouvrir` (5 lavaux). Welkit: `Acheter` (1) jako rzadkosc. Dlugosc: 4-15 znakow, preferencja krotkich.

**3. Formalnosc:** Konsekwentne `vous` - "Vous avez" (5 welkit), "Vous pouvez" (3 welkit), "VOTRE SPECIALISTE" (armurerie h1), "Vos camarades s'equipent" (welkit). Zero `tu/toi` w tresci produktowej.

**4. Terminologia / akronimy keep-as-is:** MOLLE (242 welkit + 30 molle), EDC (58 welkit + 8 + 15 edC), Glock (44 welkit, 35 lavaux, 2 armurerie), HK (32 welkit, 10 armurerie), Beretta (4+18 obu armurerie), Picatinny (1), IFAK (2), Airsoft/airsoft. Specyfika FR: `cal.` (1278 lavaux), `cat. B/C/D` (armurerie 6+2, lavaux 22+10+5), `FDO` (5 welkit = Forces de Defense et Ordre), `GIGN/RAID` (zero w probce ale standard branzy).

**5. Trust signals:** "Depuis 1989" (3 welkit), "Depuis 2003" (1 surplus), "depuis 1979" (1 lavaux), "Livraison offerte" (1 welkit, 2 armurerie), "Retour gratuit" (4 welkit), "Paiement securise" (1 lavaux), "ISO 9001" (welkit meta). Welkit najsilniejszy: ISO + 1989 + retour + livraison.

**6. SEO meta pattern:** "[Brand] : [Categorie + audience] [trust signals z checkmarks]" - welkit meta: "Vetements, chaussures, holsters, bagagerie de qualite pro pour militaires, FDO et passionnes / Livraison express / Retour gratuit / Depuis 1989 / ISO 9001". Lavaux: "...pistolets et carabines a plomb air comprime, carabines 22lr, armes categorie B et d'armes de defense : bombe lacrymogene, gomme cogne, matraque...".

**7. Typografia FR (KRYTYCZNE):** Spacja przed `!` i `?` potwierdzona: "auto !", "ski !", "softshell ?", "Merci !", "economisez !", "nous ?", "froid !", "highlander ?". Spacja przed `:` w naglowkach: "Bivouac :", "Militaire :", "STOCKUS :", "defense :" (5x kazde w surplus). Twarda regula edytorska.

**8. Marketing ton:** Profesjonalny stonowany, NIE hype. Brak ALL-CAPS poza nazwami marek. Brak `!!!`, brak emoji w naglowkach. Welkit "qualite pro" zamiast "best". Surplus jeden checkmark `!` na koncu meta description ale w tresci wstrzemiezliwie. Armurerie/lavaux: jezyk neutralno-techniczny (carabine, munition, calibre).

**9. Anglicyzmy:** UI bilingwalny w klasach JS (`cart`, `addToCart` widoczne 26-42x technicznie w plikach) ALE w widzialnym contencie konsekwentne `panier` (16 armurerie, 12 lavaux, 9 welkit). `Airsoft` keep-as-is (kategoria sportu). `Holster` keep-as-is (66 welkit). `Outdoor` keep-as-is (welkit tagline). `Email` powszechne, `courriel` nie wystepuje w probce.

**10. Specyfika FR:** (a) Wsparcie 4 kategorii prawnych broni (A-D) widoczne w UI armurerii - kategoria B + C najczestsze, (b) Stockus/surplus US jako wyrazne pozycjonowanie ("Stock US" = brand + signal pochodzenia), (c) ekspansja tekstu PL->FR ~+15-25% (dluzsze zwroty grzecznosciowe `vous`, peryfrazy zamiast krotkich PL form), (d) sklepy z armurerii podaja kategorie prawna PRZED nazwa produktu czasem.

**11. vs Polska:** (a) FR sztywno trzyma typografie ze spacjami przed `: ; ! ?` - PL nie ma tego wcale; (b) FR rzadziej krzyczy promocja - PL czesciej "MEGA OKAZJA"; (c) FR system kategorii A-D broni = obowiazek opisywac status prawny, PL ma swoj system pozwolen ale nie eksponuje go w UI; (d) `vous` zawsze, vs PL `Ty/Pan` mieszane.

## DO WDROZENIA w MARKET_PROFILES.fr

### Tone of voice
formalny `vous`, elegancki, stonowany, profesjonalny `qualite pro`, "specialiste" zamiast "best", trust przez staz (Depuis YYYY) + certyfikacja (ISO).

### Konwencje (constants):
- Waluta: `19,99 €` (przecinek dziesietny + spacja + EUR/€ PO liczbie)
- Data: `DD/MM/YYYY`
- Jednostki: metryczne (cm, kg, g, mm)
- Kaliber: `cal. 4,5 mm`, `22 LR`, `9x19`
- Koszyk: `panier` (NIE `cart`/`basket`)
- Typografia: spacja non-breaking przed `: ; ! ?` (np. "Livraison gratuite !" NIE "Livraison gratuite!")
- Adres: "Madame, Monsieur" w formalnych naglowkach

### Top CTA native:
1. `Voir` (4 sklepy, dominujace)
2. `Ajouter au panier` (armurerie)
3. `En savoir plus`
4. `Decouvrir` / `Decouvrez`
5. `Acheter` (rzadkie)
6. `Commander` (rzadkie)

### Akronimy keepAsIs:
MOLLE, EDC, IFAK, Picatinny, NATO, FDO, GIGN, RAID, Airsoft, Glock, HK, Beretta, Sig Sauer, FN, Famas, MultiCam, OD (olive drab), cal., 22 LR, 9x19, cat. A/B/C/D (kategorie prawne).

### Top 3 pulapki PL->FR:
1. NIE pomijaj spacji przed `: ; ! ?` - to dla Francuza widoczny blad korekty.
2. NIE tlumacz `panier` jako `cart` ani odwrotnie. NIE `cart` w UI.
3. NIE pomijaj kategorii prawnej (A/B/C/D) w opisach broni - to obowiazek prawny i klient tego oczekuje.

### Specyfika kulturowa FR (do prompt):
- Audience: militaires + FDO (Forces de Defense et Ordre - policja/gendarmerie/wojsko) + passionnes/tireurs sportifs/chasseurs.
- "Depuis [rok]" = silny trust signal, eksponuj jesli sklep ma >10 lat.
- ISO 9001 / norme EN = dodatkowe credibility w opisach.
- Stockus / Stock US / surplus americain = pozycjonowanie pochodzenia, NIE tlumaczyc.
- 2 typy sklepu: SURPLUS/EQUIPEMENT (welkit, surplus, militaria.pl analog) vs ARMURERIE regulowana (bron A-D, kupujacy musi miec uprawnienia).

### Czego NIE robic:
- NIE pisz `Hate ?!!!` ani `MEGA PROMO !!!` - FR militaria = sobre, profesjonalne.
- NIE tlumacz nazw brandow (Glock/HK/Beretta/MOLLE) - keep as-is.
- NIE tlumacz `Airsoft` jako "bron pneumatyczna sportowa" - to wlasna kategoria.
- NIE pomijaj statusu prawnego broni - Francja ma cat. A-D, opis MUSI sie do niej odnosic dla cat. B+.
- NIE uzywaj `tu/toi` w opisach produktow i CTA - tylko `vous`.
- NIE pisz "shopping" / "checkout" / "cart" w widocznym UI - panier/commande/paiement.

### Sample prompt do wklejenia (gotowy do prompts.js):
```
RYNEK: Francja (fr-FR). Audience: militaires, FDO (police/gendarmerie/armee), tireurs sportifs, chasseurs, passionnes. Ton: formalny "vous" zawsze, elegancki, stonowany, "qualite pro" / "specialiste" (NIE "best"/"top").
KONWENCJE: jednostki metryczne, data DD/MM/YYYY, kwota "19,99 €" (przecinek + spacja + symbol po liczbie), kaliber "cal. 4,5 mm", "22 LR". Typografia FR TWARDA: spacja non-breaking przed : ; ! ? (np. "Livraison gratuite !").
UI/CTA: "panier" (NIE cart/basket), "Voir", "Ajouter au panier", "En savoir plus", "Decouvrir", "Commander", "Paiement securise".
TERMINOLOGIA keep-as-is: MOLLE, EDC, IFAK, Picatinny, NATO, FDO, GIGN, RAID, Airsoft, Glock, HK, Beretta, FN, Famas, MultiCam, OD, cal., 22 LR, 9x19. Nazwy brandow nigdy nie tlumacz.
RYZYKO PRAWNE: WYSOKIE. Francja ma 4 kategorie broni (A/B/C/D) - przy broni kat. B+ ZAWSZE wymieniaj kategorie w opisie. Ton opisowy/neutralny bez zachety do zakupu/uzycia. Tlumacz wiernie status prawny, nie interpretuj.
TRUST: eksponuj "Depuis YYYY", ISO 9001, "Livraison offerte", "Retour gratuit", "Paiement securise" jesli sklep podaje. Akademia Francaise - unikaj zbednych anglicyzmow ale Airsoft/Holster/Outdoor zachowaj.
NIE: tu/toi, wykrzykniki spamem, ALL-CAPS poza nazwami brandow, emoji w naglowkach, pomijanie kategorii prawnej, cart/basket/shopping w widocznym UI.
```
