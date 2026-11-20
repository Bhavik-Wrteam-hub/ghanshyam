# GHANSHYAM GROUP website

A premium corporate website and brand system for GHANSHYAM GROUP and its five companies: Ghanshyam Silica Sand, Kaolin, Minerals, Processors and Farm House.

The homepage presents the **group** as the parent brand. Each company has **its own page**, built from the same parts and the same brand system, with its own logo label, photo, products, process, industries, questions and enquiry form.

**All words, numbers, contact details and images live in one file: [`ghanshyam-group/site-content.js`](ghanshyam-group/site-content.js).**
Anything wrapped in `S( ... )` in that file is **temporary sample data**. Replace it with real information before launch.

---

## 1. Look at it

| Page | What it is |
|---|---|
| `index.html` | **GHANSHYAM GROUP**, the homepage: the five-layer hero, who we are, the five businesses, group strength, vision and values, the journey (a sand stream runs down one line as you scroll, lighting each year), leadership, where we work, buyers' words, responsibility, contact |
| `silica-sand.html` | **Ghanshyam Silica Sand**, the flagship: the 3D sand pour, the five grades, the seven-step process (sand down the line, a clip of each step beside it), the lab and the sieve test, the plant |
| `kaolin.html` | **Ghanshyam Kaolin** |
| `minerals.html` | **Ghanshyam Minerals**, where the group began |
| `processors.html` | **Ghanshyam Processors** |
| `farm-house.html` | **Ghanshyam Farm House**, with a harvest calendar on each product |
| `brand.html` | The brand guidelines: the logo and its six lockups, logo files, colour, type, icons, imagery, motion and voice |

| How | What you see |
|---|---|
| Double-click any page | The full site. Works without a server. (The Silica page then shows the sand pour, not a video; see section 4.) |
| Run `python3 tools/serve.py`, then open http://localhost:8765 | The same, served the way a host serves it. |
| Add `?review` to any address, e.g. `kaolin.html?review` | Every sample value is outlined in dashed orange, with a count in the corner. |

**How a visitor moves around.** The menu is the same on every page: the group logo (back to the homepage), About, **Businesses** (a panel with all five companies and their photos; on phones, the five come first in the menu), Journey, Leadership, Responsibility, and the page's main button. On a company page that button is the company's own ("Request a sample", "Request a quote", "Send a trade enquiry"), and a second bar under the first screen links to that page's sections. Every company page ends with the other four companies, and the footer lists all five.

## 2. Replace the sample data

1. Open `ghanshyam-group/site-content.js` in any text editor.
2. Search for `S(`. Each match is a sample value.
3. Type the real value and remove the `S( )` wrapper:

```js
founded: S("1996"),    // sample
founded: "1998",       // real
```

4. Save, reload the page with `?review`, and check that the orange outlines disappear one by one.

If a page ever shows "This page could not load its content", a comma, quote or bracket went missing in the last edit. The browser console (right-click, Inspect, Console) shows the line.

**The file is in four parts, in this order:**

1. **FACTS and THE FIVE BUSINESSES.** Used on every page. Each company has **one entry**: its name, logo label, year it began, tagline, summary, photo, facts, products, button wording and the words of its own page. The menu, the homepage cards, the footer and the form all read from that entry, so a change there shows up everywhere.
2. **THE HOMEPAGE.** The group's hero, story, strength, values, journey, leadership, where we work, testimonials and responsibility.
3. **THE SILICA SAND PAGE.** Its larger parts: the sand pour, the five grades, the process, quality, why us, the plant and its questions.
4. **SHARED.** The enquiry form, the words used on every company page, the footer and the privacy notice.

**Facts are written once and reused.** Sentences use them as `{tokens}`, for example `"washed and tested since {silica.since}"`. Change the fact once and every sentence updates.

- `{company.founded}`, `{company.region}`: the group's facts. `{company.years}` is worked out from the founding year.
- `{kaolin.since}`, `{kaolin.name}`: any field of a company's entry. `{kaolin.years}` is worked out from its year.
- `{capacity.silica}`: each company's monthly capacity, used in its facts, its page and the timeline.
- `{group.companies}`, `{group.states}`, `{group.countries}`: counted from the companies and from the lists under WHERE WE WORK.
- The timeline's years for each company's founding come from that company's `since`, so they never disagree.

### What is sample today, and what to collect from the client

| Area | Sample content to replace |
|---|---|
| Group facts | Legal name, founding year, region, GSTIN, website, people, buyers |
| Contact | Phone, WhatsApp, email, hours, head office and plant addresses |
| Each company | Year it began, summary, facts, products and specs, process steps, questions and answers |
| Silica grades | All five grades: codes, chemistry, physical specs, packing, uses |
| Group strength | The six group numbers (tonnes, people, buyers, acres, trucks, plants) |
| Vision, mission, values | Use the group's own words |
| Journey | Every year and milestone, and the four achievements |
| Leadership | Names, roles and lines. Portraits are optional (until then, initials show) |
| Where we work | Site positions on the map, Indian states and export countries |
| Testimonials | All five quotes. **Never publish the sample quotes as real.** Replace them with real, approved quotes or remove them. |
| Clients | Eight named slots. Replace with real logos, only with each company's permission |
| Responsibility | All four figures |
| Privacy notice | Sample legal text. Have it reviewed before launch. |
| Images | The two maps and the plant plan are illustrations. The photos are AI-generated stand-ins until real photography exists (section 3). Fifteen products show a drawn stand-in. |

## 3. Photos

The original images live in `generated-images/`, outside the website folder, and are never uploaded. `tools/photos.sh` turns each one into three WebP files in `ghanshyam-group/assets/img/photos/`, 480, 800 and 1200 px wide, each made straight from the original in one compression pass. The browser loads the smallest file that still looks sharp on the visitor's screen.

To change a photo:

1. Replace the original in `generated-images/` with a new image of the same name: 4:3 landscape, at least 1200 × 896 (the About photo is portrait, at least 896 × 1200).
2. Run `tools/photos.sh` for all photos, or `tools/photos.sh company-farm` for one. It needs ffmpeg and cwebp (`brew install ffmpeg webp`).
3. If the picture shows something new, update its description in `site-content.js`. It is read aloud to blind visitors.

| Photo | Where it appears |
|---|---|
| `company-*` | The five layers of the homepage hero, the business cards, the Businesses panel, each company's first screen, the "more from the group" cards, the link-preview cards. The `focus` option keeps the subject in view in tall and wide frames. |
| `grade-*` | Silica grade cards and the grade panel with its magnifier. `grade-flour` is also Processors' silica flour. |
| `about-strata` | Who we are (homepage) |

Three illustrations are in `assets/img/placeholders/`: `map-group.svg` (where we work, 4:3; site positions are % values in `site-content.js`), `map-kutch.svg` (the Silica page's contact section) and `plant-map.svg` (the Silica plant plan, 3:2).

**Review of the current set (20 Nov 2026).** No text, logos, watermarks or anatomy problems in any image. All are sRGB.

- **Regenerate the foundry grade.** The amber, bead-like grains read more like resin than sand. Suggested prompt: *macro photo of foundry silica sand, rounded medium grains, pale cream to light tan, on pale stone, soft daylight from the upper left, shallow depth of field, no text*.
- **Farm.** The rows look like young maize, while the copy lists dates, pomegranate, groundnut and cumin. Fine as a stand-in; replace it with a photo of the real farm.

### Product photos still to make

Each company page shows its products. Until a product has a photo, it shows a drawn stand-in (a heap in the colour of the material, labelled "Photo to come" in `?review` mode) in the same 4:3 frame, so the real photo drops in without moving anything:

1. Make the photo and save it as `generated-images/products/<file name>.jpg` (4:3, at least 1200 × 896).
2. Run `tools/photos.sh`.
3. In `site-content.js`, change that product's `placeholder("<file name>", "#tone")` to `photo("<file name>", "What the photo shows")`.

To match the rest of the set, end every prompt with: *studio product photo on pale stone, soft daylight from the upper left, gentle shadows, shallow depth of field, pale grey background, no text, no logos, 4:3*.

| File name | Product | Prompt (then the shared ending) |
|---|---|---|
| `product-kaolin-ceramic` | Ceramic grade kaolin | a small heap of washed, warm white kaolin clay with a few soft lumps beside it |
| `product-kaolin-paper` | Paper grade kaolin | a smooth mound of very fine, bright white kaolin powder |
| `product-kaolin-levigated` | Levigated china clay | a smooth heap of fine, soft, creamy white china clay |
| `product-kaolin-calcined` | Calcined kaolin | a shallow heap of brilliant white calcined kaolin powder, matte and slightly gritty |
| `product-minerals-feldspar` | Potash feldspar | pale pink potash feldspar lumps and grits, crystal faces catching the light |
| `product-minerals-soda-feldspar` | Soda feldspar | creamy white soda feldspar lumps and grits with glassy broken faces |
| `product-minerals-quartz` | Quartz lumps and grits | clear and milky white quartz lumps, with a small heap of sized quartz grits in front |
| `product-minerals-ball-clay` | Ball clay | lumps of grey-cream ball clay with smooth broken faces and a few crumbs |
| `product-processors-quartz-powder` | Quartz powder | a soft heap of bright white quartz powder with a clean scoop mark |
| `product-processors-feldspar-powder` | Feldspar powder | a heap of very fine, pale pink-white feldspar powder |
| `product-processors-job-work` | Custom grinding | three small heaps of fine mineral powder in white, pale pink and grey, side by side |
| `product-farm-dates` | Kutchi dates (kharek) | fresh yellow and red Kutchi kharek dates on the bunch |
| `product-farm-pomegranate` | Pomegranate | two whole Bhagwa pomegranates and one opened to show deep red arils |
| `product-farm-groundnut` | Groundnut | groundnuts in the shell beside a small heap of shelled kernels |
| `product-farm-cumin` | Cumin | a small heap of dry, ridged cumin seeds |

### Footage (short looping clips)

The journey on the homepage and the seven-step process on the Silica page use short looping clips: `quarry`, `washing`, `conveyor`, `pour` and `crystals`. The originals are in `generated-images/footage/` (never uploaded). `tools/footage.sh` turns each into a seamless 9-second loop, 960 px wide with no sound (about 0.6 to 1.4 MB), plus a still in `ghanshyam-group/assets/video/footage/`. A clip only loads when it scrolls near and only plays while on screen; "reduce motion" and data saver show the still.

- To swap a clip: replace the original (same name) and run `tools/footage.sh` (or `tools/footage.sh quarry` for one).
- In `site-content.js` a clip is written `footage("quarry", "What the clip shows")`, and can stand anywhere a milestone or process step takes a `media`.
- **Before launch:** these clips were generated with Gemini and carry its small four-point star in the bottom-right corner. Replace them with clean versions (or real footage of the quarry and plant) of the same names.

### Link-preview cards

When a page is shared on WhatsApp, LinkedIn or elsewhere, the preview shows its own card (1200 × 630): `assets/img/og-image.jpg` for the group (the five layers) and `og-silica.jpg`, `og-kaolin.jpg`, `og-minerals.jpg`, `og-processors.jpg`, `og-farm.jpg` for the companies. They are drawn by `tools/og-card.html` with the site's own logo, words and photos (the Silica card keeps the dark pour photo, `generated-images/sections/og-image.jpg`). After changing a company photo or tagline, rebuild all six with `tools/og-cards.sh`.

## 4. The first screens

**The homepage: five layers.** The group's line beside five tall photo panels, one per company, like the layers of a quarry wall. On arrival the layers rise like core samples drawn from the ground, then each company opens once in turn and the row rests. Pointing at a layer (or tabbing to it) opens it; clicking goes to that company's page. On phones the layers lie flat as five bands. "Reduce motion" shows the rested row straight away.

**The Silica Sand page: the sand pour.** A real-time 3D sand pour (`assets/js/core/sand-scene.js`, WebGL2). Scrolling controls how much sand has poured: the heap grows as you scroll down and shrinks as you scroll back up. Its four captions are the `hero` block in `site-content.js` (exactly four: the scroll timing is tuned for four).

**When sand falls** is decided by the pour valve in `assets/js/sections/hero.js` (`PourValve`):

- **First view:** a slow, cinematic opening pour of about 4 s while the starting heap forms under the stream. Then the valve closes, and the scene is still at about 6 s.
- **Scrolling:** the valve opens the moment the page moves, and pours harder when you scroll faster.
- **Scrolling stops:** the pour lingers for about a second, thinning out, then closes. About 3 s after the last scroll the scene stops rendering entirely, so an idle page costs nothing.
- **Fall speed:** grains take about 0.9 s from the top of the screen to the heap, a slow-motion feel like the reference footage.

The timings are named constants at the top of `PourValve` in `hero.js` (`INTRO`, `INTRO_OPEN`, `LINGER`, `LINGER_THIN`, `OPEN_TAU`, `CLOSE_TAU`, `FALL`). Fall speed and grain size are `FALL_TIME` and `D` at the top of `sand-scene.js`. About 44,000 faceted grains, each lit per pixel, with depth of field, motion blur, a soft heap shadow and grains that roll down the 31° slope. It holds 60 frames per second on this Mac, lowers its own resolution on slower machines, and falls back to a simpler drawn pour without WebGL2. Phones and "reduce motion" get a single rendered still.

### Switching the Silica page to a generated video later

If a generated hero video is added, it takes priority over the drawn pour. The video slot is already built and tested. To switch:

1. Re-encode the approved video for smooth scrubbing (a keyframe every 8 frames):
   ```bash
   ffmpeg -i raw.mp4 -c:v libx264 -crf 18 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an ghanshyam-group/assets/video/hero-scrub.mp4
   ```
2. Make the first and last frames:
   ```bash
   ffmpeg -i ghanshyam-group/assets/video/hero-scrub.mp4 -frames:v 1 -q:v 2 ghanshyam-group/assets/video/hero-poster.jpg
   ```
   ```bash
   ffmpeg -sseof -0.1 -i ghanshyam-group/assets/video/hero-scrub.mp4 -update 1 -frames:v 1 -q:v 2 ghanshyam-group/assets/video/hero-ending.jpg
   ```
3. In `site-content.js` set `hero.video` to the three paths and the video's size in bytes.

Phones, portrait tablets and visitors with "reduce motion" on never download the video. If the video ever fails to load, the page falls back to the drawn pour on its own.

## 5. Connect the enquiry form

Every page ends with an enquiry form. On the homepage the visitor picks a company and a product; on a company's page the list holds only that company's products, and the button uses its wording. "Enquire" on any business card or product card fills the form in (it only ever replaces words it wrote itself, never what the visitor typed). Each enquiry carries the company's name in a `business` field, and the chosen product reads plainly, for example "Ghanshyam Kaolin: Paper grade kaolin", so it is clear which team should answer.

Right now the form is in **demo mode**: it checks every field and shows its thank-you message, but nothing is sent, and the thank-you message says so. Before launch:

1. Create a free account with a form service such as Formspree and create a form.
2. Paste its address into `contact.form.endpoint` in `site-content.js`, for example `"https://formspree.io/f/abcdwxyz"`.

Submissions then arrive in the sales inbox, and the demo note disappears.

## 6. Go live

The folder `ghanshyam-group/` is the whole website: plain files, no build step.

1. In each of the six pages (`index.html`, `silica-sand.html`, `kaolin.html`, `minerals.html`, `processors.html`, `farm-house.html`), replace `https://example.com/` in the two `og:` tags marked `DEPLOY STEP` with the live address.
2. Zip the **contents** of `ghanshyam-group/` (so `index.html` sits at the top level of the zip) and upload it to the host.
3. `README.md`, `tools/`, `review/`, `brand-source/` and `generated-images/` stay outside the website folder and are never uploaded.

## 7. How the code is organised

```
ghanshyam-group/              <- the website (upload this folder's contents)
  index.html                  the group's homepage
  silica-sand.html            Ghanshyam Silica Sand
  kaolin.html, minerals.html, processors.html, farm-house.html
                              the other four companies (the same structure, <body data-company="...">)
  site-content.js             ALL text, numbers, images and links, for every page
  brand.html                  brand guidelines page
  assets/
    css/tokens.css            the brand system: logo colours, site palette, company marker colours, fonts, sizes, spacing, motion
    css/logo.css              logo proportions (all sizes scale from the wordmark width)
    css/base.css              shared building blocks: buttons, kickers, layout, entrances, dark sections
    css/sections/home.css     the homepage's own sections: five-layer hero, businesses, strength, values, where we work
    css/sections/division.css every company page: first screen, its bar, overview, products, process, industries, other companies
    css/sections/*.css        the other sections, one file each (about, journey, silica, process, quality, faq, contact ...)
    js/core/utils.js          helpers: sample tracking, {tokens}, element builder, count-ups, the self-drawing line
    js/core/icons.js          the icon set (24 px line icons)
    js/core/logo.js           the logo: traced artwork + one builder for every company lockup
    js/core/sand-scene.js     the realistic WebGL sand pour (Silica page)
    js/core/sand-stream.js    the sand that runs down a line as you scroll (journey, Silica process)
    js/core/main.js           works out which page this is, renders every section from the content file, wires it up
    js/sections/home.js       the homepage's own sections
    js/sections/division.js   the company page sections
    js/sections/*.js          the other sections: render(), init(), and Motion enhancements
    img/brand/                the logo kit: every lockup as SVG and transparent PNG, colour and reversed
    img/photos/               website photos, three widths each (made by tools/photos.sh)
    img/placeholders/         the group map, the Kutch map and the plant plan
    img/og-*.jpg              the six link-preview cards (made by tools/og-cards.sh)
    video/footage/            the looping clips and their stills (made by tools/footage.sh)
brand-source/logo-final.webp  the finalized logo artwork (master; not part of the website)
generated-images/             original photos (masters; not part of the website)
tools/serve.py                local preview server
tools/photos.sh               builds the website photos from generated-images/
tools/og-card.html, og-cards.sh  draw and build the link-preview cards
tools/footage.sh              builds the looping clips from generated-images/footage/
review/retired/               sections no longer on the site (the old homepage's Industries, Our Products and company cards)
```

- **Change the brand once:** edit a value in `tokens.css` (for example `--accent`) and the whole site and the guidelines page follow.
- **Add a company:** add its entry under THE FIVE BUSINESSES in `site-content.js`, copy `kaolin.html` to its new page name, change `data-company`, the title, description and `og:` tags, add its marker colour as `--tint-<id>` in `tokens.css`, and add its label to the logo kit. The menu, homepage cards, form and footer pick it up on their own.
- **Change one section:** its look is in `css/sections/<name>.css` (or `home.css` / `division.css`), its behaviour in the matching `.js` file.
- **Animation library:** Motion 14.9.1 from a CDN, pinned with an integrity hash. It powers the parallax, card stacking and panel transitions. If it ever fails to load, every section still works, just with simpler motion.

## 8. Design decisions, briefly

- **The group first, the companies under it.** The homepage speaks for GHANSHYAM GROUP: its first screen shows all five companies side by side, and silica is one of five, marked "Flagship" only on its card. Each company then gets a full page of its own. The reference site (somnathgrp.com) shows its companies only as unlabelled logos; here every company has a name, a line, a photo and a page.
- **One idea: grain.** Silica is judged grain by grain, the farm grows grain, and the group grew grain by grain. The quarry-layer hero, the sand pour, the sieve test and the timeline all carry it.
- **The story told down one line.** Following the reference video, the journey and the process run down a single line that fills with sand as the visitor scrolls: the big moments carry a clip or a photo, the smaller steps a short headline facing their card, and the line ends at "Today".
- **One logo header, one label per company.** The G mark (with its sand wave) and the GHANSHYAM wordmark are identical everywhere; only the label below changes: GROUP, SILICA SAND, KAOLIN, MINERALS, PROCESSORS, FARM HOUSE. The menu always carries the group's logo; each company page shows its own lockup on its first screen. Each company's label is `logoLabel` in `site-content.js`.
- **Logo colours are fixed.** The G and wordmark are Deep Slate `#15222C`, the sand wave is Glass Edge `#0B6C70`, and the label and rules are Shale `#4A5963`. On dark backgrounds the reversed set is used: Quartz White `#EEF1EF` with the wave in `#5CC0BB`. The logo is never recoloured; these values live in `tokens.css` (`--logo-*`).
- **Company marker colours tell the pages apart.** Silica Glass Edge, Kaolin China clay, Minerals Feldspar, Processors Mill steel, Farm Field green. They only ever mark things (dots, card edges, icons, a drawn line, a faint wash behind a company's first screen), never text and never the logo. The main button stays Glass Edge on every page, so the group reads as one brand.
- **The site palette comes from the logo.** Deep Slate for text, Shale for supporting text, Glass Edge for the one main action, on Quartz White and Silica Flour. Every text colour passes WCAG AA contrast.
- **Montserrat, Hanken Grotesk, IBM Plex Mono.** Montserrat is the logo's typeface, so it sets every headline. A quiet body face carries the reading, and a mono face makes specs read like a lab report.
- **One clear action per page.** The group's pages lead to "Send an enquiry"; each company's page to its own (a sample, a quote, a trade enquiry).
- **Copy in the buyers' words.** "In spec", "every load", "a test report with every truck" come from how buyers describe what they need.

## 9. Quality checks already run

Headless Chrome at 1440 × 900 and 375 × 812 (touch), on all six pages:

- No console errors and no sideways scrolling on any page, at either size.
- Every link resolves, including the links between pages (for example `index.html#journey` from a company page) and links arriving from another page land just under the menu.
- The Businesses panel opens on hover and on click, the keyboard moves from the button straight into the five companies, Escape closes it and returns focus, and tabbing past it closes it. The phone menu lists the five companies first, opens full height at any scroll position (fixed: it used to open with no height once the page had moved), keeps the page behind still, and closes on any link.
- The company bar lights the section in view and sticks under the menu.
- The forms: empty-submit errors, the demo thank-you, "Enquire" filling in the company and product, a second "Enquire" updating the message, and words the visitor typed staying untouched.
- The FAQ: clicking again while an answer closes reopens it.
- The Silica page: the WebGL pour runs, the grain photo stays in view while the specs scroll (fixed: it used to scroll away), and "Ask for the full spec sheet" fills the form.
- "Reduce motion": every first screen shows its final state, and the homepage's layers do not move on their own.
- The journey and the Silica process: the sand follows the scroll and lights every year or step it reaches, each clip loads near view and plays only while on screen (only the active step's clip plays), the loops are seamless, and "reduce motion" shows the finished line with no grains.
- Copy check on every page and the content file: no long dashes and no corporate filler words.
- Opening any page by double-click works.
