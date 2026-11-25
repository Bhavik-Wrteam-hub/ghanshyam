# GHANSHYAM GROUP website: blueprint and design direction

Version 3, as built (21 Nov 2026). The redesign brief: a premium, client-ready corporate site for the group and its five companies, built on the 10k-websites rules. Every group and company name, and all business content in `ghanshyam-group/site-content.js`, stays exactly as it is. Only the presentation changes.

---

## 1. What the four reference sites taught us

| Site | What works | What we do better |
|---|---|---|
| **Shree Ram Minerals** (primary) | A clear order a mineral buyer expects: hero, welcome, product range, applications by product, clients and sectors, numbers, business strength, get in touch with a map. Products and applications both sit in the main menu. | Their sections are stamped from one template (kicker, title, centred grid) and the photos are generic. We keep their order and make every section its own layout, with our own imagery. |
| **The Sharad Group** | One bold mining photo with a single promise ("A legacy of 60+ years"). A dark band listing the businesses side by side. | Their business cards all link to one page. Ours link to a full page per company. |
| **Mangalam Minerals** | Real plant photos, a dark "Why choose us" band with numbered points, CSR shown with evidence, partner and careers cards, WhatsApp contact. | Their slider hero and dense header feel dated. We use one calm header and a scroll film. |
| **Sibelco** | The most premium of the four: huge confident type, generous white space, a materials grid on clean product shots, a full-bleed sustainability photo, a numbers strip, a strong contact band. | Their numbers sit in a plain strip. Ours count up on the strata line that runs through the group. |

**The combined direction:** Shree Ram's section order, Sibelco's restraint and scale, Sharad's single bold promise, Mangalam's proof (real numbers, CSR evidence, direct WhatsApp).

### Second review: the Optimatrix portfolio (25 Nov 2026)

The client felt some sections did not look finished. All 80 sites in the Optimatrix portfolio (optimatrix.in/portfolio) were captured and reviewed. Most are templates for travel, accountants and shops; the closest to us are the industrial, mineral and group sites: Asteroid Microns and HD Microns (kaolin), TRP Global (minerals), Mahendra C. Shah, Morakhia and Kalikund (groups), Trimech, Parul, Kenwood, Peuro Metals, Sontech, Acon and Pollux. Four of their patterns fixed our four weakest sections, drawn in our own style:

| Section | Pattern taken | What changed |
|---|---|---|
| Leadership | Promoter cards (Peuro Metals) | Each person is one card. Until a photo exists, the portrait shows the initials on deep emerald over a gold rule, the G mark faint behind them and the Strata at the base. |
| Clients, under the quotes | The "trusted by" strip (Kenwood, Jainson Locks, Sontech, BOM GIM) | A slow running strip, one icon per buyer. It pauses on hover, focus and off screen, and "reduce motion" shows one still list. Real logos drop into the same strip. |
| The group in numbers | Counter cards with icons (Trimech, Parul, Sontech) | Six cards: an icon, the number counting up, what it counts. |
| Where we work | The "Global reach" legend (Asteroid Microns) | Across India and Export become cards with an icon and a count worked out from their lists ("9 states", "6 countries"). |

Kept as they were, because they already beat the references: the first screen, the businesses, products, applications, journey, contact and footer. Not taken: slider heroes, pop-ups on arrival and dense headers. A thin contact bar above the menu (phone, email, hours) is common on these sites. It was left out because it would move the tuned first screen, and it is a possible next step.

## 2. The brand premise: Strata

Kutch ground is laid down in layers: white silica, cream kaolin, pink feldspar, grey stone, green topsoil. GHANSHYAM GROUP works every layer: five companies, one ground. The site teaches that one idea.

**Signature element: the Strata.** Five horizontal bands of mineral colour, one per company. They appear as:
- the group's company index, five stacked layers that open on click or tap, one at a time;
- a thin five-colour rule beside the businesses heading;
- the base of each stand-in leadership portrait;
- the ring of the monogram seal, where the journey's line of sand ends;
- the footer edge.

If the Strata were removed, the site would lose its map of the group. That is the test of a real signature.

## 3. Design system

### Logo
The approved logo stays exactly as drawn and coloured (G and wordmark Deep Slate `#15222C`, sand wave Glass Edge `#0B6C70`, label Shale `#4A5963`; reversed `#EEF1EF` with wave `#5CC0BB`). The fresh logo direction is about use, not redrawing, and all of it is built:
- a clear-space rule (one letter height on every side), drawn in `brand.html`;
- a monogram seal: the same G, reversed, on a Deep Slate disc inside the five strata (`GG.seal`, `ghanshyam-seal.svg`);
- browser and phone icons that drop the ring so the G stays sharp at 16 px;
- the horizontal lockup in the header;
- a 1.5-second drawn reveal, once per visit, that ends on the exact logo (`GG.drawLogo`).

Any change to the mark itself goes to the client as a separate proposal.

### Palette (CSS tokens)
```css
--canvas:#F2F1EC;        /* Limestone: warm stone white, the page */
--canvas-deep:#E9E7E1;   /* quiet bands */
--panel:#E7E4DD;         /* Kaolin: alternate sections */
--panel-raised:#FBFAF7;  /* cards */
--text-primary:#15222C;  /* Deep Slate (logo): text, dark bands */
--text-secondary:#4A5963;/* Shale (logo): secondary text */
--basalt:#0F1A21;        /* the darkest band */
--accent:#0B6C70;        /* Glass Edge (logo wave): buttons, focus, rare emphasis */
--accent-on-dark:#5CC0BB;
--ochre:#A87B43;         /* Kutch ochre: small warm accents only */
--stratum-1..5:#F1EDE3, #E3D3B4, #D6AFA2, #98A0A1, #6E6B43;   /* white silica, cream kaolin, pink feldspar, grey stone, olive topsoil */
/* company tints, markers only: silica #0B6C70, kaolin #7E5F4A, minerals #574F86, processors #355A74, farm #3F6B2E */
```
The accent appears only on buttons, focus rings and one emphasis per section.

### Type
- **Display:** Montserrat 700/800 (the logo's own face), tight tracking, sizes from 45px to 106px on the hero.
- **Body:** Hanken Grotesk 400/500/600.
- **Labels and specs:** IBM Plex Mono 500, uppercase, tracked.

### Grid and spacing
A 12-column grid with a 1280px maximum and gutters of 16px (phone) to 48px. Spacing runs on an 8px scale. Sections breathe at 72 to 160px, tighter on phones.

### Components
Buttons (solid accent, ghost), text links with a drawn underline, chips, tabs, product cards, company strata bands, counters, accordions, the enquiry form, and 24px line icons in one stroke style.

### Imagery
Two families, one world. Product close-ups sit on pale limestone in soft daylight from the upper left. Places (quarry, plant, farm) are shown in natural golden light. No text, no logos, no posed people inside images.

### Motion
- The first screen plays five branch films, one at a time, as each company scrolls into view, on desktop and phone alike. "Reduce motion" and data saver get poster frames.
- Each section has its own entrance, and nothing is hidden if the animation library fails to load.
- Company films loop quietly, play only on screen, and never download on phones.
- The sand line in the journey follows the scroll.
- Counters count up.
- Almost everything animates with `transform` and `opacity` only. Everything eases. "Reduce motion" shows every final state at once, and switches live in both directions.

## 4. Page structure

### Homepage (`index.html`, the group), in this order
1. **Hero, five branch films.** The group's headline and two buttons, then one screen per company. Each company's own film fades in and plays while it is in view, with its name, line and link on a card.
2. **Who we are.** The group story and the founder's line, beside the quarry-wall photo.
3. **Our businesses (the Strata).** Five full-width layers, one per company: name, tagline, key products, facts and its film, with a link to its page.
4. **Our products.** Tabs per company, product cards with photos, each with Enquire, and links into each company page.
5. **Applications.** Tabs per company, with the industries it supplies as an icon grid.
6. **Group strength.** A dark band: the quarry-to-customer chain and the group in numbers.
7. **Vision, mission and values.**
8. **Journey.** The sand line timeline, about a quarter shorter than before. On phones it opens with the years a company began, with one button for all eleven.
9. **Leadership.**
10. **Where we work.** The Kutch map, Indian states and export countries.
11. **What buyers say.** Quotes tagged by company, and the client slots.
12. **Responsibility (CSR).** Four commitments, each led by one number.
13. **Contact.** Direct channels, the enquiry form and the map.
14. **Footer** with the strata edge.

### Each company page (shared template, `body data-company="id"`)
1. A hero with the company's own film and logo lockup.
2. A sticky company bar with in-page links.
3. Overview and business activities.
4. Products with photos.
5. Process.
6. Capabilities (its facts and numbers).
7. Industries served.
8. FAQ.
9. Enquiry form.
10. The other companies.

The silica page keeps its sand-pour journey, grades, lab sieve moment and plant map.

## 5. Media, as spent (Higgsfield, 120 credits at the start)

| Item | Model | Credits |
|---|---|---|
| Hero start frame (16:9, 2k) | Nano Banana Pro | 2 |
| Hero scroll film (6 s, 1080p, no sound) | Minimax Hailuo 2.3 | 10 |
| Five company films (6 s, 1080p, each started from that company's approved photo) | Minimax Hailuo 2.3 | 50 |
| 15 product photos and a new foundry grade photo (2k) | Nano Banana Pro | 32 |
| One re-roll of the foundry photo | Nano Banana Pro | 2 |
| **Total** | | **96**, leaving **24** |

The five company films replaced the five older clips that carried another tool's watermark. Those clips are in `review/retired/gemini-footage/` and are no longer on the site.

### Branch films, made with Gemini (21 Nov 2026)

| Item | Model | Cost (USD, estimate) |
|---|---|---|
| Five 2K start pictures | Nano Banana 2.1 | $0.25 |
| Five 6-second 1080p videos from those pictures | Gemini Omni 1.2 Flash | $3.12 |
| About film, first version (excavator digging, now retired): two 2K pictures | Nano Banana 2.1 | $0.10 |
| About film, first version: one 8-second 1080p video | Gemini Omni 1.2 Flash | $0.83 |
| About film, truck loading: three 2K key pictures | Nano Banana 2.1 | $0.15 |
| About film, truck loading: one 10-second 1080p video | Gemini Omni 1.2 Flash | $1.04 |

The branch films replace the single scroll film, which is kept in `review/retired/hero-scroll-film/`. The truck-loading film replaces the quarry photo beside "Who we are". All of them are placeholders until real footage of each business exists. The truck driving away and the next truck arriving are still to be made (about $2.28) once the Gemini account has credit: see `generated-images/about/PROMPTS.md`.

## 6. Copy gate
All site words come from `site-content.js` unchanged: a script compared the old and new file, and all 1,147 pieces of original text are still there. New labels added for the redesign follow the house rules: plain short sentences, no long dashes, no stock words (leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions).

## 7. Phone design

Phones get their own layouts, not a squeezed desktop. The homepage is about 16% shorter on a phone than when the redesign started, with nothing removed:

- the first screen is a still, and a phone's first load is about 0.8 MB with no video;
- long lists become compact rows with the icon beside the words (values, why us, responsibility, achievements);
- applications and industries sit in two short columns;
- products, leadership and client names are rows you swipe;
- call and WhatsApp sit side by side, and every control is at least 44 px tall;
- on the smallest phones the menu button keeps its icon and the logo keeps its full size.
