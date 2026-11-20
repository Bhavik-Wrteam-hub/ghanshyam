# GHANSHYAM GROUP website

A premium corporate website and brand system for GHANSHYAM GROUP: silica sand first, plus Kaolin, Minerals, Processors and Farm House.

**All words, numbers, contact details and images live in one file: [`ghanshyam-group/site-content.js`](ghanshyam-group/site-content.js).**
Anything wrapped in `S( ... )` in that file is **temporary sample data**. Replace it with real information before launch.

---

## 1. Look at it

| How | What you see |
|---|---|
| Double-click `ghanshyam-group/index.html` | The full site. Works without a server. |
| Run `python3 tools/serve.py`, then open http://localhost:8765 | The same, served the way a host serves it. Use this when testing the hero video later (browsers block video loading from a double-clicked file). |
| Open `index.html?review` (add `?review` to the address) | Every sample value is outlined in dashed orange, with a count in the corner. |
| Open `ghanshyam-group/brand.html` | The brand guidelines: the logo and its six branch lockups, logo files to download, colour, type, icons, imagery, motion and voice. |

## 2. Replace the sample data

1. Open `ghanshyam-group/site-content.js` in any text editor.
2. Search for `S(`. Each match is a sample value.
3. Type the real value and remove the `S( )` wrapper:

```js
founded: S("1996"),    // sample
founded: "1998",       // real
```

4. Save, reload the page with `?review`, and check that the orange outlines disappear one by one.

**Facts are written once and reused.** The `facts` block at the top holds the company name, founding year, region, phone, email, addresses, moisture spec and so on. Sentences elsewhere use them as `{tokens}`, for example `"washed and tested since {company.founded}"`. Change the fact once and every sentence updates. "Years in business" is calculated from the founding year automatically.

### What is sample today, and what to collect from the client

| Area | Sample content to replace |
|---|---|
| Company facts | Legal name, founding year, region, GSTIN, website |
| Contact | Phone, WhatsApp, email, hours, head office and plant addresses |
| Silica grades | All five grades: codes, chemistry, physical specs, packing, uses |
| Numbers | Capacity, number of buyers, quarry size, storage, port distances |
| Other companies | Kaolin, Minerals, Processors, Farm House: descriptions, products, facts |
| Our Products | All fifteen product cards: names, specs and texts. Eleven of them show a drawn stand-in until their photo exists (section 3). |
| Journey | Every year and milestone on the timeline |
| Quality | Certification name, sample retention period, sieve test result numbers |
| Testimonials | All three quotes. **Never publish the sample quotes as real.** Replace them with real, approved quotes or remove them. |
| Founder quote | Name, role and words |
| FAQ | Iron figures, minimum order, delivery times |
| Privacy notice | Sample legal text. Have it reviewed before launch. |
| Images | The plant plan and the Kutch map are still illustrations. The photos are AI-generated stand-ins until real photography exists (section 3). |

## 3. Photos

The original images live in `generated-images/`, outside the website folder, and are never uploaded. `tools/photos.sh` turns each one into three WebP files in `ghanshyam-group/assets/img/photos/`, 480, 800 and 1200 px wide, each made straight from the original in one compression pass. The browser loads the smallest file that still looks sharp on the visitor's screen: 8 MB of originals became 1.2 MB at the largest size, and a phone loads well under half of that.

To change a photo:

1. Replace the original in `generated-images/` with a new image of the same name: 4:3 landscape, at least 1200 × 896 (the About photo is portrait, at least 896 × 1200).
2. Run `tools/photos.sh` for all photos, or `tools/photos.sh company-farm` for one. It needs ffmpeg and cwebp (`brew install ffmpeg webp`).
3. If the picture shows something new, update its description in `site-content.js`. It is read aloud to blind visitors.

| Photo | Where it appears | Frame |
|---|---|---|
| `grade-*` | Silica grade cards, and the detail panel with the magnifier | 4:3 |
| `company-silica` | Flagship card in the group section | 4:3 |
| `company-kaolin`, `-minerals`, `-processors`, `-farm` | Company cards | Square on desktop, 16:10 on phones. The `focus` option in `site-content.js` keeps the subject in view (the plant photo keeps its worker, the farm photo its huts and sun). |
| `about-strata` | About section | Tall 9:11 on desktop, 16:10 on phones |

Two illustrations remain in `assets/img/placeholders/`: `plant-map.svg` (infrastructure plan, 3:2, hotspot positions are % values in `site-content.js`) and `map-kutch.svg` (contact section, 4:3).

**Link preview card.** `assets/img/og-image.jpg` (1200 × 630) is drawn by `tools/og-card.html`: the photo `generated-images/sections/og-image.jpg` with the reversed logo in the exact logo colours and the line "Precision, grain by grain." The rebuild command is at the top of that file.

**Review of the current set (20 Nov 2026).** No text, logos, watermarks or anatomy problems in any image. All are sRGB.

- **Regenerate the foundry grade.** The amber, bead-like grains read more like resin than sand, and it is the one warm picture in a cool grade row. Suggested prompt: *macro photo of foundry silica sand, rounded medium grains, pale cream to light tan, on pale stone, soft daylight from the upper left, shallow depth of field, no text*.
- **Farm.** The rows look like young maize, while the copy lists dates, pomegranate, groundnut and cumin. Fine as a stand-in; replace it with a photo of the real farm.

### Product photos still to make

The **Our Products** section shows three products per company. The silica products and silica flour use the grade photos. The other eleven draw a stand-in (a heap in the colour of the material, labelled "Photo to come" in `?review` mode) in the same 4:3 frame, so a real photo drops in without moving anything:

1. Make the photo and save it as `generated-images/products/<file name>.jpg` (4:3, at least 1200 × 896).
2. Run `tools/photos.sh`.
3. In `site-content.js`, change that product's `placeholder("<file name>", "#tone")` to `photo("<file name>", "What the photo shows")`.

To match the rest of the set, end every prompt with: *studio product photo on pale stone, soft daylight from the upper left, gentle shadows, shallow depth of field, pale grey background, no text, no logos, 4:3*.

| File name | Product | Prompt (then the shared ending) |
|---|---|---|
| `product-kaolin-ceramic` | Ceramic grade kaolin | a small heap of washed, warm white kaolin clay with a few soft lumps beside it |
| `product-kaolin-paper` | Paper grade kaolin | a smooth mound of very fine, bright white kaolin powder |
| `product-kaolin-calcined` | Calcined kaolin | a shallow heap of brilliant white calcined kaolin powder, matte and slightly gritty |
| `product-minerals-feldspar` | Potash feldspar | pale pink potash feldspar lumps and grits, crystal faces catching the light |
| `product-minerals-quartz` | Quartz lumps and grits | clear and milky white quartz lumps, with a small heap of sized quartz grits in front |
| `product-minerals-ball-clay` | Ball clay | lumps of grey-cream ball clay with smooth broken faces and a few crumbs |
| `product-processors-quartz-powder` | Quartz powder | a soft heap of bright white quartz powder with a clean scoop mark |
| `product-processors-feldspar-powder` | Feldspar powder | a heap of very fine, pale pink-white feldspar powder |
| `product-farm-dates` | Kutchi dates (kharek) | fresh yellow and red Kutchi kharek dates on the bunch |
| `product-farm-pomegranate` | Pomegranate | two whole Bhagwa pomegranates and one opened to show deep red arils |
| `product-farm-groundnut` | Groundnut | groundnuts in the shell beside a small heap of shelled kernels |

**How the section works.** Its content is the `products` block in `site-content.js`; the code is `assets/js/sections/products.js` and `assets/css/sections/products.css`. A product written as `grade: "glass"` takes its name, code and photo from that silica grade, and its card opens the grade's spec sheet in the Silica Sand section. Every other card pre-fills the sample request form with the company and the product name. The chips at the top narrow the list to one company and stay under the navigation bar on larger screens. The section replaced "Industries we serve"; the old code and content are kept in `review/retired/industries/`.

## 4. The hero: a realistic sand pour, and the video slot

The top of the page is a real-time 3D sand pour (`assets/js/core/sand-scene.js`, WebGL2). Scrolling controls how much sand has poured: the heap grows as you scroll down and shrinks as you scroll back up.

**When sand falls** is decided by the pour valve in `assets/js/sections/hero.js` (`PourValve`):

- **First view:** a slow, cinematic opening pour of about 4 s while the starting heap forms under the stream. Then the valve closes, and the scene is still at about 6 s.
- **Scrolling:** the valve opens the moment the page moves, and pours harder when you scroll faster.
- **Scrolling stops:** the pour lingers for about a second, thinning out, then closes. The stream's tail falls, loose grains roll to rest, and about 3 s after the last scroll the scene stops rendering entirely, so an idle page costs nothing.
- **Fall speed:** grains take about 0.9 s from the top of the screen to the heap, a slow-motion feel like the reference footage.

The timings are named constants at the top of `PourValve` in `hero.js` (`INTRO`, `INTRO_OPEN`, `LINGER`, `LINGER_THIN`, `OPEN_TAU`, `CLOSE_TAU`, `FALL`). Fall speed and grain size are `FALL_TIME` and `D` at the top of `sand-scene.js`.

Like the reference footage, it uses:

- **Individual crystals:** about 44,000 faceted quartz grains, each lit per pixel, so highlights move as grains tumble.
- **Optics:** depth of field (the stream and the foreground go soft, the heap stays sharp) and motion blur on falling grains.
- **Light:** one soft key light from the upper left and a cool fill, with a lit side and a shaded side.
- **Grounding:** a soft heap shadow and contact shadows under loose grains.
- **Physics:** the heap rises at sand's natural 31° slope. New grains roll down from the top, and impacts throw grains that bounce and scatter across the floor.

It holds 60 frames per second on this Mac. On slower machines it lowers its own resolution, and without WebGL2 it falls back to the simpler drawn pour. Phones and "reduce motion" get a single rendered still.

To tune the look, change the constants at the top of `sand-scene.js`: `D` (grain size), `REPOSE` (slope), and the spawn rate in `simulate()` (how heavy the pour is).

### Switching to a generated video later

If a generated hero video is added, it takes priority over the drawn scene. The video slot is already built and tested. To switch:

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

Phones, portrait tablets and visitors with "reduce motion" on never download the video. They see a composed still hero instead. If the video ever fails to load, the page falls back to the drawn pour on its own.

## 5. Connect the sample request form

Right now the form is in **demo mode**. It checks every field and shows its thank-you message, but nothing is sent, and the thank-you message says so. Before launch:

1. Create a free account with a form service such as Formspree and create a form.
2. Paste its address into `contact.form.endpoint` in `site-content.js`, for example `"https://formspree.io/f/abcdwxyz"`.

Submissions then arrive in the sales inbox, and the demo note disappears.

## 6. Go live

The folder `ghanshyam-group/` is the whole website: plain files, no build step.

1. Replace `https://example.com/` in the two `og:` tags in `index.html` (marked `DEPLOY STEP`) with the live address. Link previews then show `assets/img/og-image.jpg`.
2. Zip the **contents** of `ghanshyam-group/` (so `index.html` sits at the top level of the zip) and upload it to the host.
3. `README.md`, `tools/` and `review/` stay outside the website folder and are never uploaded.

## 7. How the code is organised

```
ghanshyam-group/              <- the website (upload this folder's contents)
  index.html                  page structure only: one empty <section> per part of the page
  site-content.js             ALL text, numbers, images and links
  brand.html                  brand guidelines page
  assets/
    css/tokens.css            the brand system: logo colours, site palette, fonts, sizes, spacing, motion curves
    css/logo.css              logo proportions (all sizes scale from the wordmark width)
    css/base.css              shared building blocks: buttons, kickers, layout, entrances
    css/sections/*.css        one file per section (hero, about, silica, process, ...)
    js/core/utils.js          helpers: sample tracking, {tokens}, element builder, count-ups
    js/core/icons.js          the icon set (24 px line icons)
    js/core/logo.js           the logo: traced artwork + one builder for every branch lockup
    js/core/sand-scene.js     the realistic WebGL sand pour in the hero
    js/core/main.js           renders every section from the content file, then wires it up
    js/sections/*.js          one file per section: render(), init(), and Motion enhancements
    img/brand/                the logo kit: every lockup as SVG and transparent PNG, colour and reversed
    img/photos/               website photos, three widths each (made by tools/photos.sh)
    img/placeholders/         the two remaining illustrations (plant plan, Kutch map)
    img/og-image.jpg          the link preview card (made from tools/og-card.html)
    video/                    the hero video goes here later
brand-source/logo-final.webp  the finalized logo artwork (master; not part of the website)
generated-images/             original photos (masters; not part of the website)
tools/serve.py                local preview server
tools/photos.sh               builds the website photos from generated-images/
tools/og-card.html            the source of the link preview card
```

- **Change the brand once:** edit a value in `tokens.css` (for example `--accent`) and the whole site and the guidelines page follow.
- **Change one section:** its look is in `css/sections/<name>.css`, its behaviour in `js/sections/<name>.js`. Sections do not depend on each other.
- **Add a section:** add a `<section data-section="name">` to `index.html`, create `js/sections/name.js` (registering `GG.sections.name = { render, init }`) and `css/sections/name.css`, link both in `index.html`, and add its content block to `site-content.js`.
- **Animation library:** Motion 14.9.1 from a CDN, pinned with an integrity hash. It powers the parallax, card stacking, count-ups and panel transitions. If it ever fails to load, every section still works, just with simpler motion.

## 8. Design decisions, briefly

- **One idea: grain.** Silica is judged grain by grain, the farm grows grain, and the group grew grain by grain. The logo, the hero, the sieve test and the timeline all carry it.
- **The finalized logo, one header for every company.** The G mark (with its sand wave) and the GHANSHYAM wordmark are traced from the final artwork into vector paths, so they are identical everywhere. Only the label below changes: GROUP, SILICA SAND, KAOLIN, MINERALS, PROCESSORS, FARM HOUSE. Labels are set in Montserrat Medium, letter spaced, between two rules. Each company's label is set in `site-content.js` (`logoLabel`).
- **Logo colours are fixed.** The G and wordmark are Deep Slate `#15222C`, the sand wave is Glass Edge `#0B6C70`, and the label and rules are Shale `#4A5963`. On dark backgrounds the reversed set is used: Quartz White `#EEF1EF` with the wave in `#5CC0BB`. The logo is never recoloured; these values live in `tokens.css` (`--logo-*`).
- **The site palette comes from the logo.** Deep Slate for text, Shale for supporting text, Glass Edge for the one main action, on Quartz White and Silica Flour. Every text colour passes WCAG AA contrast.
- **Montserrat, Hanken Grotesk, IBM Plex Mono.** Montserrat is the logo's typeface, so it sets every headline. A quiet body face carries the reading, and a mono face makes specs read like a lab report. Section labels carry a short rule, echoing the rules in the logo label.
- **One call to action: Request a sample.** Glass and foundry buyers test a lot before they sign. Every section answers one buyer worry (purity, consistency, lab proof, supply) and leads to the sample form.
- **Silica first.** It gets the hero, the full product showcase with spec tables and the sieve scale, the process and quality sections, and the flagship card in the group section. The other four companies follow as stacked cards in their own colours.
- **Copy in the buyers' words.** "In spec", "every load", "a test report with every truck" come from how glass and foundry buyers describe what they need.

## 9. Quality checks already run

Headless Chrome at 1440×900, 1280×800, 375×812 (touch) and 812×375 (landscape phone):

- No console errors, and no sideways scrolling at any size.
- The hero passes the flick test: every caption stays readable for 6 or more normal scroll flicks, and none can be skipped at fast scroll.
- The video slot was tested with a stand-in clip (scroll position maps exactly to video time, in both directions) and with a failed load (falls back to the drawn pour).
- The WebGL sand scene held a steady 60 fps (16.7 ms per frame, no dropped frames) during a full scroll on Apple M4 graphics. With WebGL switched off, the page falls back to the drawn pour with no errors.
- Pour valve: after the opening pour, and about 3 s after every scroll stops, the last grain lands and the render loop sleeps (no frames drawn while idle). This holds in both the WebGL scene and the fallback.
- Phones and "reduce motion" get the still hero and download no video. Switching "reduce motion" on and off while the page is open re-arms the scroll story correctly.
- Every interaction was tested: grade cards (mouse and arrow keys), the press-and-hold sieve (full hold and early release), form validation, errors and success, timeline, FAQ, testimonials, plant hotspots, phone menu and privacy dialog.
- Copy check: no long dashes and no corporate filler words.
- Opening `index.html` by double-click works.
