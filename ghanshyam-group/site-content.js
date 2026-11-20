/* ============================================================================
   GHANSHYAM GROUP: SITE CONTENT  (the only file you need to edit for words)
   ============================================================================

   Every word, number, contact detail, image and link on the website comes
   from this file. The pages hold no text of their own.

   THE PAGES
   ---------
     index.html          GHANSHYAM GROUP, the parent company (the homepage)
     silica-sand.html    Ghanshyam Silica Sand
     kaolin.html         Ghanshyam Kaolin
     minerals.html       Ghanshyam Minerals
     processors.html     Ghanshyam Processors
     farm-house.html     Ghanshyam Farm House

   THIS FILE, IN ORDER
   -------------------
     1. FACTS and THE FIVE BUSINESSES   used on every page
     2. THE HOMEPAGE                    the group: hero, story, businesses, strength ...
     3. THE SILICA SAND PAGE            its sand pour, grades, process, lab and plant
     4. SHARED                          enquiry form, page words, footer, privacy

   Each business has ONE entry under THE FIVE BUSINESSES. The menu, the
   homepage cards, the footer, the enquiry form and that company's own page
   all read from it, so a change there shows up everywhere.

   HOW SAMPLE DATA IS MARKED
   -------------------------
   Anything wrapped in S( ... ) is TEMPORARY SAMPLE DATA. It was written so the
   site reads as finished during review. Replace each one with real company
   information before launch:

       founded: S("1996"),        <- sample (shown with a dashed outline in review mode)
       founded: "1998",           <- real   (S( ) wrapper removed)

   - Search this file for  S(  to find every sample value.
   - Open any page with  ?review  at the end of the address
     (for example  index.html?review ) to see every sample value outlined in
     orange on the page itself.
   - Facts used inside sentences are written as {tokens}, for example
     "since {company.founded}". Change the fact once and every sentence that
     uses it updates. Each business works the same way: {kaolin.since} is the
     year Ghanshyam Kaolin began, {kaolin.years} how many years ago that was.
   - Keep the quotes, commas and brackets exactly as they are. Only change the
     text between the quotes. If a page ever shows "could not load its
     content", a comma, quote or bracket is missing near your last change.

   PHOTOS
   ------
   Photos are written as  photo("name", "What the photo shows").
   The files live in assets/img/photos in three widths, made from the
   originals in the generated-images folder by tools/photos.sh. To change a
   photo, replace its original with a new image of the same name and run
   that script. The second part is the description read aloud to blind
   visitors and shown if the photo cannot load: say plainly what is in it.
   A product with no photo yet uses placeholder("name", "#tone") instead: a
   drawn heap in the colour of the material. See the README for the list.

   WRITING RULES FOR THIS BRAND (please keep them when editing)
   - Plain, short, confident sentences. Buyers' own words.
   - No long dashes. Use commas and full stops.
   ========================================================================== */

/** Marks a value as temporary sample data. Remove the S( ) when it is real. */
function S(value) { return { __sample: true, value: value }; }

/** A photo from assets/img/photos, in 480, 800 and 1200 px widths (never
    wider than the original). The browser loads the smallest one that still
    looks sharp on the visitor's screen. Options:
      w, h   size of the original, when it is not 1200 x 896 (portrait photos)
      focus  the point that stays in view when a frame crops the photo:
             "50% 50%" is the centre, "80% 50%" keeps the right side */
function photo(name, alt, opts) {
  opts = opts || {};
  var w = opts.w || 1200, h = opts.h || 896, top = Math.min(w, 1200);
  var widths = [480, 800].filter(function (x) { return x < w; }).concat(top);
  function url(x) { return "assets/img/photos/" + name + "-" + x + ".webp"; }
  return {
    src: url(top),
    srcset: widths.map(function (x) { return url(x) + " " + x + "w"; }).join(", "),
    width: top,
    height: Math.round(h * top / w),
    alt: alt,
    focus: opts.focus || null
  };
}

/** A short looping video from assets/video/footage (made from the originals in
    generated-images/footage by tools/footage.sh), with its still for phones
    and "reduce motion". The second part says what it shows, as for photos. */
function footage(name, alt) {
  return { video: "assets/video/footage/" + name + ".mp4", poster: "assets/video/footage/" + name + ".webp", alt: alt };
}

/** A drawn stand-in for a product photo that does not exist yet. It always
    counts as sample content. name is the photo's future file name, tone the
    colour of the material. When the photo is ready, replace
    placeholder("name", "#tone") with photo("name", "What the photo shows"). */
function placeholder(name, tone) { return S({ placeholder: name, tone: tone }); }

window.SITE_CONTENT = {

  /* ##########################################################################
     1. FACTS AND THE FIVE BUSINESSES (used on every page)
     ########################################################################## */

  /* ==========================================================================
     FACTS: core group details, reused across every page via {tokens}
     ========================================================================== */
  facts: {
    company: {
      groupName: "GHANSHYAM GROUP",
      shortName: "Ghanshyam",
      logoLabel: "GROUP",                 /* the label under the group's own logo */
      legalName: S("Ghanshyam Group of Companies"),
      founded: S("1996"),                 /* the year the group began; {company.years} is worked out from this */
      region: S("Kutch, Gujarat"),
      country: "India",
      gstin: S("24AAACG0000A1Z5"),
      website: S("www.ghanshyamgroup.example")
    },
    /* Group numbers. {group.companies} counts the businesses below, and
       {group.states} and {group.countries} count the lists under WHERE WE WORK. */
    group: {
      people: S("600"),                   /* people at work across the five companies */
      buyers: S("400")                    /* buyers in India and abroad */
    },
    contact: {
      phone: S("+91 98250 00000"),
      whatsapp: S("+91 98250 00000"),
      email: S("info@ghanshyamgroup.example"),
      hours: S("Monday to Saturday, 9:00 to 18:30 IST"),
      headOffice: S(["Ghanshyam House, Station Road", "Bhuj, Kutch, Gujarat 370001", "India"]),
      plant: S(["Survey No. 214, Bhuj-Mundra Road", "Kukma, Kutch, Gujarat 370105", "India"]),
      mapQuery: S("Bhuj, Kutch, Gujarat, India")
    },
    /* Monthly capacity of each company: used in the company facts, the
       silica page and the timeline. */
    capacity: {
      silica: S("36,000 t"),
      kaolin: S("6,000 t"),
      processors: S("4,500 t")
    },
    quality: {
      moisture: S("0.5%"),
      retention: S("six months"),
      certification: S("ISO 9001:2015")
    },
    sample: {
      size: S("2 kg"),
      days: S("three working days")
    }
  },

  /* ==========================================================================
     THE FIVE BUSINESSES
     --------------------------------------------------------------------------
     One entry per company. What each part is for:
       id, page       the company's code name (keep it) and its page file
       name, short    full name, and the short name used in menus
       logoLabel      the label under GHANSHYAM in this company's logo
       since          the year it began ({kaolin.since} in sentences)
       tagline        one short line, used in the menu and on the homepage
       summary        two sentences for the homepage card
       image          its photo (homepage, menu, its own page)
       facts          [label, value] pairs for its cards and page
       keyProducts    the short product list on the homepage card
       cta            its main button, and the wording on its form's button
       meta           its page's browser-tab title and search description
       hero, overview, products, process, industries, faq, contact
                      the sections of its own page
     ========================================================================== */
  companies: [

    /* ---- 1. Ghanshyam Silica Sand (the flagship) ------------------------- */
    {
      id: "silica",
      page: "silica-sand.html",
      name: "Ghanshyam Silica Sand",
      short: "Silica Sand",
      logoLabel: "SILICA SAND",
      flagship: true,
      since: S("2003"),
      tagline: "Washed, sized and tested sand.",
      summary: S("Silica sand in five grades for glass, foundry, construction and water filters. Every lot is tested in our own lab before it ships."),
      image: photo("company-silica", "A cone of white silica sand on a pale stone block"),
      facts: S([["Capacity", "{capacity.silica} a month"], ["Grades", "5"]]),
      /* keyProducts: the five grades are listed automatically from SILICA SAND below */
      cta: { label: "Request a sample", submit: "Request my sample" },
      meta: {
        title: "Ghanshyam Silica Sand | Glass, foundry and filter grade silica sand from {company.region}",
        description: "Washed, classified and tested silica sand in five grades, with a test report on every load. A GHANSHYAM GROUP company."
      },
      /* The silica page opens with the sand pour (SAND POUR, part 3), then this */
      overview: {
        title: "The group's largest company, built on its first quarry.",
        body: S([
          "Ghanshyam Silica Sand opened its quarry on the Bhuj-Mundra road in {silica.since} with one washing line. Today two lines wash, size and dry up to {capacity.silica} of sand a month.",
          "Glass makers, foundries, mortar plants and water utilities buy from us for one reason: what arrives at their gate matches the sample they approved."
        ])
      },
      industries: {
        title: "Where our sand goes.",
        items: [
          { icon: "glass", label: "Float and container glass" },
          { icon: "foundry", label: "Foundries" },
          { icon: "construction", label: "Mortar, adhesive and plaster" },
          { icon: "water", label: "Water treatment" },
          { icon: "ceramics", label: "Ceramics" },
          { icon: "paint", label: "Paints and coatings" },
          { icon: "fibre", label: "Fibreglass" }
        ]
      },
      contact: {
        title: "Test it in your own lab first.",
        lede: "Tell us your process and the grade you need. We send a free {sample.size} sample with its test report, and a quote if you want one.",
        map: S({ src: "assets/img/placeholders/map-kutch.svg", alt: "Schematic map of Kutch showing the plant, Bhuj, and the ports of Mundra and Kandla" })
      }
    },

    /* ---- 2. Ghanshyam Kaolin ----------------------------------------------- */
    {
      id: "kaolin",
      page: "kaolin.html",
      name: "Ghanshyam Kaolin",
      short: "Kaolin",
      logoLabel: "KAOLIN",
      since: S("2009"),
      tagline: "White clay, refined.",
      summary: S("Washed kaolin for ceramic bodies, glazes, paper and paint. Mined at our own Kutch deposit and refined in our own plant next door."),
      image: photo("company-kaolin", "A lump of raw white kaolin clay on a pale grey surface"),
      facts: S([["Brightness", "82 to 88%"], ["Capacity", "{capacity.kaolin} a month"]]),
      keyProducts: S(["Ceramic grade kaolin", "Paper grade kaolin", "Levigated china clay", "Calcined kaolin, on request"]),
      cta: { label: "Request a sample", submit: "Request my sample" },
      meta: {
        title: "Ghanshyam Kaolin | Ceramic and paper grade kaolin from {company.region}",
        description: "Washed and levigated kaolin for tiles, sanitaryware, paper and paint, with a test report on every lot. A GHANSHYAM GROUP company."
      },
      hero: {
        text: "Washed and levigated kaolin for tiles, sanitaryware, paper and paint, with the same whiteness lot after lot."
      },
      overview: {
        title: "Clay from our own deposit, refined next door.",
        body: S([
          "Ghanshyam Kaolin began in {kaolin.since}, when a kaolin deposit beside our silica quarry became the group's third company. The clay is mined, washed and refined on one site.",
          "Ceramic and paper makers judge kaolin by its whiteness, its iron and how it behaves in the body. We test all three on every lot and send the numbers with the truck."
        ]),
        points: S([
          { icon: "quarry", title: "Our own deposit", text: "Mined and blended for a steady chemistry." },
          { icon: "wash", title: "Our own refining plant", text: "Washed and settled to take out grit and sand." },
          { icon: "lab", title: "Tested every lot", text: "Whiteness, iron and residue on every report." }
        ])
      },
      products: {
        title: "Kaolin for every body and coating.",
        lede: "Pick the grade for your process. Every lot ships with its own test report.",
        items: S([
          { name: "Ceramic grade kaolin", spec: "Whiteness 85% min", text: "Washed kaolin for tile bodies, sanitaryware and tableware, low in iron for a clean fired colour.", image: placeholder("product-kaolin-ceramic", "#ECE7DF") },
          { name: "Paper grade kaolin", spec: "Brightness 82 to 88%", text: "A fine, bright clay for filling and coating paper and board, steady from lot to lot.", image: placeholder("product-kaolin-paper", "#F2F0EB") },
          { name: "Levigated china clay", spec: "Residue 0.5% max", text: "Settled slowly to leave the grit behind, for smooth glazes and fine ceramic bodies.", image: placeholder("product-kaolin-levigated", "#EEEAE3") },
          { name: "Calcined kaolin", spec: "Brightness 90% min", text: "Kaolin fired for extra brightness and hardness, for paints, plastics and cables. Made on request.", image: placeholder("product-kaolin-calcined", "#F8F8F6") }
        ])
      },
      process: {
        title: "From the deposit to your bag.",
        steps: S([
          { icon: "quarry", title: "Mine and blend", text: "We mine and blend the clay at our own deposit, so the chemistry holds steady." },
          { icon: "wash", title: "Wash and settle", text: "Water, blungers and settling tanks take out the sand and grit." },
          { icon: "dry", title: "Press and dry", text: "Filter presses and dryers bring the clay to the moisture you ask for." },
          { icon: "lab", title: "Test and pack", text: "Every lot is tested for whiteness and residue, then bagged with its lot number." }
        ])
      },
      industries: {
        title: "Where our kaolin goes.",
        items: [
          { icon: "ceramics", label: "Tiles and sanitaryware" },
          { icon: "paper", label: "Paper and board" },
          { icon: "paint", label: "Paints and coatings" },
          { icon: "rubber", label: "Rubber and plastics" },
          { icon: "fibre", label: "Fibreglass" }
        ]
      },
      faq: {
        title: "Before you order kaolin.",
        items: [
          { q: "Can I test your kaolin before I order?", a: "Yes. We send a free {sample.size} sample of any grade with its test report, usually within {sample.days}." },
          { q: "What whiteness can you hold?", a: S("Ceramic grade is held at 85% whiteness or more, and paper grade between 82 and 88% brightness. Each lot's exact figures are on its report.") },
          { q: "How is it packed?", a: S("In 25 kg or 50 kg bags, or 1 tonne jumbo bags. Every bag carries its lot number.") },
          { q: "What is the minimum order?", a: S("One truck, about 25 tonnes, within India. For export, one 20-foot container.") }
        ]
      },
      contact: {
        title: "Test our kaolin in your own lab.",
        lede: "Tell us your process and the grade you need. We send a free {sample.size} sample with its test report."
      }
    },

    /* ---- 3. Ghanshyam Minerals (where the group began) --------------------- */
    {
      id: "minerals",
      page: "minerals.html",
      name: "Ghanshyam Minerals",
      short: "Minerals",
      logoLabel: "MINERALS",
      since: "{company.founded}",         /* the group began with this company */
      tagline: "Where the group began.",
      summary: S("The group's first company. It mines, sorts and trades feldspar, quartz and ball clay for glass, ceramics and refractories."),
      image: photo("company-minerals", "Clear quartz crystals beside pink feldspar on a pale surface"),
      facts: S([["Minerals", "6"], ["Markets", "{group.states} states"]]),
      keyProducts: S(["Potash and soda feldspar", "Quartz lumps and grits", "Ball clay", "Bentonite, traded"]),
      cta: { label: "Request a quote", submit: "Request my quote" },
      meta: {
        title: "Ghanshyam Minerals | Feldspar, quartz and ball clay from {company.region}",
        description: "Hand-sorted feldspar, quartz and ball clay for glass, tiles, sanitaryware and refractories. The first company of GHANSHYAM GROUP."
      },
      hero: {
        title: "Feldspar, quartz and clay, sorted for your batch.",
        text: "Hand-sorted lumps, sized grits and plastic clays for glass, tiles, sanitaryware and refractories, from the company that started the group."
      },
      overview: {
        title: "{minerals.years} years of knowing the ground.",
        body: S([
          "Ghanshyam Minerals began in {minerals.since} as a small trading business in Bhuj, supplying feldspar and quartz to local potteries. Every other company in the group grew out of it.",
          "Today it mines, sorts and trades six minerals for glass, ceramics and refractories, and knows most of the deposits in Kutch by name."
        ]),
        points: S([
          { icon: "quarry", title: "Mined and sourced", text: "Our own pits, and partners we have tested for years." },
          { icon: "classify", title: "Sorted by hand", text: "Lumps graded by colour before they are crushed and sized." },
          { icon: "lab", title: "Tested before dispatch", text: "Chemistry on every lot, so your batch stays the same." }
        ])
      },
      products: {
        title: "Minerals for glass and ceramics.",
        lede: "Lumps, grits and clays, sized to order. Every lot ships with its own test report.",
        items: S([
          { name: "Potash feldspar", spec: "K₂O 10% min", text: "Lumps and grits for glass batches, glazes and vitrified tile bodies.", image: placeholder("product-minerals-feldspar", "#E7CEC4") },
          { name: "Soda feldspar", spec: "Na₂O 7% min", text: "A low-melting feldspar for sanitaryware, wall tiles and glass.", image: placeholder("product-minerals-soda-feldspar", "#EDE3DA") },
          { name: "Quartz lumps and grits", spec: "SiO₂ 99% min", text: "Hand-sorted lumps and sized grits for glass, ferro alloys and engineered stone.", image: placeholder("product-minerals-quartz", "#E3E8E9") },
          { name: "Ball clay", spec: "High green strength", text: "A plastic, strong-binding clay that holds tile and sanitaryware bodies together before firing.", image: placeholder("product-minerals-ball-clay", "#CDC4B6") }
        ])
      },
      process: {
        title: "From the pit to your batch.",
        steps: S([
          { icon: "quarry", title: "Mine and source", text: "From our own pits, and from deposits we have tested for years." },
          { icon: "classify", title: "Sort by hand", text: "Lumps are graded by colour and purity on the sorting floor." },
          { icon: "mill", title: "Crush and size", text: "Crushers and screens make the grit sizes you order." },
          { icon: "lab", title: "Test and load", text: "Chemistry is checked on every lot before the truck leaves." }
        ])
      },
      industries: {
        title: "Where our minerals go.",
        items: [
          { icon: "glass", label: "Glass" },
          { icon: "ceramics", label: "Tiles and sanitaryware" },
          { icon: "foundry", label: "Refractories" },
          { icon: "construction", label: "Engineered stone" }
        ]
      },
      faq: {
        title: "Before you order minerals.",
        items: [
          { q: "Can you send a sample first?", a: "Yes. We send a free {sample.size} sample of any mineral with its test report, usually within {sample.days}." },
          { q: "What sizes do you supply?", a: S("Lumps, and grits from 10 mm down to 0.5 mm. Tell us your size band and we screen to it.") },
          { q: "How do you keep the chemistry steady?", a: S("We sort every lump by hand, blend from tested stock and check the chemistry of every lot before it is loaded.") },
          { q: "Can you mix minerals in one load?", a: S("Yes. Feldspar, quartz and ball clay can share one truck, each bagged and labelled on its own.") }
        ]
      },
      contact: {
        title: "Get a quote for your next batch.",
        lede: "Tell us the mineral, the size and your monthly volume. We reply with a quote and a recent test report within one working day."
      }
    },

    /* ---- 4. Ghanshyam Processors ------------------------------------------- */
    {
      id: "processors",
      page: "processors.html",
      name: "Ghanshyam Processors",
      short: "Processors",
      logoLabel: "PROCESSORS",
      since: S("2014"),
      tagline: "Ground to the micron.",
      summary: S("Grinding and micronising for silica flour, quartz powder and feldspar powder, with air classifiers that hold a tight particle size."),
      image: photo("company-processors", "Inside a mineral grinding plant: a large ball mill, a cyclone and a hopper of fine powder, with a worker in a hard hat walking the aisle", { focus: "82% 50%" }),
      facts: S([["Mills", "4 ball mills"], ["Capacity", "{capacity.processors} a month"]]),
      keyProducts: S(["Silica flour, 200 to 400 mesh", "Quartz powder", "Feldspar powder", "Custom grinding (job work)"]),
      cta: { label: "Request a sample", submit: "Request my sample" },
      meta: {
        title: "Ghanshyam Processors | Silica flour, quartz and feldspar powder from {company.region}",
        description: "Silica flour, quartz powder and feldspar powder, milled and air classified to your mesh, with a test report on every lot. A GHANSHYAM GROUP company."
      },
      hero: {
        text: "Silica flour, quartz powder and feldspar powder, milled and air classified to the mesh your process needs, lot after lot."
      },
      overview: {
        title: "Our own sand, our own mills.",
        body: S([
          "Ghanshyam Processors started in {processors.since}, when ball mills and air classifiers were added beside our silica plant. It grinds the group's own washed sand and sorted minerals, so the feed is known before it enters the mill.",
          "Paint, ceramic and engineered stone makers buy from us for a tight particle size and a clean, bright powder."
        ]),
        points: S([
          { icon: "mill", title: "Four ball mills", text: "Lined to keep iron out of the powder." },
          { icon: "classify", title: "Air classifiers", text: "Cut to the size band you ask for." },
          { icon: "lab", title: "Size checked", text: "Particle size and whiteness on every lot." }
        ])
      },
      products: {
        title: "Powders for paint, glaze and stone.",
        lede: "Ground from our own washed sand and sorted minerals. Every lot ships with its own test report.",
        items: S([
          { name: "Silica flour", spec: "200 to 400 mesh", text: "Micronised silica for ceramics, paints and fibreglass, held to a tight size curve.", image: photo("grade-flour", "Close view of silica flour: a soft drift of bright white powder") },
          { name: "Quartz powder", spec: "Up to 500 mesh", text: "Bright, fine quartz powder for engineered stone, glazes and welding electrodes.", image: placeholder("product-processors-quartz-powder", "#EFF0EE") },
          { name: "Feldspar powder", spec: "200 to 325 mesh", text: "Ground feldspar for glass batches, glazes and vitrified tiles.", image: placeholder("product-processors-feldspar-powder", "#ECDDD6") },
          { name: "Custom grinding", spec: "To your size band", text: "Send us your mineral and the size you need. We grind it as job work and test every lot.", image: placeholder("product-processors-job-work", "#E6E9E7") }
        ])
      },
      process: {
        title: "From clean feed to fine powder.",
        steps: S([
          { icon: "truck", title: "Clean feed", text: "Washed sand and sorted minerals arrive from our own companies." },
          { icon: "mill", title: "Grind", text: "Ball mills with ceramic linings grind the feed without adding iron." },
          { icon: "classify", title: "Classify", text: "Air classifiers cut the powder to the size band you ordered." },
          { icon: "lab", title: "Test and pack", text: "Particle size and whiteness are checked, then every bag gets its lot number." }
        ])
      },
      industries: {
        title: "Where our powders go.",
        items: [
          { icon: "paint", label: "Paints and coatings" },
          { icon: "ceramics", label: "Glazes and ceramic bodies" },
          { icon: "construction", label: "Engineered stone" },
          { icon: "fibre", label: "Fibreglass" },
          { icon: "rubber", label: "Rubber and plastics" }
        ]
      },
      faq: {
        title: "Before you order powder.",
        items: [
          { q: "Can I test your powder before I order?", a: "Yes. We send a free {sample.size} sample with its test report, usually within {sample.days}." },
          { q: "How fine can you grind?", a: S("Down to 500 mesh, about 25 microns. Each lot's size curve is on its report.") },
          { q: "How do you keep iron out of the powder?", a: S("Our mills have ceramic linings and grinding media, and magnets clean the feed before it goes in.") },
          { q: "Can you grind our own material?", a: S("Yes. Send us your mineral and your size band, and we grind it as job work with a test report on every lot.") }
        ]
      },
      contact: {
        title: "Send us your spec.",
        lede: "Tell us the material, the size band and your volume. We send a sample ground to your spec, with its test report."
      }
    },

    /* ---- 5. Ghanshyam Farm House ------------------------------------------- */
    {
      id: "farm",
      page: "farm-house.html",
      name: "Ghanshyam Farm House",
      short: "Farm House",
      logoLabel: "FARM HOUSE",
      since: S("2019"),
      tagline: "Grain of a different kind.",
      summary: S("It began as a green belt around the quarry. Today it is an 80-acre drip-irrigated farm growing Kutchi dates, pomegranate, groundnut and cumin."),
      image: photo("company-farm", "Rows of young crops on drip irrigation lines at sunset, with round thatched huts and low hills behind", { focus: "40% 50%" }),
      facts: S([["Area", "80 acres"], ["Irrigation", "100% drip"]]),
      keyProducts: S(["Kutchi dates (kharek)", "Pomegranate", "Groundnut", "Cumin"]),
      cta: { label: "Send a trade enquiry", submit: "Send my enquiry" },
      meta: {
        title: "Ghanshyam Farm House | Kutchi dates, pomegranate, groundnut and cumin",
        description: "Fresh produce from an 80-acre drip-irrigated farm in Kutch, picked, graded and packed for the trade. A GHANSHYAM GROUP company."
      },
      hero: {
        text: "Kutchi dates, pomegranate, groundnut and cumin from our own 80-acre drip-irrigated farm, picked, graded and packed for the trade."
      },
      overview: {
        title: "A green belt that became a farm.",
        body: S([
          "Ghanshyam Farm House started as rows of trees planted around our quarry to hold the soil and the dust. In {farm.since} the belt became a working farm.",
          "Today 80 acres run on drip lines and reused water, in one of India's driest districts. We pick, grade and pack on the farm, so produce reaches traders fresh."
        ]),
        points: S([
          { icon: "water", title: "Every row on drip", text: "Water goes to the roots, not into the air." },
          { icon: "leaf", title: "Graded on the farm", text: "Sorted by size and quality before packing." },
          { icon: "truck", title: "Straight to the trade", text: "To markets, mills and exporters, picked days before." }
        ])
      },
      products: {
        title: "What the farm grows.",
        lede: "Picked in season, graded by hand and packed on the farm. The months on each card show the harvest.",
        items: S([
          { name: "Kutchi dates (kharek)", spec: "Yellow and red", season: [6, 7], text: "Fresh kharek from our own palms, picked at the right colour and packed at the farm.", image: placeholder("product-farm-dates", "#B47A3A") },
          { name: "Pomegranate", spec: "Bhagwa variety", season: [12, 1, 2], text: "Deep red, sweet fruit, graded by size and packed for the trade.", image: placeholder("product-farm-pomegranate", "#A9333F") },
          { name: "Groundnut", spec: "Bold kernels", season: [10, 11], text: "Sun-dried groundnut in shell or as kernels, for oil mills and traders.", image: placeholder("product-farm-groundnut", "#C79F70") },
          { name: "Cumin", spec: "Machine cleaned", season: [2, 3], text: "Kutch cumin, cleaned and graded, for spice traders and exporters.", image: placeholder("product-farm-cumin", "#8C7552") }
        ])
      },
      process: {
        title: "How we grow it.",
        steps: S([
          { icon: "leaf", title: "Plant for the climate", text: "Crops chosen for Kutch: dates, pomegranate, groundnut and cumin." },
          { icon: "water", title: "Drip every row", text: "Drip lines and reused water feed each plant at its roots." },
          { icon: "classify", title: "Pick and grade", text: "Picked in season and graded by size on the farm." },
          { icon: "truck", title: "Pack and send", text: "Packed on the farm and sent straight to the buyer." }
        ])
      },
      industries: {
        title: "Who buys from the farm.",
        items: [
          { icon: "store", label: "Wholesale markets" },
          { icon: "ship", label: "Exporters" },
          { icon: "mill", label: "Oil mills" },
          { icon: "leaf", label: "Spice traders" }
        ]
      },
      faq: {
        title: "Before you order produce.",
        items: [
          { q: "When is each crop ready?", a: S("Dates in June and July, pomegranate from December to February, groundnut in October and November, and cumin in February and March. Each product shows its months.") },
          { q: "Do you sell to shops and homes?", a: S("We sell to the trade: markets, mills, retail chains and exporters. For small orders, ask us for a local partner.") },
          { q: "How is the produce packed?", a: S("Dates and pomegranate in ventilated crates, groundnut and cumin in 25 kg or 50 kg bags, all labelled with the harvest date.") },
          { q: "Can we visit the farm?", a: "Yes. Buyers are welcome during the harvest. Send an enquiry and we will set a day." }
        ]
      },
      contact: {
        title: "Order fresh from the farm.",
        lede: "Tell us the produce, the quantity and where it needs to go. We reply with availability and a price within one working day."
      }
    }
  ],


  /* ##########################################################################
     2. THE HOMEPAGE (index.html): GHANSHYAM GROUP, the parent company
     ########################################################################## */

  /* Browser tab title and search description of the homepage. (Also copy any
     change into the <head> of index.html, which search engines and link
     previews read before this file runs. Each business has its own under
     meta in its entry above.) */
  meta: {
    title: "GHANSHYAM GROUP | Silica sand, kaolin, minerals and farm produce from {company.region}",
    description: "A family-run industrial group from Kutch, Gujarat. Five companies: Ghanshyam Silica Sand, Kaolin, Minerals, Processors and Farm House."
  },

  /* The menu at the top of every page. Links starting with # go to the
     homepage's sections, from any page. */
  nav: {
    skipLink: "Skip to content",
    homeLabel: "GHANSHYAM GROUP home",
    links: [
      { label: "About", href: "#about" },
      { label: "Businesses", menu: true },          /* opens the panel with all five companies */
      { label: "Journey", href: "#journey" },
      { label: "Leadership", href: "#leadership" },
      { label: "Responsibility", href: "#csr" }
    ],
    businessesTitle: "Our five businesses",
    businessesAll: { label: "See all five on one page", href: "#businesses" },
    cta: { label: "Send an enquiry", href: "#contact" },   /* on a company's page, its own cta is used */
    menuOpen: "Menu",
    menuClose: "Close"
  },

  /* ==========================================================================
     GROUP HERO: the first screen. Five tall photo panels, one per business.
     ========================================================================== */
  groupHero: {
    kicker: "{company.region} · Since {company.founded}",
    title: "Five companies. One ground.",
    text: "GHANSHYAM GROUP mines, washes, grinds and grows in {company.region}: silica sand, kaolin, minerals, fine powders and farm produce.",
    ctaPrimary: { label: "Explore our businesses", href: "#businesses" },
    ctaSecondary: { label: "Our story", href: "#about" },
    proof: ["{company.years}+ years", "{group.companies} companies", "{group.states} states and {group.countries} countries"],
    layersLabel: "Our five businesses",
    visit: "Visit"
  },

  /* ==========================================================================
     WHO WE ARE
     ========================================================================== */
  about: {
    kicker: "Who we are",
    title: "Started in Bhuj in {company.founded}. Still run by one family.",
    lede: "What began as a small business selling feldspar and quartz to local potteries has grown into five companies. Each one grew out of the one before it.",
    body: [
      "Our materials go into float glass, tiles, paper, paint, engine castings and drinking water filters. Our farm sends fruit, nuts and spice to markets across India.",
      "We run the quarries, the plants, the lab and the trucks ourselves. When one family is answerable for every step, nobody can blame the next link in the chain."
    ],
    quote: S({
      text: "A buyer remembers the one bad truck, not the hundred good ones. So we run every company for the one.",
      name: "R. G. Patel",
      role: "Founder and Chairman"
    }),
    image: photo("about-strata", "A tall quarry wall with a bright band of white silica sand between layers of ochre sandstone, under a blue sky", { w: 896, h: 1200, focus: "50% 45%" })
  },

  /* ==========================================================================
     OUR BUSINESSES: one card per company (the words come from THE FIVE
     BUSINESSES above; these are only the section's own labels)
     ========================================================================== */
  businesses: {
    kicker: "Our businesses",
    title: "One group. Five specialists.",
    lede: "Together they cover the whole life of a mineral, from the quarry face to a fine powder, and the farm keeps the land green around it.",
    flagship: "Flagship",
    productsLabel: "What it makes",
    visit: "Visit {name}",
    enquire: "Enquire"
  },

  /* ==========================================================================
     GROUP STRENGTH: who does what, and the group in numbers
     by: the companies doing that step (their code names)
     ========================================================================== */
  strength: {
    kicker: "Group strength",
    title: "Quarry to customer, under one roof.",
    lede: "We own every step between the ground and your gate, so we answer for every step.",
    chainLabel: "Done by",
    chain: [
      { icon: "quarry", title: "Mine", text: "Our own quarries and deposits.", by: ["silica", "kaolin", "minerals"] },
      { icon: "wash", title: "Wash and size", text: "Washing lines, cyclones and screens.", by: ["silica", "kaolin"] },
      { icon: "mill", title: "Grind", text: "Ball mills and air classifiers.", by: ["processors"] },
      { icon: "lab", title: "Test", text: "Our own lab signs every lot.", by: ["silica", "kaolin", "minerals", "processors"] },
      { icon: "truck", title: "Deliver", text: "Our trucks, and two ports nearby.", by: ["silica", "kaolin", "minerals", "processors"] },
      { icon: "leaf", title: "Grow", text: "Land and water given back as a farm.", by: ["farm"] }
    ],
    statsLabel: "The group in numbers",
    stats: S([
      { value: "55000", suffix: " t", label: "of material processed every month" },
      { value: "{group.people}", suffix: "+", label: "people at work across the group" },
      { value: "{group.buyers}", suffix: "+", label: "buyers in India and abroad" },
      { value: "220", suffix: " acres", label: "of quarry leases in Kutch" },
      { value: "120", suffix: "", label: "trucks loaded on a busy day" },
      { value: "4", suffix: "", label: "plants, and one farm" }
    ])
  },

  /* ==========================================================================
     VISION, MISSION AND VALUES (samples: use the group's own words)
     ========================================================================== */
  values: {
    kicker: "What we stand for",
    vision: { label: "Our vision", text: S("To be the most trusted name in Indian minerals, known for consistency first and size second.") },
    mission: { label: "Our mission", text: S("Give every buyer material that matches the spec they approved, load after load, and leave the land around our quarries better than we found it.") },
    valuesTitle: "Our values",
    items: S([
      { icon: "seal", title: "Consistency first", text: "The same material, every load. Every company keeps that promise." },
      { icon: "quarry", title: "One owner, every step", text: "From the quarry to the truck, nothing is handed to a stranger." },
      { icon: "report", title: "Straight answers", text: "If we cannot hold a spec, we say so before you order." },
      { icon: "leaf", title: "Care for the land", text: "Water reused, trees planted, and a green belt grown into a farm." }
    ])
  },

  /* ==========================================================================
     OUR JOURNEY: the growth timeline. As the visitor scrolls, a stream of
     sand runs down one line and lights each year as it reaches it.
     company: one of silica, kaolin, minerals, processors, farm
     media (optional): photo(...) or footage(...) beside that year.
     theme (for years without media): a short headline facing the card.
     ========================================================================== */
  journey: {
    kicker: "Our journey",
    title: "Grown grain by grain.",
    lede: "Three decades, one step at a time. Scroll, and follow the sand.",
    newCompany: "New company",                  /* the tag on the year a company began */
    visit: "Visit {name}",
    growthCount: "{count} of {total} companies",
    milestones: S([
      { year: "{company.founded}", company: "minerals", title: "Where the group began", text: "A small trading business in Bhuj, supplying feldspar and quartz to local potteries.", media: footage("crystals", "Clear quartz grains turning slowly in the light") },
      { year: "{silica.since}", company: "silica", title: "The first silica quarry", text: "The quarry on the Bhuj-Mundra road opens, with one washing line.", media: footage("quarry", "An excavator working the terraces of an open sand quarry at golden hour") },
      { year: "{kaolin.since}", company: "kaolin", title: "A third company, with its own refinery", text: "A kaolin deposit beside the silica quarry opens, with a plant to wash and refine the clay.", media: photo("company-kaolin", "A lump of raw white kaolin clay on a pale grey surface") },
      { year: "2012", company: "silica", theme: "Our first big buyer", title: "First float glass contract", text: "A float glass maker approves our glass grade. It still buys from us today." },
      { year: "{processors.since}", company: "processors", title: "Grinding to the micron", text: "Ball mills and air classifiers start making silica flour and quartz powder.", media: footage("conveyor", "Sand running along a conveyor from a vibrating screen in the plant") },
      { year: "2016", company: "minerals", theme: "New markets", title: "Beyond Gujarat", text: "Feldspar and ball clay reach tile and sanitaryware makers in Rajasthan and Uttar Pradesh." },
      { year: "2017", company: "silica", theme: "Proof in every lot", title: "Our own lab, and {quality.certification}", text: "An on-site lab starts testing every lot, and the quality system is certified." },
      { year: "{farm.since}", company: "farm", title: "The green belt becomes a farm", text: "The trees planted around the quarry grow into a working, drip-irrigated farm.", media: photo("company-farm", "Rows of young crops on drip irrigation lines at sunset", { focus: "40% 50%" }) },
      { year: "2021", company: "silica", title: "A second washing line", text: "Capacity doubles to {capacity.silica} of washed sand a month, with a new rotary dryer.", media: footage("washing", "Sand and water pouring through a washing line, sprays above") },
      { year: "2023", company: "silica", theme: "Across the sea", title: "First export container", text: "Glass grade ships from Mundra port to buyers in the Gulf and East Africa." },
      { year: "2025", company: "silica", theme: "Purer than ever", title: "Low-iron solar grade", text: "Extra magnetic separation brings iron down far enough for solar glass makers." }
    ]),
    /* The end of the line: the group as it stands today */
    today: {
      label: "Today",
      title: "Five companies. One family.",
      text: "{company.years} years on, the group mines, washes, grinds and grows across Kutch, and supplies {group.states} states and {group.countries} countries.",
      media: footage("pour", "Clean silica sand pouring in a steady stream")
    },
    /* Achievements, under the timeline (samples: use real certificates and awards) */
    achievements: {
      title: "Achievements",
      items: S([
        { year: "2017", icon: "badge", title: "{quality.certification} certified", text: "Our quality system passed its first outside audit, and every yearly audit since." },
        { year: "2020", icon: "report", title: "One million tonnes shipped", text: "The millionth tonne of washed silica sand left the plant." },
        { year: "2021", icon: "seal", title: "Supplier excellence award", text: "From a float glass maker, for unbroken supply through the pandemic years." },
        { year: "2024", icon: "lab", title: "A year with no rejected loads", text: "Not one load sent back by a buyer, across every company in the group." }
      ])
    }
  },

  /* ==========================================================================
     LEADERSHIP (sample names and roles: replace with the real team)
     A portrait is optional. Add  image: photo("leader-file-name", "Portrait of ...", { w: 900, h: 1125 })
     and until then the card shows the person's initials.
     ========================================================================== */
  leadership: {
    kicker: "Leadership",
    title: "One family, answerable for every load.",
    lede: "The people who run the quarries, the plants, the lab and the farm, and who pick up the phone when a buyer calls.",
    people: [
      S({ name: "R. G. Patel", role: "Founder and Chairman", text: "Started the group in {company.founded} and still walks the plants most mornings." }),
      S({ name: "M. R. Patel", role: "Managing Director", text: "Runs sales and dispatch for all five companies, and knows most of our buyers by name." }),
      S({ name: "K. R. Patel", role: "Director, Operations", text: "Leads mining, washing and grinding across the group." }),
      S({ name: "Dr. N. Shah", role: "Head of Quality", text: "Runs the lab that signs every lot report before a truck leaves." })
    ]
  },

  /* ==========================================================================
     WHERE WE WORK: the group's sites in Kutch, and where its materials go
     sites: x and y are % positions on the map picture. company: a business's
     code name, or "group" (head office) or "port".
     ========================================================================== */
  presence: {
    kicker: "Where we work",
    title: "Rooted in Kutch. Supplying far beyond it.",
    lede: "All five companies work in one district, a short run from two of India's busiest ports.",
    map: S({ src: "assets/img/placeholders/map-group.svg", alt: "Schematic map of Kutch showing the group's head office in Bhuj, its plants, quarry and farm, and the ports of Mundra and Kandla" }),
    sites: S([
      { x: 45, y: 28.3, label: "Head office", place: "Bhuj", company: "group" },
      { x: 36.3, y: 37.5, label: "Sorting yard", place: "Ghanshyam Minerals", company: "minerals" },
      { x: 56.5, y: 39.7, label: "Quarry and plant", place: "Ghanshyam Silica Sand", company: "silica" },
      { x: 67.5, y: 33.3, label: "Deposit and refinery", place: "Ghanshyam Kaolin", company: "kaolin" },
      { x: 52.5, y: 50, label: "Grinding mills", place: "Ghanshyam Processors", company: "processors" },
      { x: 65, y: 50, label: "The farm", place: "Ghanshyam Farm House", company: "farm" },
      { x: 56.5, y: 78.3, label: "Mundra port", place: "60 km from the plant", company: "port" },
      { x: 87.5, y: 62, label: "Kandla port", place: "90 km from the plant", company: "port" }
    ]),
    indiaTitle: "Across India",
    states: S(["Gujarat", "Rajasthan", "Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "Haryana", "Punjab", "Karnataka", "Tamil Nadu"]),
    exportTitle: "Export",
    countries: S(["United Arab Emirates", "Saudi Arabia", "Oman", "Qatar", "Kenya", "Tanzania"]),
    exportNote: "Export loads ship FOB Mundra and Kandla.",
    industriesTitle: "Industries we supply",
    industries: [
      { icon: "glass", label: "Glass" },
      { icon: "ceramics", label: "Tiles and sanitaryware" },
      { icon: "paint", label: "Paints" },
      { icon: "paper", label: "Paper" },
      { icon: "foundry", label: "Foundries" },
      { icon: "construction", label: "Building materials" },
      { icon: "water", label: "Water treatment" },
      { icon: "leaf", label: "Food and agriculture" }
    ]
  },

  /* ==========================================================================
     TESTIMONIALS (sample quotes: replace with real, approved quotes or remove
     before launch. Never publish sample quotes as if they were real.)
     company: which business the quote is about. The homepage shows them all;
     a company's page shows only its own.
     ========================================================================== */
  testimonials: {
    kicker: "What buyers say",
    title: "Judged one load at a time.",
    prevLabel: "Previous quote",
    nextLabel: "Next quote",
    items: S([
      { quote: "Every truck matches the sample we approved. Two years in, we have not had to change our batch once.", role: "Head of Purchase", org: "Container glass plant, Gujarat", company: "silica" },
      { quote: "The whiteness on our tiles has not moved in three years of kaolin from Ghanshyam.", role: "Production Manager", org: "Vitrified tile maker, Morbi", company: "kaolin" },
      { quote: "The certificate comes with the lorry, and our own lab agrees with it. That is rarer than it should be.", role: "QC Manager", org: "Grey iron foundry, Rajkot", company: "silica" },
      { quote: "Their quartz powder holds the same size curve every lot, so our paint line never has to adjust.", role: "R&D Head", org: "Paint manufacturer, Vapi", company: "processors" },
      { quote: "In the monsoon, when other suppliers missed dispatches, Ghanshyam kept our line running.", role: "Plant Head", org: "Tile manufacturer, Morbi", company: "silica" }
    ]),
    /* Clients under the quotes. SAMPLE: each slot only names a kind of buyer.
       Replace with real clients' logos, with their permission:
         { name: "Company name", logo: "assets/img/clients/file-name.svg" }
       Never show a company's logo without its permission. */
    clients: {
      title: "Supplying makers of glass, tiles, paper, paint and castings",
      items: S([
        { name: "Float glass", place: "Gujarat" },
        { name: "Container glass", place: "Uttar Pradesh" },
        { name: "Solar glass", place: "Gujarat" },
        { name: "Grey iron foundry", place: "Rajkot" },
        { name: "Tiles", place: "Morbi" },
        { name: "Sanitaryware", place: "Thangadh" },
        { name: "Paints", place: "Mumbai" },
        { name: "Paper mills", place: "Vapi" }
      ])
    }
  },

  /* ==========================================================================
     RESPONSIBILITY (CSR): what the group puts back. All figures are samples.
     value and unit make the big number on each card.
     ========================================================================== */
  csr: {
    kicker: "Corporate responsibility",
    title: "We take from the land. We put back.",
    lede: "Mining changes the ground it works. So we look after the land, the water and the villages around our quarries.",
    items: [
      S({ icon: "leaf", value: "40,000+", unit: "trees planted since 2012", title: "A green belt that became a farm", text: "Native trees around the quarry hold the soil and the dust. The belt grew into Ghanshyam Farm House." }),
      S({ icon: "water", value: "80%", unit: "of wash water reused", title: "Water used twice", text: "Settling ponds send our washing water back to the lines, in one of India's driest districts." }),
      S({ icon: "book", value: "6", unit: "village schools supported", title: "Schools near the quarry", text: "Books, uniforms and scholarships for children in the villages around our sites." }),
      S({ icon: "heart", value: "2", unit: "health camps a year", title: "Health and food", text: "Free check-ups for workers and neighbours, and food support in drought years." })
    ]
  },


  /* ##########################################################################
     3. THE SILICA SAND PAGE (silica-sand.html)
     Its overview, industries and form words are in its entry under THE FIVE
     BUSINESSES. These are its larger sections.
     ########################################################################## */

  /* ==========================================================================
     SAND POUR: the scroll journey at the top of the silica page
     ========================================================================== */
  hero: {
    /* The scroll video. Leave src empty to use the built-in animated sand pour.
       When the generated hero video is ready, put it in assets/video/ and set:
       src: "assets/video/hero-scrub.mp4", bytes: <file size in bytes>,
       poster: "assets/video/hero-poster.jpg", ending: "assets/video/hero-ending.jpg" */
    video: { src: "", bytes: 0, poster: "", ending: "" },

    /* Exactly four bands: the scroll timing is tuned for four. */
    bands: [
      {
        kicker: "{silica.name} · {company.region}",
        title: "Precision, grain by grain.",
        text: "Silica sand for glass, foundry and construction, washed and tested since {silica.since}."
      },
      {
        title: "Every grain is washed, sized and dried.",
        text: "Clay out. Iron out. Moisture under {quality.moisture}."
      },
      {
        title: "Every lot is tested before it leaves.",
        text: "A test report travels with every truck."
      },
      {
        title: "The same sand, every load.",
        text: "Approve a sample once. Get that exact spec, truck after truck."
      }
    ],
    ctaPrimary: { label: "Request a sample", href: "#contact" },
    ctaSecondary: { label: "Explore the grades", href: "#silica" },

    /* Shown on phones and when "reduce motion" is on */
    static: {
      kicker: "{silica.name} · {company.region}",
      title: "Precision, grain by grain.",
      text: "Silica sand washed, sized and tested in {company.region} since {silica.since}. The same sand, every load."
    },

    /* The small lot readout that counts up while the sand pours */
    hud: {
      lot: S("Lot GS-G99 / 2611-04"),
      truckTonnes: 25,
      poured: "poured",
      ofTruck: "of one {truck} t truck",
      done: "Lot ready. Report attached."
    },
    scrollCue: "Scroll",
    loadingLabel: "Loading the sand pour"
  },

  /* ==========================================================================
     SILICA GRADES: the five-grade showcase
     ========================================================================== */
  silica: {
    kicker: "Our grades",
    title: "Five grades. One standard.",
    lede: "Each grade is washed, classified, dried and tested to a written spec. Pick the grade for your process and we hold it there, load after load.",
    pickerLabel: "Choose a grade",
    labels: {
      chemistry: "Chemistry",
      physical: "Physical",
      packing: "Packing",
      uses: "Used for",
      size: "Grain size",
      sizeScale: "Where this grade sits on the sieve scale",
      typical: "Typical values. Every lot ships with its own test report.",
      cta: "Request this grade",
      sheet: "Ask for the full spec sheet"
    },
    grades: [
      S({
        id: "glass",
        code: "GS-G99",
        name: "Glass grade",
        short: "Low-iron sand for float, container and solar glass.",
        sizeMin: 0.1, sizeMax: 0.6,      /* millimetres, drives the sieve scale */
        grain: 0.32,                      /* relative grain size for the picture */
        image: photo("grade-glass", "Close view of glass grade silica sand: clear, angular quartz grains"),
        chemistry: [["SiO₂", "99.2% min"], ["Fe₂O₃", "0.035% max"], ["Al₂O₃", "0.30% max"], ["TiO₂", "0.03% max"], ["CaO + MgO", "0.10% max"], ["LOI", "0.20% max"]],
        physical: [["Size", "0.10 to 0.60 mm"], ["Mesh", "30 to 150"], ["Moisture", "0.5% max, dried"], ["Shape", "Sub-angular"]],
        packing: ["1 t jumbo bags", "Loose, in covered tippers", "20 ft containers for export"],
        uses: ["Float glass", "Container glass", "Solar glass (low-iron)", "Glass wool"]
      }),
      S({
        id: "foundry",
        code: "GS-F55",
        name: "Foundry grade",
        short: "Clean, sized sand for green sand, resin and core work.",
        sizeMin: 0.106, sizeMax: 0.85,
        grain: 0.46,
        image: photo("grade-foundry", "Close view of foundry grade silica sand: rounded grains with a warm, golden tone"),
        chemistry: [["SiO₂", "98.5% min"], ["Clay", "0.5% max"], ["Fe₂O₃", "0.10% max"], ["pH", "6.5 to 7.5"], ["Acid demand", "5 ml max"]],
        physical: [["AFS GFN", "45 to 65"], ["Size", "0.10 to 0.85 mm"], ["Moisture", "0.3% max"], ["Shape", "Sub-rounded"]],
        packing: ["50 kg bags", "1 t jumbo bags", "Loose, in covered tippers"],
        uses: ["Green sand moulding", "Resin coated sand", "Core making", "Shell moulding"]
      }),
      S({
        id: "filter",
        code: "GS-W50",
        name: "Filter grade",
        short: "Uniform grain for water treatment and pool filters.",
        sizeMin: 0.45, sizeMax: 1.2,
        grain: 0.62,
        image: photo("grade-filter", "Close view of filter grade silica sand: uniform, rounded white grains"),
        chemistry: [["SiO₂", "98% min"], ["Acid solubility", "2% max"], ["Fe₂O₃", "0.08% max"]],
        physical: [["Effective size", "0.45 to 0.55 mm"], ["Uniformity coefficient", "1.5 max"], ["Specific gravity", "2.65"], ["Hardness", "7 Mohs"]],
        packing: ["25 kg bags", "50 kg bags", "1 t jumbo bags"],
        uses: ["Municipal water treatment", "RO pre-filters", "Swimming pools", "Industrial effluent"]
      }),
      S({
        id: "build",
        code: "GS-B12",
        name: "Build grade",
        short: "Dry, graded sand for mortar, adhesive and plaster mixes.",
        sizeMin: 0.1, sizeMax: 1.2,
        grain: 0.52,
        image: photo("grade-build", "Close view of build grade silica sand: mixed grains in grey, white and tan"),
        chemistry: [["SiO₂", "97% min"], ["Clay", "1% max"], ["Chlorides", "0.01% max"]],
        physical: [["Size", "0.1 to 1.2 mm, custom bands"], ["Moisture", "0.5% max"], ["Bulk density", "1.5 t per m³"]],
        packing: ["50 kg bags", "1 t jumbo bags", "Loose, in covered tippers"],
        uses: ["Dry mix mortar", "Tile adhesive", "Grout", "Gypsum plaster"]
      }),
      S({
        id: "flour",
        code: "GS-SF3",
        name: "Silica flour",
        short: "Finely ground silica for ceramics, paints and fibreglass.",
        sizeMin: 0.005, sizeMax: 0.075,
        grain: 0.12,
        image: photo("grade-flour", "Close view of silica flour: a soft drift of bright white powder"),
        chemistry: [["SiO₂", "99% min"], ["Fe₂O₃", "0.05% max"], ["Whiteness", "90% min"]],
        physical: [["Fineness", "200, 300 or 400 mesh"], ["D50", "15 to 45 µm"], ["Moisture", "0.5% max"]],
        packing: ["25 kg bags", "50 kg bags", "1 t jumbo bags"],
        uses: ["Ceramic glazes and bodies", "Paints and coatings", "Fibreglass", "Rubber and plastics"]
      })
    ]
  },

  /* ==========================================================================
     MANUFACTURING PROCESS (silica page). media: the clip or photo shown
     beside the list while that step is the one being read.
     ========================================================================== */
  process: {
    kicker: "How we make it",
    title: "Seven steps between the quarry face and your silo.",
    lede: "Consistent sand is not luck. It comes from doing the same seven things, the same way, every day.",
    stepLabel: "Step",
    steps: [
      { icon: "quarry", title: "Choose the face", text: "We sample the quarry face before we cut it. Sand that will not make grade stays in the ground.", media: footage("quarry", "An excavator working the terraces of the sand quarry") },
      { icon: "wash", title: "Wash", text: "Water and attrition scrubbers strip the clay coating from every grain.", media: footage("washing", "Sand and water pouring through the washing line") },
      { icon: "classify", title: "Classify", text: "Hydrocyclones and screens sort the grain by size into the band you ordered.", media: footage("conveyor", "Sized sand running along a conveyor from a vibrating screen") },
      { icon: "dry", title: "Dry", text: "A rotary dryer brings moisture under {quality.moisture}, so the sand flows freely and weighs true.", media: footage("pour", "Dry sand flowing freely in a steady stream") },
      { icon: "magnet", title: "Pull the iron", text: "Rare-earth magnets lift out iron-bearing grains, the main cause of tint in glass.", media: footage("crystals", "Clean, clear quartz grains turning in the light") },
      { icon: "lab", title: "Test", text: "Every lot gets a sieve analysis, chemistry and a moisture check in our own lab.", media: photo("grade-glass", "Close view of glass grade silica sand: clear, angular quartz grains") },
      { icon: "truck", title: "Pack and dispatch", text: "Bagged or loose, every load leaves with its lot number and its test report.", media: photo("company-silica", "A cone of finished white silica sand on a pale stone block") }
    ]
  },

  /* ==========================================================================
     QUALITY ASSURANCE (silica page, with the hold-to-sieve moment)
     ========================================================================== */
  quality: {
    kicker: "Quality assurance",
    title: "We test it, so you never have to guess.",
    lede: "Our lab checks every lot before dispatch. The numbers travel with the truck, and we keep a sealed sample of every lot for {quality.retention}.",
    pillars: [
      { icon: "lab", title: "Our own lab, on site", text: "Sieve shakers, a moisture analyser and wet chemistry, run by trained staff on every shift." },
      { icon: "report", title: "A report with every load", text: "Each truck carries a certificate of analysis for its own lot. Never a generic sheet." },
      { icon: "seal", title: "Sealed retained samples", text: "Kept for {quality.retention}, so any question is checked against the real sand." },
      { icon: "badge", title: "{quality.certification} certified", text: "Our quality system is audited every year by an outside body." }
    ],
    sieve: {
      title: "Run a sieve test",
      intro: "This is how every lot is checked. Press and hold to shake the sieves.",
      holdLabel: "Press and hold to sieve",
      holdingLabel: "Sieving",
      keyboardHint: "Keyboard: hold Space or Enter.",
      layers: {
        coarse: "Coarse, above 30 mesh",
        spec: "In spec, 30 to 100 mesh",
        fines: "Fines, below 100 mesh"
      },
      results: S({ coarse: 1.6, spec: 97.1, fines: 1.3 }),   /* percentages for the demo result */
      doneTitle: "Lot passes.",
      doneText: "A real lot report reads like this, and it travels with your truck.",
      reset: "Run it again"
    }
  },

  /* ==========================================================================
     WHY BUYERS CHOOSE US (silica page). Each reason links to its proof.
     ========================================================================== */
  why: {
    kicker: "Why buyers choose us",
    title: "No surprises at your gate.",
    lede: "Since {silica.since}, glass, foundry and ceramics makers have taught us what a buyer needs most: the same material, every load, on time.",
    items: [
      { icon: "quarry", title: "One owner, quarry to truck", text: "We run the quarry, the washing plant, the lab and the trucks ourselves, so nothing slips between handovers.", link: { label: "How we make it", href: "#process" } },
      { icon: "lab", title: "Tested before it moves", text: "Every lot is sieved and checked in our own lab, and its report travels with the truck.", link: { label: "How we test", href: "#quality" } },
      { icon: "classify", title: "Made to your spec", text: "We wash, size and blend to the band your process needs, then hold it there.", link: { label: "See the grades", href: "#silica" } },
      { icon: "truck", title: "Close to the ports", text: S("Mundra port is 60 km from the plant, so export and coastal loads leave on time."), link: { label: "See the plant", href: "#infrastructure" } }
    ]
  },

  /* ==========================================================================
     INFRASTRUCTURE (silica page; the plant map: x and y are % positions)
     ========================================================================== */
  infrastructure: {
    kicker: "Infrastructure",
    title: "Built to keep the trucks moving.",
    lede: "Quarry, plant, lab and storage sit on one site, a short run from two ports. That is how supply stays steady through the monsoon.",
    mapHint: "Select a point on the plan to learn more.",
    image: S({ src: "assets/img/placeholders/plant-map.svg", alt: "Illustrated plan of the Ghanshyam plant: quarry, washing lines, dryer, magnetic separation, lab, covered storage and dispatch yard" }),
    hotspots: S([
      { x: 15, y: 30, title: "Quarry", text: "A 140-acre lease with tested reserves for more than 25 years." },
      { x: 36, y: 50, title: "Washing lines", text: "Two lines with attrition scrubbers and hydrocyclones." },
      { x: 53, y: 30, title: "Rotary dryer", text: "Brings moisture under {quality.moisture} at 25 tonnes an hour." },
      { x: 59, y: 62, title: "Magnetic separation", text: "Rare-earth roll separators for the low-iron grades." },
      { x: 74, y: 24, title: "Lab", text: "Tests every lot before it is cleared for dispatch." },
      { x: 79, y: 56, title: "Covered storage", text: "20,000 tonnes under roof, so monsoon stock stays dry." },
      { x: 90, y: 82, title: "Dispatch yard", text: "Two weighbridges and loading bays for 120 trucks a day." }
    ]),
    stats: S([
      { value: "140", unit: "acres", label: "quarry lease" },
      { value: "2", unit: "lines", label: "washing and classification" },
      { value: "20,000", unit: "t", label: "covered storage" },
      { value: "60", unit: "km", label: "to Mundra port" }
    ])
  },

  /* ==========================================================================
     FAQ (silica page: the questions buyers ask before ordering sand.
     Every other company has its own faq in its entry.)
     ========================================================================== */
  faq: {
    kicker: "Questions buyers ask",
    title: "Before you order.",
    lede: "Still unsure? Call us, or send a sample request and ask there.",
    items: [
      { q: "Can I test your sand before I order?", a: "Yes. We send a free {sample.size} sample of any grade with its test report, usually within {sample.days}." },
      { q: "How do you keep every load the same?", a: "We cut only from tested quarry faces, run the same wash, size and dry settings, and test every lot before it leaves. If a lot misses spec, it does not ship." },
      { q: "What is the iron content of your glass grade?", a: S("Fe₂O₃ is held at 0.035% or lower in our glass grade, and at 0.015% or lower in the low-iron solar grade. Each lot's exact figure is on its report.") },
      { q: "What is the minimum order?", a: S("One truck, about 25 tonnes, within India. For export, one 20-foot container.") },
      { q: "How is the sand packed?", a: "In 25 kg or 50 kg bags, 1 tonne jumbo bags, or loose in covered tippers. Every bag carries its lot number." },
      { q: "How fast can you deliver?", a: S("Within Gujarat in 24 to 48 hours. Other states in 3 to 6 days. Export ships FOB Mundra or Kandla.") },
      { q: "Can you make a custom grade?", a: "Often, yes. Tell us the size band and chemistry you need, and our lab will tell you honestly whether the quarry can hold it." },
      { q: "How is the price worked out?", a: "By grade, packing and freight. Send your monthly volume and delivery point, and we quote ex-works and delivered within one working day." }
    ]
  },


  /* ##########################################################################
     4. SHARED: the enquiry form, page words, footer and privacy
     ########################################################################## */

  /* ==========================================================================
     CONTACT: the enquiry form at the end of every page. On the homepage it
     uses the words below; on a company's page, the title and intro come from
     that company's contact entry and the button from its cta.
     ========================================================================== */
  contact: {
    kicker: "Contact us",
    title: "Talk to the right team.",
    lede: "Tell us which business and what you need. The right team replies within one working day.",
    form: {
      /* WHERE SUBMISSIONS GO
         endpoint: "" means demo mode: the form checks the fields and shows its
         thank-you message, but nothing is sent anywhere.
         Before launch, create a free form service account (for example
         Formspree) and paste its address here, e.g. "https://formspree.io/f/abcdwxyz".
         Submissions then arrive in the sales inbox, with the company's name. */
      endpoint: "",
      fields: {
        name: { label: "Your name", placeholder: "Full name", autocomplete: "name" },
        company: { label: "Company", placeholder: "Company name", autocomplete: "organization" },
        email: { label: "Work email", placeholder: "name@company.com", autocomplete: "email" },
        phone: { label: "Phone", placeholder: "+91 98765 43210", autocomplete: "tel", optional: "optional" },
        interest: {
          label: "What do you need?",
          placeholder: "Choose a product",          /* the products come from THE FIVE BUSINESSES */
          choose: "Help me choose",
          unsure: "Not sure which company, please advise",
          other: "Something else: partnerships, careers or press"
        },
        volume: { label: "Monthly volume", placeholder: "For example, 200 tonnes", optional: "optional" },
        message: { label: "Anything we should know?", placeholder: "Your process, size band, delivery point", optional: "optional" }
      },
      submit: "Send my enquiry",
      sending: "Sending",
      privacy: "We use your details only to answer this request.",
      errors: {
        required: "Please fill this in.",
        email: "Please enter a valid email address, like name@company.com.",
        phone: "Please enter a valid phone number, with country code if outside India.",
        summary: "Please check the highlighted fields.",
        network: "That did not go through. Please try again, or call us on {contact.phone}."
      },
      success: {
        title: "Request received.",
        text: "Thank you, {name}. Our team will reply within one working day.",
        demo: "Demo mode: this form is not connected yet, so nothing was sent.",
        again: "Send another request"
      }
    },
    channelsTitle: "Or reach us directly",
    channels: {
      phone: "Call us",
      whatsapp: "WhatsApp",
      email: "Email",
      hours: "Hours"
    },
    officesTitle: "Where we are",
    offices: [
      { title: "Head office", fact: "contact.headOffice" },   /* address lines come from FACTS */
      { title: "Plants and quarry", fact: "contact.plant" }
    ],
    mapLink: "Open in Google Maps"
  },

  /* ==========================================================================
     COMPANY PAGE WORDS: labels shared by the five companies' pages
     ========================================================================== */
  division: {
    home: "Ghanshyam Group",
    businesses: "Businesses",
    breadcrumb: "You are here",
    productsCta: "See the products",
    since: "Since",
    partOf: "A GHANSHYAM GROUP company",
    /* the links in each company page's own bar, under its first screen */
    local: { overview: "Overview", grades: "Grades", products: "Products", process: "Process", quality: "Quality", why: "Why us", plant: "Plant", industries: "Industries", faq: "FAQ" },
    localLabel: "On this page",
    overviewKicker: "About the company",
    productsKicker: "Products",
    processKicker: "How it's made",
    industriesKicker: "Industries we supply",
    faqKicker: "Questions buyers ask",
    faqLede: "Still unsure? Call us, or send an enquiry and ask there.",
    enquire: "Enquire",
    season: "Harvest months",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    others: {
      kicker: "GHANSHYAM GROUP",
      title: "More from the group.",
      lede: "Four more companies. One family, one standard.",
      visit: "Visit",
      back: "Back to Ghanshyam Group"
    }
  },

  /* ==========================================================================
     SMALL INTERFACE WORDS used inside buttons, labels and readouts
     ========================================================================== */
  ui: {
    of: "of",                                    /* "2 of 3" on slide and step labels */
    to: "to",                                    /* "0.10 mm to 0.60 mm" */
    sieveFine: "Fine",
    sieveMesh: "Mesh",
    sieveCoarse: "Coarse",
    opensInNewTab: "(opens in a new tab)",
    specSheetMessage: "Please send the full spec sheet for {grade}.",
    productMessage: "Please send price and availability for {product}."
  },

  /* ==========================================================================
     FOOTER and legal (links starting with # go to the homepage's sections)
     ========================================================================== */
  footer: {
    statement: "Precision, grain by grain.",
    companiesTitle: "Our companies",
    exploreTitle: "The group",
    contactTitle: "Contact",
    explore: [
      { label: "About the group", href: "#about" },
      { label: "Our businesses", href: "#businesses" },
      { label: "Group strength", href: "#strength" },
      { label: "Our journey", href: "#journey" },
      { label: "Leadership", href: "#leadership" },
      { label: "Responsibility", href: "#csr" },
      { label: "Contact us", href: "#contact" }
    ],
    copyright: "© {year} {company.legalName} · All rights reserved.",
    registration: "GSTIN {company.gstin}",
    privacyLabel: "Privacy",
    brandLabel: "Brand guidelines",
    backToTop: "Back to top"
  },

  privacy: {
    title: "Privacy",
    closeLabel: "Close",
    paragraphs: S([
      "This website does not use tracking cookies or advertising scripts.",
      "When you send an enquiry, we receive the details you type into the form: your name, company, email, phone and message. We use them only to reply to you and to send your sample or quote.",
      "We do not sell or share your details. We keep enquiries for up to two years, then delete them. To see or delete what we hold about you, email {contact.email}.",
      "This notice is sample text. Please have it reviewed before the site goes live."
    ])
  }
};
