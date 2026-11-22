# GHANSHYAM GROUP website

A premium corporate website and brand system for GHANSHYAM GROUP and its five companies: Ghanshyam Silica Sand, Kaolin, Minerals, Processors and Farm House.

The homepage presents the **group** as the parent brand. Each company has **its own page**, built from the same parts and the same brand system, with its own logo label, photo, products, process, industries, questions and enquiry form.

**All words, numbers, contact details and images live in one file: [`ghanshyam-group/site-content.js`](ghanshyam-group/site-content.js).**
Anything wrapped in `S( ... )` in that file is **temporary sample data**. Replace it with real information before launch.

---

## 1. Look at it

| Page | What it is |
|---|---|
| `index.html` | **GHANSHYAM GROUP**, the homepage: five branch films that play one at a time as you scroll, who we are, the five businesses as layers of the quarry wall, products and applications by company, group strength, vision and values, the journey (a sand stream runs down one line as you scroll, lighting each year), leadership, where we work, buyers' words, responsibility, contact |
| `silica-sand.html` | **Ghanshyam Silica Sand**, the flagship: the 3D sand pour, the five grades, the seven-step process (sand down the line, a clip of each step beside it), the lab and the sieve test, the plant |
| `kaolin.html` | **Ghanshyam Kaolin**, opening on its own film |
| `minerals.html` | **Ghanshyam Minerals**, where the group began |
| `processors.html` | **Ghanshyam Processors** |
| `farm-house.html` | **Ghanshyam Farm House**, with a harvest calendar on each product |
| `brand.html` | The brand guidelines: the logo and its six lockups, clear space, the seal and small icons, logo files, colour and the five Strata, type, icons, imagery, motion and voice |

| How | What you see |
|---|---|
| Double-click any page | The full site. Works without a server. |
| Run `python3 tools/serve.py`, then open http://localhost:8765 | The same, served the way a host serves it. |
| Add `?review` to any address, e.g. `kaolin.html?review` | Every sample value is outlined in dashed orange, with a count in the corner. |

**How a visitor moves around.** The menu is the same on every page: the group logo (back to the homepage), About, **Businesses** (a panel with all five companies and their photos; on phones, the five come first in the menu), Products, Applications, Journey, Responsibility, and the page's main button. On a company page that button is the company's own ("Request a sample", "Request a quote", "Send a trade enquiry"), and a second bar under the first screen links to that page's sections. Every company page ends with the other four companies, and the footer lists all five.

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
| Images | The two maps and the plant plan are illustrations. Every photo and film is an AI-generated stand-in until real photography exists (section 3). |

## 3. Photos and films

The original images live in `generated-images/`, outside the website folder, and are never uploaded. `tools/photos.sh` turns each one into three WebP files in `ghanshyam-group/assets/img/photos/`, 480, 800 and 1200 px wide, each made straight from the original in one compression pass. The browser loads the smallest file that still looks sharp on the visitor's screen.

To change a photo:

1. Replace the original in `generated-images/` with a new image of the same name: 4:3 landscape, at least 1200 × 896 (the About photo is portrait, at least 896 × 1200).
2. Run `tools/photos.sh` for all photos, or `tools/photos.sh company-farm` for one. It needs ffmpeg and cwebp (`brew install ffmpeg webp`).
3. If the picture shows something new, update its description in `site-content.js`. It is read aloud to blind visitors.

| Photo | Where it appears |
|---|---|
| `company-*` | The Businesses panel, the Applications section, the "more from the group" cards, the link-preview cards. The `focus` option keeps the subject in view in tall and wide frames. |
| `product-*` | Fifteen product photos: each company's product cards and the homepage's product range. |
| `grade-*` | Silica grade cards, the grade panel with its magnifier, and the homepage's product range. `grade-flour` is also Processors' silica flour. |
| `about-strata` | "Today" at the end of the journey, the brand page, and the fallback if the About film cannot load |

Three illustrations are in `assets/img/placeholders/`: `map-group.svg` (where we work, 4:3; site positions are % values in `site-content.js`), `map-kutch.svg` (the Silica page's contact section) and `plant-map.svg` (the Silica plant plan, 3:2).

To add a new product photo, save it as `generated-images/products/<file name>.jpg` (4:3, at least 1200 × 896), run `tools/photos.sh`, and in `site-content.js` write `photo("<file name>", "What the photo shows")` on that product. To match the set, end every prompt with: *studio product photo on pale stone, soft daylight from the upper left, gentle shadows, shallow depth of field, pale grey background, no text, no logos, 4:3*.

**One note on the current set.** The farm photo and film show rows like young maize, while the copy lists dates, pomegranate, groundnut and cumin. They work as stand-ins. Replace them with the real farm when you have it.

### Films (short looping clips)

Each company's first screen, its layer in the businesses section, the journey and the Silica process use short looping films: `silica`, `kaolin`, `minerals`, `processors`, `farm` and `quarry`. The originals are in `generated-images/footage/` (never uploaded). `tools/footage.sh` turns each into a seamless loop, 1280 px wide with no sound, plus a still in `ghanshyam-group/assets/video/footage/`.

- A film's still loads only when it comes near the screen, and the film itself only downloads and plays while it is on screen.
- Phones, "reduce motion" and data saver keep the still and never download the film. (The homepage's five branch films are the exception on phones: see section 4.)
- To swap a film: replace the original (same name) and run `tools/footage.sh` (or `tools/footage.sh quarry` for one). `CRF=30 tools/footage.sh farm` makes a smaller file for a busy shot.
- In `site-content.js` a film is written `footage("quarry", "What the film shows")`, and can stand anywhere a company, milestone or process step takes a `film` or `media`.

### Link-preview cards

When a page is shared on WhatsApp, LinkedIn or elsewhere, the preview shows its own card (1200 × 630): `assets/img/og-image.jpg` for the group (the five layers) and `og-silica.jpg`, `og-kaolin.jpg`, `og-minerals.jpg`, `og-processors.jpg`, `og-farm.jpg` for the companies. They are drawn by `tools/og-card.html` with the site's own logo, words and photos (the Silica card keeps the dark pour photo, `generated-images/sections/og-image.jpg`). After changing a company photo or tagline, rebuild all six with `tools/og-cards.sh`.

## 4. The first screens

### The branch films

The homepage opens with the group's headline over the first film. Scrolling alone moves through the five companies: each company's card rises and lands on the last one while its film fades in and plays. There is no slider to use, and mouse, trackpad, keyboard and touch all behave the same, on desktop and on phones.

- **One plays at a time.** `assets/js/core/branch-player.js` watches the page with IntersectionObserver (no scroll events). Leaving the first screen, hiding the tab or pressing the small round pause button stops the film. Phones have no pause button on the first screen, so nothing sits over the film; there the About film's button pauses every film.
- **Light to load.** Only the current film and its two neighbours load, and the neighbours wait until the current one can play. Films further away are released from memory.
- **The right cut for each screen.** Each film has three cuts: up to 1080p for large screens, 720p for small or slow ones, and a 9:16 crop for phones and portrait tablets. Each comes as H.264 MP4 and WebM, with a poster frame, so nothing is blank before it plays.
- **When a film cannot play.** "Reduce motion", data saver and very slow connections get the poster. If a video fails its poster stays, and if the poster fails too the original quarry picture (`assets/video/hero/group-poster.jpg`) shows.

**These five films are placeholders** made with Gemini until real footage of each business exists. Add `?review` to the address and each one is marked. To replace one:

1. Save the new film as `generated-images/branches/<branch>.mp4` (`silica`, `kaolin`, `minerals`, `processors` or `farm`). Use 16:9 and 1080p, with the subject in the right half of the frame and a still camera, so it loops cleanly.
2. Run the build for that branch:

```bash
tools/branch-films.sh kaolin
```

3. Reload the page. No code changes are needed. The prompts behind the current films are in `generated-images/branches/PROMPTS.md`.

### The About film

Beside "Who we are", an excavator scoops sand from a heap and loads it into a parked dump truck. The film plays only while at least half of it is on screen, and the branch films rest while it does, so the page never plays two at once. It follows the same pause button, "reduce motion", data saver and slow connection rules. If the video cannot play its poster stays, and if the poster fails too the quarry photo (`about-strata`) shows.

**The film is a placeholder** made with Gemini. It has the orange look of a Hitachi machine but no maker's name or logo, because showing a company's logo needs that company's permission. Film of the group's own machine is the real replacement.

**Still to come:** the full truck driving away and the next truck backing in. Those two shots, and a remake of the loading shot with the truck starting empty, need Gemini credit (about $2.28). `generated-images/about/PROMPTS.md` has the exact commands and prompts.

To swap a shot, save it in `generated-images/about/` as `truck-load.mp4`, `truck-leave.mp4` or `truck-arrive.mp4` (9:16, 1080p, still camera), then run the build and reload the page:

```bash
tools/about-film.sh
```

The build joins whichever shots exist into one loop. The part kept in view on tablets and phones is `about.film.focusSmall` in `site-content.js`.

### The company pages

Kaolin, Minerals, Processors and Farm House each open on their own film, full screen, with the logo reversed over it. On phones the film's still takes its place.

### The Silica Sand page: the sand pour

A real-time 3D sand pour (`assets/js/core/sand-scene.js`, WebGL2). Scrolling controls how much sand has poured: the heap grows as you scroll down and shrinks as you scroll back up. Its four captions are the `hero` block in `site-content.js` (exactly four: the scroll timing is tuned for four).

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
  site.webmanifest            the name and icons for phones' home screens
  silica-sand.html            Ghanshyam Silica Sand
  kaolin.html, minerals.html, processors.html, farm-house.html
                              the other four companies (the same structure, <body data-company="...">)
  site-content.js             ALL text, numbers, images and links, for every page
  brand.html                  brand guidelines page
  assets/
    css/tokens.css            the brand system: logo colours, site palette, company marker colours, fonts, sizes, spacing, motion
    css/logo.css              logo proportions (all sizes scale from the wordmark width)
    css/base.css              shared building blocks: buttons, kickers, layout, entrances, dark sections
    css/sections/film.css     the homepage's first screen: the five branch films
    css/sections/home.css     the homepage's own sections: the Strata, products, applications, strength, values, where we work
    css/sections/division.css every company page: first screen, its bar, overview, products, process, industries, other companies
    css/sections/*.css        the other sections, one file each (about, journey, silica, process, quality, faq, contact ...)
    js/core/utils.js          helpers: sample tracking, {tokens}, element builder, count-ups, the self-drawing line
    js/core/icons.js          the icon set (24 px line icons)
    js/core/logo.js           the logo: traced artwork, one builder for every lockup, the seal, the drawn reveal
    js/core/sand-scene.js     the realistic WebGL sand pour (Silica page)
    js/core/sand-stream.js    the sand that runs down a line as you scroll (journey, Silica process)
    js/core/main.js           works out which page this is, renders every section from the content file, wires it up
    js/core/branch-player.js  decides which film loads and plays: the five branch films and the About film
    js/sections/film.js       the homepage's first screen
    js/sections/home.js       the homepage's own sections
    js/sections/division.js   the company page sections
    js/sections/*.js          the other sections: render(), init(), and Motion enhancements
    img/brand/                the logo kit: every lockup as SVG and transparent PNG, colour and reversed; the seal and the browser and phone icons
    img/photos/               website photos, three widths each (made by tools/photos.sh)
    img/placeholders/         the group map, the Kutch map and the plant plan
    img/og-*.jpg              the six link-preview cards (made by tools/og-cards.sh)
    video/branches/           the five branch films in every cut, with posters (made by tools/branch-films.sh)
    video/about/              the excavator film in two sizes, with posters (made by tools/about-film.sh)
    video/hero/               the original quarry picture, kept as the fallback
    video/footage/            the looping films and their stills (made by tools/footage.sh)
brand-source/logo-final.webp  the finalized logo artwork (master; not part of the website)
generated-images/             original photos (masters; not part of the website)
tools/serve.py                local preview server
tools/photos.sh               builds the website photos from generated-images/
tools/og-card.html, og-cards.sh  draw and build the link-preview cards
tools/footage.sh              builds the looping clips from generated-images/footage/
tools/branch-films.sh         builds the five branch films from generated-images/branches/
tools/about-film.sh           builds the About film from generated-images/about/
review/higgsfield-2026-11-21/  the raw AI images and films from this redesign (large; keep out of the website)
review/retired/               things no longer on the site (old sections, old styles, the watermarked clips)
```

- **Change the brand once:** edit a value in `tokens.css` (for example `--accent`) and the whole site and the guidelines page follow.
- **Add a company:** add its entry under THE FIVE BUSINESSES in `site-content.js`, copy `kaolin.html` to its new page name, change `data-company`, the title, description and `og:` tags, add its marker colour as `--tint-<id>` in `tokens.css`, and add its label to the logo kit. The menu, homepage cards, form and footer pick it up on their own.
- **Change one section:** its look is in `css/sections/<name>.css` (or `home.css` / `division.css`), its behaviour in the matching `.js` file.
- **Animation library:** Motion 14.9.1 from a CDN, pinned with an integrity hash. It powers the parallax, card stacking and panel transitions. If it ever fails to load, every section still works, just with simpler motion.

## 8. Design decisions, briefly

- **The group first, the companies under it.** The homepage speaks for GHANSHYAM GROUP, and silica is one of five, marked "Flagship" only on its layer. Each company then gets a full page of its own.
- **One idea: Strata.** Kutch ground is laid down in layers, and the group works every layer. The first screen gives each company its own film, the businesses section is five stacked layers, and the same five colours mark the section rules and the footer's edge. The full reasoning is in [`SITE-BLUEPRINT.md`](SITE-BLUEPRINT.md).
- **The structure buyers expect.** The section order follows the primary reference (Shree Ram Minerals): welcome, products, applications, strength, clients, contact. Every section has its own layout and none of their design or words are copied.
- **The story told down one line.** The journey and the process run down a single line that fills with sand as the visitor scrolls, and the journey's line ends at the group's seal. On phones the journey opens with the years a company began, and one button shows them all.
- **One logo header, one label per company.** The G mark (with its sand wave) and the GHANSHYAM wordmark are identical everywhere; only the label below changes: GROUP, SILICA SAND, KAOLIN, MINERALS, PROCESSORS, FARM HOUSE. The menu always carries the group's logo; each company page shows its own lockup on its first screen. Each company's label is `logoLabel` in `site-content.js`.
- **Logo colours are fixed.** The G and wordmark are Deep Slate `#15222C`, the sand wave is Glass Edge `#0B6C70`, and the label and rules are Shale `#4A5963`. On dark backgrounds the reversed set is used: Quartz White `#EEF1EF` with the wave in `#5CC0BB`. The logo is never recoloured; these values live in `tokens.css` (`--logo-*`).
- **The logo is refined in how it is used, not redrawn.** A monogram seal for round places (the end of the journey line), a clear-space rule, browser and phone icons, and a short drawn reveal that plays once per visit and ends on the exact logo.
- **Company marker colours tell the pages apart.** Silica Glass Edge, Kaolin China clay, Minerals Feldspar, Processors Mill steel, Farm Field green. They only ever mark things (dots, card edges, icons, a drawn line, a faint wash behind a company's first screen), never text and never the logo. The main button stays Glass Edge on every page, so the group reads as one brand.
- **The site palette is built around the logo.** Deep Slate for text, Shale for supporting text, Glass Edge for the one main action, on warm Limestone `#F2F1EC` and Kaolin `#E7E4DD`, with the five Strata colours taken from the quarry wall. Every text colour passes WCAG AA contrast.
- **Montserrat, Hanken Grotesk, IBM Plex Mono.** Montserrat is the logo's typeface, so it sets every headline. A quiet body face carries the reading, and a mono face makes specs read like a lab report.
- **One clear action per page.** The group's pages lead to "Send an enquiry"; each company's page to its own (a sample, a quote, a trade enquiry).
- **Copy in the buyers' words.** "In spec", "every load", "a test report with every truck" come from how buyers describe what they need.

## 9. Quality checks already run

Run on 21 Nov 2026 in Chrome on all seven pages at eight screen sizes (1440, 1280, 1024, 820, 390, 375 and 320 px wide, and a landscape phone), and in Safari on a simulated iPhone 17. **Not yet checked on a physical phone.**

- **Every page at every size:** no console errors, no sideways scrolling, nothing cut off at the screen edge, no broken images, and touch controls at least 44 px tall.
- **The five branch films (197 checks):** at six screen sizes each film plays alone when its company reaches the middle of the screen and pauses when it leaves. Only the current film and its neighbours load, fast scrolling never plays two at once, and real touch swipes work. Reduce motion, data saver, blocked videos and blocked posters all fall back correctly, and nothing shifts on the page while films swap.
- **iPhone Safari:** the films autoplay muted and inline, change with touch swipes, and keep playing after rotating the phone.
- **On a slow phone** (simulated 3G, CPU four times slower): scrolling held 60 frames a second with no long tasks, and video never held up the page. The first screen took about 5 seconds to appear because the site is built by its scripts, not because of the films.
- **Every interaction (76 checks):** the Businesses menu, the phone menu (focus, Escape, scroll lock), the businesses layers, the product and application tabs by mouse, touch and keyboard, Enquire filling in the form, form errors and the thank-you, quotes, FAQ, privacy, the journey's button, the grade picker, the plant map, and every internal link.
- **Legibility:** the opening words and the menu stay above 4.5:1 contrast on the worst frame of the moving film.
- **Accessibility:** one main heading per page, no skipped heading levels, named controls, labelled fields, alt text, AA text contrast, a visible keyboard focus, and a pause button for the films.
- **Content:** all 1,147 pieces of original text and every company name are unchanged, and no long dashes or filler words appear on any page.

This project has no automated test setup, so these checks were run with throwaway browser scripts and no test files were added.
