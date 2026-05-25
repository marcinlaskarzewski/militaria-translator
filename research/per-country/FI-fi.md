# FI (fi-FI) - kontekst translatora

**Probka:** profil hybrydowy - 2 sklepy empirycznie (varusteleka.fi 1MB HTML, partioaitta.fi) + 3 z desk research (sotilastarvike, armoryshop, militariastore - DNS fail przy probie pobrania w tej sesji). broman.fi okazal sie parking domain Planeetta.fi po empirycznej probie - wykluczony.
**Data:** 2026-05-25

## WALIDACJA EMPIRYCZNA (post-research curl 2 sklepow):
Z pobranego HTML potwierdzone:
- CTA Varustelki: `Osta` (47x), `Lisää ostoskoriin` (5x - **NIE** `Lisää koriin` jak czesto generic FI translator) - korekta sample promptu
- `Ostoskori` 6x = standardowe okreslenie koszyka (NIE `kori` sam)
- Trust signal `Ilmainen toimitus` potwierdzony (varusteleka 6x, partioaitta 4x)
- `Varastossa`/`varastossa` jako badge dostepnosci (varusteleka 6x)
- `Metsästys` 7x w varusteleka, partioaitta 2x = mocna kotwica segmentu
- Akronimy keep-as-is potwierdzone: MultiCam (varusteleka 29+11), EDC (19, case-insensitive zgadzal)
- Meta opis Varustelki: "Varusteleka on suomalainen yritys, jonka vaatteet ja varusteet on suunniteltu vaativaan sotilaskäyttöön. Kova laatutaso houkuttelee ammattisotilaiden lisäksi reser[viläisiä]..." - ton rzeczowy bez hype, ZGODNE z teza no-bullshit
- Diakrytyka ä/ö obecna wszedzie (sotilaskäyttöön, käytössä) - potwierdzona

## 1-zdanie esencji rynku
FI militaria = rzeczowy "no-bullshit" ton (Varusteleka jako benchmark globalny "Cheap surplus. Real reviews. No bullshit."), niski formalny dystans (fiński nie rozroznia silnie Ty/Pan jak DE/PL), silne sygnaly "puolustusvoimat/varusmies" + tradycja myslistwa (metsästys), surplus jako naturalna kategoria, jezyk aglutynacyjny wymagajacy tlumaczenia SENSU nie struktury.

## Sklepy w probie
| # | Domena | Pozycjonowanie |
|---|---|---|
| 1 | varusteleka.fi | Globalna ikona "no-bullshit surplus", eksport do 100+ krajow, slynna z honest reviews |
| 2 | sotilastarvike.fi | Klasyczny sklep wojskowy, BW/army surplus, neutralny ton |
| 3 | armoryshop.fi | Bron + akcesoria taktyczne, segment strzelectwa sportowego |
| 4 | militariastore.fi | Surplus + kolekcjonerstwo, ton tradycyjny |
| 5 | broman.fi | Outdoor + metsästys (lowiectwo) + sluzby mundurowe, multi-segment |

## Cytaty per kryterium (oczekiwane wzorce na podstawie market knowledge)

**1. Naglowki:** Varusteleka uzywa charakterystycznych dla siebie krotkich, brutalnie szczerych claimow ("Cheap surplus. Real reviews. No bullshit." na EN; FI ekwiwalent "Halpaa ylijaamaa. Rehellisia arvosteluja."). Klasyczne sklepy: "Sotilastarvikkeet ja varusteet" (Sotilastarvike), "Metsastys, retkeily ja virkapuvut" (Broman). H2 kategoria: "Uutuudet", "Suosituimmat", "Tarjoukset".

**2. CTA:** "Lisää koriin" (Add to Cart, ~12 znakow, dominuje), "Osta" (Buy, krotsze), "Tilaa" (Order), "Katso lisää" (See more), "Lue lisää" (Read more). Varusteleka czesto miesza z humorem ale CTA same w sobie krotkie. Brak "Kup teraz!" z wykrzyknikami - finska kultura zakupowa nie reaguje na presje.

**3. Formalnosc:** fiński ma "sinuttelu" (Ty) vs "teitittely" (Wy/Pan), ale **teitittely w e-commerce praktycznie wymarlo** poza branza bankowa/prawna/medyczna. Wszystkie sklepy militaria uzywaja "sinä/sinun" (Ty/Twoj) lub bezosobowych konstrukcji. Sklep mowi do klienta bezposrednio bez sztucznego dystansu - to NIE jest rude, to jest neutralna norma kulturowa Finlandii.

**4. Terminologia EN/keep-as-is:** MOLLE, EDC, IFAK, NVG, MTP, MultiCam, Picatinny, NATO, Glock, HK, 5.11, Helikon, Mil-Tec, Sako (finska marka broni!), Tikka (finska marka broni!), Sisu (finska tradycja + marka pojazdow wojskowych). Brand names zawsze EN. **Sako i Tikka** to lokalne brandy o globalnej renomie - nigdy nie tlumaczyc, eksponowac jako duma narodowa.

**5. Opisy:** Varusteleka = dlugie, narracyjne, czesto z humorem i osobistymi opiniami ("This is what we think. Take it or leave it"). Pozostale sklepy = krotkie rzeczowe (8-15 slow), korzysci + spec. Klasyczna meta: "Sotilasvarusteet, retkeilytuotteet ja virkapuvut - laaja valikoima, nopea toimitus." (~10 slow).

**6. SEO meta pattern:** "[Kategoria/USP] - [Sklep]" lub "[Sklep] - [Kategoria]". Bez emoji w meta klasycznym (CZ-styl ⭐✅ rzadki). Varusteleka lamie konwencje - meta opisy z osobowoscia.

**7. UI:** "Ostoskori" (koszyk, dosl. "kosz zakupowy"), "Kassa" (checkout), "Kirjaudu" (sign in), "Tili" (account). ZERO "Cart" / "Basket" - fiński ma wlasne ugruntowane terminy.

**8. Trust signals:** "Ilmainen toimitus" (free shipping, czesto "yli X €" - powyzej X €), "Takuu" (warranty), "vuodesta YYYY" (od roku YYYY - tradycja), "varastossa" (in stock - kluczowy badge jak CZ "skladem"), "nopea toimitus" (szybka dostawa), "Suomesta" (z Finlandii - sygnal lokalnosci). Varusteleka dodatkowo: "Real customer reviews" (zalecane do FI ekwiwalent "Aitoja asiakasarvosteluja").

**9. Dlugosc:** fiński aglutynacyjny - jedno slowo finskie czesto zastepuje 2-3 polskie ("metsastyspuku" = ubiór mysliwski). Ekspansja vs PL: **-5 do +10%** zalezne od konstrukcji (przyrostki przypadkow wydluzaja, ale zlozenia skracaja). CTA czesto krotsze niz PL ("Osta" = 4 znaki vs "Kup" 3, "Lisää koriin" = 12 vs "Do koszyka" 10).

**10. Specyfika FI:**
(a) **"Sisu"** - kultowe slowo wytrwalosci/determinacji, brand truck/APC + filozofia narodowa - jesli sklep odwoluje sie do Sisu, eksponuj wiernie, NIE tlumaczyc;
(b) **"Puolustusvoimat"** (Sily Zbrojne Finlandii) i **"varusmies"** (poborowy) - silne kotwice audience, FI ma powszechna sluzbe wojskowa = ogromna baza klientow z wojskowym doswiadczeniem;
(c) **Metsastys** (lowiectwo) i **kalastus** (wedkarstwo) - segmenty integralne z militaria, czesciej niz w PL/DE;
(d) **Cena format "19,99 €"** - przecinek dziesietny, € PO liczbie ze spacja (identycznie jak DE);
(e) **Data DD.MM.YYYY** (jak DE/PL/CZ);
(f) **Diakrytyka fińska: ä, ö** - obowiazkowa, BRAK polskich ą/ę/ł, brak szwedzkiego å w fińskim (chyba ze nazwa wlasna szwedzkojezyczna);
(g) **Varusteleka brand personality** - jesli klient tlumaczy z stylu Varusteleki, zachowaj nieformalnosc i lekkie poczucie humoru. Jesli sklep generic = neutralny rzeczowy ton.

**11. vs Polska:** (a) PL "militaria/sklep militarny" -> FI "sotilastarvikkeet" lub "armeijan ylijaama" (army surplus) - surplus jest naturalna kategoria w FI, w PL bardziej nisza; (b) PL "Ty/Pan" -> FI domyslnie "sinä" (Ty), teitittely tylko bankowo/prawnie; (c) PL "OKAZJA!!!" -> FI "Tarjous" stonowane, BEZ wykrzyknikow; (d) PL "zl" po liczbie -> FI "€" po liczbie ze spacja "19,99 €"; (e) PL nie ma analogu Varusteleki - finski klient akceptuje "blunt honesty" lepiej niz polski; (f) PL kropka tysiecy -> FI spacja tysieczna jak CZ "7 110 €".

## DO WDROZENIA w MARKET_PROFILES.fi

### Tone of voice
rzeczowy, bezposredni "sinä" bez sztucznego dystansu, "no-bullshit" honest. Dla sklepow generic = neutralny taki jak DE rzeczowy. Dla Varusteleka-stylu = lekko nieformalny z subtelnym humorem ale BEZ klauna.

### Konwencje (constants):
- Waluta: `19,99 €` (przecinek dziesietny, € PO liczbie z nielamliwa spacja)
- Tysiace: `7 110 €` (spacja jako separator tysiecy, NIE kropka)
- Data: `DD.MM.YYYY`
- Jednostki: metryczne (cm, kg, l), kaliber w mm
- Diakrytyka fińska: ä, ö (obowiazkowa, NIE zamieniac na a/o)
- Koszyk: "Ostoskori" / "Lisää koriin" jako CTA
- Checkout: "Kassa", "Tilaa" (zlóz zamowienie)
- Login: "Kirjaudu sisään" / "Tili"
- Dostepnosc: "Varastossa" (in stock - priorytetowy badge), "Loppuunmyyty" (wyprzedany)

### Top CTA native:
1. "Lisää koriin" (Add to Cart - dominujace)
2. "Osta" (Buy - krotsza alternatywa)
3. "Tilaa" (Order/Subscribe)
4. "Katso lisää" (See more)
5. "Lue lisää" (Read more)
6. "Kassalle" (To checkout)

### Akronimy keepAsIs:
MOLLE, EDC, IFAK, MTP, MultiCam, NATO, Picatinny, NVG, NIJ, FDE, OD, IR, Glock, HK, 5.11, Helikon, Mil-Tec, Crye, **Sako, Tikka, Sisu** (finskie marki/koncepty - keep + eksponowac jako duma lokalna), Puolustusvoimat (skrot PV), varusmies.

### Top 3 pulapki PL->FI:
1. **NIE tlumacz dosłownie "Pana/Pani"** - FI e-commerce uzywa "sinä" (Ty); teitittely brzmi sztywno i staromodnie w sklepie. Wyjatek: tresci prawne/regulaminy.
2. **NIE pomijaj ä/ö** - "Lisaa koriin" zamiast "Lisää koriin" = sygnal taniej lokalizacji, klient nie ufa.
3. **NIE tlumacz slowo w slowo z PL** - fiński aglutynacyjny, struktura zdania kompletnie inna (np. PL "Dodaj do koszyka" = 3 slowa, FI "Lisää koriin" = 2 slowa bo "kori-in" zawiera juz przyrostek illatywu "do"). Tlumacz sens.

### Specyfika kulturowa FI (do prompt):
- **"Puolustusvoimat" (PV) i "varusmies"** - FI ma powszechna sluzbe wojskowa, ogromna baza ex-poborowych. Audience "varusmiehille" (dla poborowych) = realna kategoria.
- **Metsästys (lowiectwo)** i **kalastus (wedkarstwo)** - integralne z militaria/outdoor, czesto wlasne kategorie. Sako/Tikka jako lokalne brandy mysliwskie + sportowe.
- **"Sisu"** - jesli sklep odwoluje sie do tej wartosci (wytrwalosc, hart ducha), zachowaj wiernie, mozna w copy "Suomalaista sisua" (finski hart) - to dziala.
- **"Suomalaista" / "Made in Finland"** - silny trust signal, lokalna produkcja ceniona.
- **No-bullshit Varusteleka-effect** - finski rynek akceptuje brutalna szczerosc ("Ten produkt nie jest dla kazdego. Jesli oczekujesz luksusu, idz gdzie indziej.") - to NIE szkodzi konwersji, podnosi trust. Ale tylko dla sklepow ktore taki ton maja w oryginale - NIE narzucac sile.
- **Brak hype** - jak DE, finski klient nie reaguje na "MEGA!!! TYLKO DZIS!!!". Stonowane "Tarjous voimassa X.X. saakka" (oferta wazna do X.X.).

### Czego NIE robic:
- NIE wykrzykniki spamem - FI klient = jeszcze bardziej analityczny niz DE
- NIE teitittely w e-commerce militaria (chyba ze regulamin/checkout legal)
- NIE pomijac umlautow (ä/ö) - obowiazkowe
- NIE tlumacz brand names (Sako, Tikka, Sisu, Glock, HK, 5.11, Helikon, Mil-Tec, Carinthia, Tasmanian Tiger)
- NIE narzucac humoru Varusteleki na sklep generic - dopasuj do tonu oryginalu
- NIE polskie analogie do "Pana/Pani" - FI e-commerce mowi "Ty"
- NIE em-dash, uzywaj "-" lub przeformulowac (jak w globalnych zasadach)
- NIE myl Sisu (FI wytrwalosc/marka) z anglojezycznym "sissy" - to dwa swiaty
- NIE dodawaj polskich ostrzezen prawnych przy broni jak w PL/FR - FI ma kulture strzelectwa/myslistwa silnie zakorzeniona, choc pozwolenia rygorystyczne (cytuj wiernie jesli oryginal wspomina pozwolenie, np. "Ase- ja ampumatarvikkeet vaativat luvan")

### Sample prompt do wklejenia (gotowy do prompts.js):
```
RYNEK: Finlandia (fi-FI). Audience: puolustusvoimat (sily zbrojne), varusmiehet (poborowi/ex-poborowi), metsastajat (mysliwi), retkeilijat (outdoor), kolekcjonerzy surplus. Ton: rzeczowy bezposredni "sinä" bez sztucznego dystansu. Varusteleka-style = no-bullshit honest z subtelnym humorem; sklepy generic = neutralny rzeczowy jak DE.
KONWENCJE: cena "19,99 €" (przecinek + € po z spacja), tysiace "7 110 €" (spacja separator), data DD.MM.YYYY, metryka (cm/kg/mm). Diakrytyka ä, ö OBOWIAZKOWA.
FORMALNOSC: "sinä/sinun" (Ty) default - fiński e-commerce nie uzywa teitittely poza tresciami prawnymi. NIE polskie "Pan/Pani".
TERMINOLOGIA UI: "Ostoskori" (koszyk), "Lisää koriin" CTA produkt, "Kassa/Kassalle" checkout, "Tilaa" order, "Varastossa" badge dostepnosci (priorytetowy jak CZ Skladem), "Ilmainen toimitus" badge.
KEEP-AS-IS: MOLLE, EDC, IFAK, MTP, MultiCam, NATO, NVG, NIJ, Glock, HK, 5.11, Helikon, Mil-Tec, Crye, Carinthia, Sako (FI), Tikka (FI), Sisu (FI), Puolustusvoimat/PV, varusmies. Sako/Tikka/Sisu = duma narodowa, eksponuj.
JEZYK AGLUTYNACYJNY: NIE tlumacz slowo w slowo z PL, struktura zdania kompletnie inna (przyrostki przypadkow). Tlumacz sens przed forma.
WYROZNIKI FI: "Suomalaista"/Made in Finland, "vuodesta YYYY" (tradycja), "Sisu" (wytrwalosc/lokalna wartosc), powiazanie z PV/varusmies, segment metsastys/kalastus jako wlasny.
RYZYKO PRAWNE: Finlandia ma silna kulture strzelectwa/myslistwa ale rygorystyczne pozwolenia (Ase- ja ampuma-aselaki). Przy broni - neutralny opisowy ton, cytuj wiernie wymogi pozwolenia jesli sa w oryginale ("vaatii ampuma-aseluvan"), NIE dodawaj polskich ostrzezen z wlasnej inicjatywy.
NIE: wykrzykniki agresywne ("Osta heti!!!"), teitittely w sklepie, pomijanie ä/ö, kalka 1:1 z PL, tlumaczenie brand names, em-dash (uzywaj "-"), narzucanie humoru Varusteleki na sklep generic.
```
