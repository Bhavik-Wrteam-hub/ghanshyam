/* ============================================================================
   GHANSHYAM GROUP: SITE CONTENT  (the only file you need to edit for words)
   ============================================================================

   Every word, number, contact detail, image and link on the website comes
   from this file. The page templates hold no text of their own.

   HOW SAMPLE DATA IS MARKED
   -------------------------
   Anything wrapped in S( ... ) is TEMPORARY SAMPLE DATA. It was written so the
   site reads as finished during review. Replace each one with real company
   information before launch:

       founded: S("1996"),        <- sample (shown with a dashed outline in review mode)
       founded: "1998",           <- real   (S( ) wrapper removed)

   - Search this file for  S(  to find every sample value.
   - Open the site with  ?review  at the end of the address
     (for example  index.html?review ) to see every sample value outlined in
     orange on the page itself.
   - Facts used inside sentences are written as {tokens}, for example
     "since {company.founded}". Change the fact once under FACTS and every
     sentence that uses it updates.
   - Keep the quotes, commas and brackets exactly as they are. Only change the
     text between the quotes.

   PHOTOS
   ------
   Photos are written as  photo("name", "What the photo shows").
   The files live in assets/img/photos in three widths, made from the
   originals in the generated-images folder by tools/photos.sh. To change a
   photo, replace its original with a new image of the same name and run
   that script. The second part is the description read aloud to blind
   visitors and shown if the photo cannot load: say plainly what is in it.
   A product with no photo yet uses placeholder("name", "#tone") instead:
   see OUR PRODUCTS.

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

/** A drawn stand-in for a product photo that does not exist yet. It always
    counts as sample content. name is the photo's future file name, tone the
    colour of the material. When the photo is ready, replace
    placeholder("name", "#tone") with photo("name", "What the photo shows"). */
function placeholder(name, tone) { return S({ placeholder: name, tone: tone }); }

window.SITE_CONTENT = {

  /* ==========================================================================
     FACTS: core company details, reused across the whole site via {tokens}
     ========================================================================== */
  facts: {
    company: {
      groupName: "GHANSHYAM GROUP",
      shortName: "Ghanshyam",
      logoLabel: "GROUP",                 /* the label under the logo for the group itself */
      legalName: S("Ghanshyam Silica Sand Pvt. Ltd."),
      founded: S("1996"),                 /* year the group began; {company.years} is worked out from this */
      region: S("Kutch, Gujarat"),
      country: "India",
      gstin: S("24AAACG0000A1Z5"),
      website: S("www.ghanshyamgroup.example")
    },
    contact: {
      phone: S("+91 98250 00000"),
      whatsapp: S("+91 98250 00000"),
      email: S("sales@ghanshyamgroup.example"),
      hours: S("Monday to Saturday, 9:00 to 18:30 IST"),
      headOffice: S(["Ghanshyam House, Station Road", "Bhuj, Kutch, Gujarat 370001", "India"]),
      plant: S(["Survey No. 214, Bhuj-Mundra Road", "Kukma, Kutch, Gujarat 370105", "India"]),
      mapQuery: S("Bhuj, Kutch, Gujarat, India")
    },
    quality: {
      moisture: S("0.5%"),
      retention: S("six months"),
      certification: S("ISO 9001:2015")
    },
    sample: {
      size: S("2 kg"),
      days: S("three working days")
    },
    capacity: {
      monthly: S("36,000 tonnes")
    }
  },

  /* ==========================================================================
     META: browser tab title and search description
     (Also copy any change into the <head> of index.html, which search
     engines and link previews read before this script runs.)
     ========================================================================== */
  meta: {
    title: "GHANSHYAM GROUP | Silica sand, kaolin and minerals from {company.region}",
    description: "Washed, classified and tested silica sand for glass, foundry, construction and water filtration. Five grades and a test report with every load. Request a free sample."
  },

  /* ==========================================================================
     NAVIGATION
     ========================================================================== */
  nav: {
    skipLink: "Skip to content",
    homeLabel: "GHANSHYAM GROUP home",
    links: [
      { label: "About", href: "#about" },
      { label: "Silica Sand", href: "#silica" },
      { label: "Process", href: "#process" },
      { label: "Quality", href: "#quality" },
      { label: "Products", href: "#products" },
      { label: "Group", href: "#group" },
      { label: "Journey", href: "#journey" },
      { label: "CSR", href: "#csr" }
    ],
    cta: { label: "Request a sample", href: "#contact" },
    menuOpen: "Menu",
    menuClose: "Close"
  },

  /* ==========================================================================
     HERO: the scroll journey at the top of the page
     ========================================================================== */
  hero: {
    /* The scroll video. Leave src empty to use the built-in animated sand pour.
       When the generated hero video is ready, put it in assets/video/ and set:
       src: "assets/video/hero-scrub.mp4", bytes: <file size in bytes>,
       poster: "assets/video/hero-poster.jpg", ending: "assets/video/hero-ending.jpg" */
    video: { src: "", bytes: 0, poster: "", ending: "" },

    bands: [
      {
        kicker: "{company.groupName} · {company.region}",
        title: "Precision, grain by grain.",
        text: "Silica sand for glass, foundry and construction, washed and tested since {company.founded}."
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
      kicker: "{company.groupName} · {company.region}",
      title: "Precision, grain by grain.",
      text: "Silica sand washed, sized and tested in {company.region} since {company.founded}. The same sand, every load."
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
     ABOUT US
     ========================================================================== */
  about: {
    kicker: "About the group",
    title: "One quarry in {company.founded}. Five companies today.",
    lede: "GHANSHYAM GROUP is a family-run industrial group from {company.region}. We mine, wash, grind and grow. Silica sand is where we started, and it is still the heart of the group.",
    body: [
      "Our sand goes into float glass, bottles, engine castings, tile adhesive and drinking water filters. Buyers stay for one reason: what arrives at their gate matches what they approved.",
      "We run the quarry, the plant, the lab and the trucks ourselves. When one family is answerable for every step, nobody can blame the next link in the chain."
    ],
    quote: S({
      text: "A buyer remembers the one bad truck, not the hundred good ones. So we run the plant for the one.",
      name: "R. G. Patel",
      role: "Founder and Chairman"
    }),
    image: photo("about-strata", "A tall quarry wall with a bright band of white silica sand between layers of ochre sandstone, under a blue sky", { w: 896, h: 1200, focus: "50% 45%" }),
    metrics: [
      { value: "{company.years}", suffix: "+", label: "years of mining and processing" },
      { value: S("36000"), suffix: " t", label: "washed sand capacity a month" },
      { value: S("5"), suffix: "", label: "silica grades in regular production" },
      { value: S("400"), suffix: "+", label: "buyers in India and abroad" }
    ],
    /* Mission and vision, under the numbers (samples: use the group's own words) */
    purpose: {
      title: "Mission and vision",
      items: [
        { label: "Our mission", text: S("Give every buyer sand and minerals that match the spec they approved, load after load, and leave the land around our quarries better than we found it.") },
        { label: "Our vision", text: S("To be the most trusted name in Indian silica and industrial minerals, known for consistency first and size second.") }
      ]
    }
  },

  /* ==========================================================================
     SILICA SAND: the flagship product showcase
     ========================================================================== */
  silica: {
    kicker: "Ghanshyam Silica Sand",
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
     MANUFACTURING PROCESS
     ========================================================================== */
  process: {
    kicker: "How we make it",
    title: "Seven steps between the quarry face and your silo.",
    lede: "Consistent sand is not luck. It comes from doing the same seven things, the same way, every day.",
    stepLabel: "Step",
    steps: [
      { icon: "quarry", title: "Choose the face", text: "We sample the quarry face before we cut it. Sand that will not make grade stays in the ground." },
      { icon: "wash", title: "Wash", text: "Water and attrition scrubbers strip the clay coating from every grain." },
      { icon: "classify", title: "Classify", text: "Hydrocyclones and screens sort the grain by size into the band you ordered." },
      { icon: "dry", title: "Dry", text: "A rotary dryer brings moisture under {quality.moisture}, so the sand flows freely and weighs true." },
      { icon: "magnet", title: "Pull the iron", text: "Rare-earth magnets lift out iron-bearing grains, the main cause of tint in glass." },
      { icon: "lab", title: "Test", text: "Every lot gets a sieve analysis, chemistry and a moisture check in our own lab." },
      { icon: "truck", title: "Pack and dispatch", text: "Bagged or loose, every load leaves with its lot number and its test report." }
    ]
  },

  /* ==========================================================================
     QUALITY ASSURANCE (includes the hold-to-sieve interactive moment)
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
     OUR PRODUCTS: the strongest products of each company, grouped by company
     --------------------------------------------------------------------------
     - Keep three products per company: the ones buyers ask for most.
     - grade: "glass"  takes the name, code and photo from that silica grade
       (see SILICA SAND above), and the card opens that grade's spec sheet.
       Any field you write here (name, text) overrides the grade's own.
     - Other products need name, spec (one short fact, under 20 characters
       so it sits on one line beside the link), text and image.
       Their card pre-fills the sample request form with the product.
     - image: photo("file-name", "What the photo shows") once the photo
       exists. Until then, placeholder("file-name", "#tone") draws a stand-in
       in the colour of the material (shown with "Photo to come" in review
       mode). To add the photo: save it as generated-images/products/
       <file-name>.jpg (4:3, at least 1200 x 896), run tools/photos.sh, then
       swap placeholder(...) for photo(...). Prompts for every photo are in
       the README.
     ========================================================================== */
  products: {
    kicker: "Our products",
    title: "Mined, washed, ground and grown.",
    lede: "The products buyers ask us for most, from each of our five companies. Choose a company to narrow the list.",
    filterLabel: "Show products from",
    allLabel: "All companies",
    showingAll: "Showing all {count} products.",
    showingOne: "Showing {count} products from {company}.",
    flagshipLabel: "Flagship",
    specsLabel: "See specs",
    enquireLabel: "Enquire",
    more: {
      text: "Not on the list? We wash, size, grind and blend to order.",
      link: { label: "Tell us what you need", href: "#contact" }
    },
    groups: [
      {
        id: "silica",                       /* the company id used across the site: colour marker and form */
        company: "Ghanshyam Silica Sand",
        name: "Silica Sand",
        flagship: true,
        text: "Washed, classified and tested sand, held to a written spec.",
        link: { label: "Compare all five grades", href: "#silica" },
        products: [
          S({ grade: "glass", spec: "Fe₂O₃ 0.035% max", text: "Low-iron sand for float, container and solar glass, with the same chemistry load after load." }),
          S({ grade: "foundry", spec: "AFS GFN 45 to 65", text: "Clean, sub-rounded grains for green sand, resin and core work, so moulds hold their shape." }),
          S({ grade: "build", spec: "0.1 to 1.2 mm", text: "Dry, graded sand for ready-mix mortar, tile adhesive and plaster, sized to your band." })
        ]
      },
      {
        id: "kaolin",
        company: "Ghanshyam Kaolin",
        name: "Kaolin",
        text: "White clay, washed and refined for ceramics, paper and paint.",
        link: { label: "See the full kaolin range", href: "#company-kaolin" },
        products: [
          S({ name: "Ceramic grade kaolin", spec: "Whiteness 85% min", text: "Washed kaolin for tile bodies, sanitaryware and tableware, low in iron for a clean fired colour.", image: placeholder("product-kaolin-ceramic", "#ECE7DF") }),
          S({ name: "Paper grade kaolin", spec: "Brightness 82 to 88%", text: "A fine, bright clay for filling and coating paper and board, steady from lot to lot.", image: placeholder("product-kaolin-paper", "#F2F0EB") }),
          S({ name: "Calcined kaolin", spec: "Brightness 90% min", text: "Kaolin fired for extra brightness and hardness, for paints, plastics and cables. Made on request.", image: placeholder("product-kaolin-calcined", "#F8F8F6") })
        ]
      },
      {
        id: "minerals",
        company: "Ghanshyam Minerals",
        name: "Minerals",
        text: "Feldspar, quartz and clays for glass, ceramics and refractories.",
        link: { label: "See the full minerals range", href: "#company-minerals" },
        products: [
          S({ name: "Potash feldspar", spec: "K₂O 10% min", text: "Lumps and grits for glass batches, glazes and vitrified tile bodies.", image: placeholder("product-minerals-feldspar", "#E7CEC4") }),
          S({ name: "Quartz lumps and grits", spec: "SiO₂ 99% min", text: "Hand-sorted lumps and sized grits for glass, ferro alloys and engineered stone.", image: placeholder("product-minerals-quartz", "#E3E8E9") }),
          S({ name: "Ball clay", spec: "High green strength", text: "A plastic, strong-binding clay that holds tile and sanitaryware bodies together before firing.", image: placeholder("product-minerals-ball-clay", "#CDC4B6") })
        ]
      },
      {
        id: "processors",
        company: "Ghanshyam Processors",
        name: "Processors",
        text: "Fine powders, ground and air classified to the micron.",
        link: { label: "See the full grinding range", href: "#company-processors" },
        products: [
          S({ grade: "flour", spec: "200 to 400 mesh", text: "Micronised silica for ceramics, paints and fibreglass, held to a tight size curve." }),
          S({ name: "Quartz powder", spec: "Up to 500 mesh", text: "Bright, fine quartz powder for engineered stone, glazes and welding electrodes.", image: placeholder("product-processors-quartz-powder", "#EFF0EE") }),
          S({ name: "Feldspar powder", spec: "200 to 325 mesh", text: "Ground feldspar for glass batches, glazes and vitrified tiles.", image: placeholder("product-processors-feldspar-powder", "#ECDDD6") })
        ]
      },
      {
        id: "farm",
        company: "Ghanshyam Farm House",
        name: "Farm House",
        text: "Fresh produce from our drip-irrigated farm beside the quarry.",
        link: { label: "See everything the farm grows", href: "#company-farm" },
        products: [
          S({ name: "Kutchi dates (kharek)", spec: "Harvest June to July", text: "Fresh yellow and red kharek from our own palms, picked and packed at the farm.", image: placeholder("product-farm-dates", "#B47A3A") }),
          S({ name: "Pomegranate", spec: "Bhagwa variety", text: "Deep red, sweet fruit, graded by size and packed for the trade.", image: placeholder("product-farm-pomegranate", "#A9333F") }),
          S({ name: "Groundnut", spec: "Bold kernels", text: "Sun-dried groundnut in shell or as kernels, for oil mills and traders.", image: placeholder("product-farm-groundnut", "#C79F70") })
        ]
      }
    ]
  },

  /* ==========================================================================
     THE GROUP: the five companies (Silica Sand leads, the other four follow)
     ========================================================================== */
  group: {
    kicker: "The group",
    title: "Five companies. One ground.",
    lede: "Each company grew out of the one before it. Together they cover the whole life of a mineral, and the farm keeps the land green around it.",
    flagship: {
      id: "silica",
      name: "Ghanshyam Silica Sand",
      logoLabel: "SILICA SAND",           /* the label under this branch's logo */
      badge: "Flagship",
      text: "Washed, classified and tested silica sand in five grades, for glass, foundry, construction and water.",
      link: { label: "See the grades", href: "#silica" },
      image: photo("company-silica", "A cone of white silica sand on a pale stone block"),
      facts: S([["Capacity", "36,000 t a month"], ["Grades", "5"], ["Since", "2003"]])
    },
    companies: [
      {
        id: "kaolin",
        name: "Ghanshyam Kaolin",
        logoLabel: "KAOLIN",
        tagline: "White clay, refined.",
        text: S("Washed kaolin for ceramic bodies, glazes, paper and paint. Mined at our Kutch deposit and refined in a dedicated levigation plant."),
        products: S(["Ceramic grade kaolin", "Paper grade kaolin", "Levigated china clay", "Calcined kaolin, on request"]),
        facts: S([["Brightness", "82 to 88%"], ["Capacity", "6,000 t a month"], ["Since", "2009"]]),
        image: photo("company-kaolin", "A lump of raw white kaolin clay on a pale grey surface"),
        enquire: "Enquire about kaolin"
      },
      {
        id: "minerals",
        name: "Ghanshyam Minerals",
        logoLabel: "MINERALS",
        tagline: "Where the group began.",
        text: S("The first company of the group, founded in 1996. It mines and trades feldspar, quartz and ball clay for glass, ceramics and refractories."),
        products: S(["Potash and soda feldspar", "Quartz lumps and grits", "Ball clay", "Bentonite, traded"]),
        facts: S([["Minerals", "6"], ["Markets", "9 states"], ["Since", "1996"]]),
        image: photo("company-minerals", "Clear quartz crystals beside pink feldspar on a pale surface"),
        enquire: "Enquire about minerals"
      },
      {
        id: "processors",
        name: "Ghanshyam Processors",
        logoLabel: "PROCESSORS",
        tagline: "Ground to the micron.",
        text: S("Grinding and micronising for silica flour, quartz powder and feldspar powder, with air classifiers that hold a tight particle size."),
        products: S(["Silica flour, 200 to 400 mesh", "Quartz powder", "Feldspar powder", "Custom grinding (job work)"]),
        facts: S([["Mills", "4 ball mills"], ["Capacity", "4,500 t a month"], ["Since", "2014"]]),
        image: photo("company-processors", "Inside a mineral grinding plant: a large ball mill, a cyclone and a hopper of fine powder, with a worker in a hard hat walking the aisle", { focus: "82% 50%" }),
        enquire: "Enquire about grinding"
      },
      {
        id: "farm",
        name: "Ghanshyam Farm House",
        logoLabel: "FARM HOUSE",
        tagline: "Grain of a different kind.",
        text: S("It began as a green belt around the quarry. Today it is an 80-acre drip-irrigated farm growing Kutchi dates, pomegranate, groundnut and cumin."),
        products: S(["Kutchi dates (kharek)", "Pomegranate", "Groundnut", "Cumin"]),
        facts: S([["Area", "80 acres"], ["Irrigation", "100% drip"], ["Since", "2019"]]),
        image: photo("company-farm", "Rows of young crops on drip irrigation lines at sunset, with round thatched huts and low hills behind", { focus: "40% 50%" }),
        enquire: "Enquire about farm produce"
      }
    ]
  },

  /* ==========================================================================
     WHY US: the short answer. Each reason links to the section that proves it.
     ========================================================================== */
  why: {
    kicker: "Why buyers choose us",
    title: "No surprises at your gate.",
    lede: "{company.years} years of supplying glass, foundry and ceramics makers taught us what a buyer needs most: the same material, every load, on time.",
    items: [
      { icon: "quarry", title: "One owner, quarry to truck", text: "We run the quarry, the washing plant, the lab and the trucks ourselves, so nothing slips between handovers.", link: { label: "How we make it", href: "#process" } },
      { icon: "lab", title: "Tested before it moves", text: "Every lot is sieved and checked in our own lab, and its report travels with the truck.", link: { label: "How we test", href: "#quality" } },
      { icon: "classify", title: "Made to your spec", text: "We wash, size, grind and blend to the band your process needs, then hold it there.", link: { label: "See what we make", href: "#products" } },
      { icon: "truck", title: "Close to the ports", text: S("Mundra port is 60 km from the plant, so export and coastal loads leave on time."), link: { label: "See the plant", href: "#infrastructure" } }
    ]
  },

  /* ==========================================================================
     TESTIMONIALS (sample quotes: replace with real, approved quotes or remove
     before launch. Never publish sample quotes as if they were real.)
     ========================================================================== */
  testimonials: {
    kicker: "What buyers say",
    title: "Judged one truck at a time.",
    prevLabel: "Previous quote",
    nextLabel: "Next quote",
    items: S([
      { quote: "Every truck matches the sample we approved. Two years in, we have not had to change our batch once.", role: "Head of Purchase", org: "Container glass plant, Gujarat" },
      { quote: "The certificate comes with the lorry, and our own lab agrees with it. That is rarer than it should be.", role: "QC Manager", org: "Grey iron foundry, Rajkot" },
      { quote: "In the monsoon, when other suppliers missed dispatches, Ghanshyam kept our line running.", role: "Plant Head", org: "Tile manufacturer, Morbi" }
    ]),
    /* Clients under the quotes. SAMPLE: each slot only names a kind of buyer.
       Replace with real clients' logos, with their permission:
         { name: "Company name", logo: "assets/img/clients/file-name.svg" }
       Never show a company's logo without its permission. */
    clients: {
      title: "Supplying makers of glass, castings, tiles and paint",
      items: S([
        { name: "Float glass", place: "Gujarat" },
        { name: "Container glass", place: "Uttar Pradesh" },
        { name: "Solar glass", place: "Gujarat" },
        { name: "Grey iron foundry", place: "Rajkot" },
        { name: "Tiles", place: "Morbi" },
        { name: "Sanitaryware", place: "Thangadh" },
        { name: "Paints", place: "Mumbai" },
        { name: "Water treatment", place: "Pune" }
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
    lede: "The people who run the quarries, the plants and the lab, and who pick up the phone when a buyer calls.",
    people: [
      S({ name: "R. G. Patel", role: "Founder and Chairman", text: "Started the group in {company.founded} and still walks the plant most mornings." }),
      S({ name: "M. R. Patel", role: "Managing Director", text: "Runs sales and dispatch, and knows most of our buyers by name." }),
      S({ name: "K. R. Patel", role: "Director, Operations", text: "Leads mining, washing and grinding across the group's five companies." }),
      S({ name: "Dr. N. Shah", role: "Head of Quality", text: "Runs the lab that signs every lot report before a truck leaves." })
    ]
  },

  /* ==========================================================================
     OUR JOURNEY: the interactive growth timeline
     company: one of silica, kaolin, minerals, processors, farm
     ========================================================================== */
  journey: {
    kicker: "Our journey",
    title: "Grown grain by grain.",
    lede: "Three decades, one step at a time. Pick a year.",
    prevLabel: "Earlier",
    nextLabel: "Later",
    milestones: S([
      { year: "1996", company: "minerals", title: "Ghanshyam Minerals is founded", text: "A small trading business in Bhuj, supplying feldspar and quartz to local potteries." },
      { year: "2003", company: "silica", title: "The first silica quarry", text: "Ghanshyam Silica Sand opens its quarry on the Bhuj-Mundra road with one washing line." },
      { year: "2009", company: "kaolin", title: "Ghanshyam Kaolin", text: "A kaolin deposit next door becomes the group's third company and its first refining plant." },
      { year: "2012", company: "silica", title: "First float glass contract", text: "A float glass maker approves our glass grade. It still buys from us today." },
      { year: "2014", company: "processors", title: "Ghanshyam Processors", text: "Ball mills and air classifiers start making silica flour and quartz powder." },
      { year: "2017", company: "silica", title: "Our own lab, and ISO 9001", text: "An on-site lab starts testing every lot, and the quality system is certified." },
      { year: "2019", company: "farm", title: "Ghanshyam Farm House", text: "The green belt around the quarry becomes a working, drip-irrigated farm." },
      { year: "2021", company: "silica", title: "A second washing line", text: "Capacity doubles to 36,000 tonnes of washed sand a month, with a new rotary dryer." },
      { year: "2023", company: "silica", title: "First export container", text: "Glass grade ships from Mundra port to buyers in the Gulf and East Africa." },
      { year: "2025", company: "silica", title: "Low-iron solar grade", text: "Extra magnetic separation brings iron down far enough for solar glass makers." }
    ]),
    /* Achievements, under the timeline (samples: use real certificates and awards) */
    achievements: {
      title: "Achievements",
      items: S([
        { year: "2017", icon: "badge", title: "{quality.certification} certified", text: "Our quality system passed its first outside audit, and every yearly audit since." },
        { year: "2020", icon: "report", title: "One million tonnes shipped", text: "The millionth tonne of washed silica sand left the plant." },
        { year: "2021", icon: "seal", title: "Supplier excellence award", text: "From a float glass maker, for unbroken supply through the pandemic years." },
        { year: "2024", icon: "lab", title: "A year with no rejected loads", text: "Not one load sent back by a buyer, across every grade we shipped." }
      ])
    }
  },

  /* ==========================================================================
     INFRASTRUCTURE (the plant map: x and y are % positions on the picture)
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
      { x: 53, y: 30, title: "Rotary dryer", text: "Brings moisture under 0.5% at 25 tonnes an hour." },
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

  /* ==========================================================================
     FAQ: the questions buyers ask before ordering
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

  /* ==========================================================================
     CONTACT: the one call to action the whole page leads to
     ========================================================================== */
  contact: {
    kicker: "Request a sample",
    title: "Test it in your own lab first.",
    lede: "Tell us your process and the grade you need. We send a free {sample.size} sample with its test report, and a quote if you want one.",
    form: {
      /* WHERE SUBMISSIONS GO
         endpoint: "" means demo mode: the form checks the fields and shows its
         thank-you message, but nothing is sent anywhere.
         Before launch, create a free form service account (for example
         Formspree) and paste its address here, e.g. "https://formspree.io/f/abcdwxyz".
         Submissions then arrive in the sales inbox. */
      endpoint: "",
      fields: {
        name: { label: "Your name", placeholder: "Full name", autocomplete: "name" },
        company: { label: "Company", placeholder: "Company name", autocomplete: "organization" },
        email: { label: "Work email", placeholder: "name@company.com", autocomplete: "email" },
        phone: { label: "Phone", placeholder: "+91 98765 43210", autocomplete: "tel", optional: "optional" },
        grade: {
          label: "What do you need?",
          placeholder: "Choose a product",
          silicaGroup: "Silica sand grades",     /* options come from the silica grades above */
          otherGroup: "Other group companies",   /* options come from the group companies above */
          other: "Not sure yet, please advise"
        },
        volume: { label: "Monthly volume", placeholder: "For example, 200 tonnes", optional: "optional" },
        message: { label: "Anything we should know?", placeholder: "Your process, size band, delivery point", optional: "optional" }
      },
      submit: "Request my sample",
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
        text: "Thank you, {name}. Our sales team will reply within one working day with your sample dispatch details.",
        demo: "Demo mode: this form is not connected yet, so nothing was sent.",
        again: "Send another request"
      }
    },
    channelsTitle: "Or reach us directly",
    channels: {
      phone: "Call sales",
      whatsapp: "WhatsApp",
      email: "Email",
      hours: "Hours"
    },
    officesTitle: "Where we are",
    offices: [
      { title: "Head office", fact: "contact.headOffice" },   /* address lines come from FACTS */
      { title: "Plant and quarry", fact: "contact.plant" }
    ],
    map: S({ src: "assets/img/placeholders/map-kutch.svg", alt: "Schematic map of Kutch showing the plant, Bhuj, and the ports of Mundra and Kandla" }),
    mapLink: "Open in Google Maps"
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
     FOOTER and legal
     ========================================================================== */
  footer: {
    statement: "Precision, grain by grain.",
    companiesTitle: "Companies",
    exploreTitle: "Explore",
    contactTitle: "Contact",
    explore: [
      { label: "About the group", href: "#about" },
      { label: "Silica sand grades", href: "#silica" },
      { label: "Our products", href: "#products" },
      { label: "Quality", href: "#quality" },
      { label: "Leadership", href: "#leadership" },
      { label: "Our journey", href: "#journey" },
      { label: "Responsibility", href: "#csr" },
      { label: "Request a sample", href: "#contact" }
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
      "When you send a sample request, we receive the details you type into the form: your name, company, email, phone and message. We use them only to reply to you and to send your sample and quote.",
      "We do not sell or share your details. We keep enquiries for up to two years, then delete them. To see or delete what we hold about you, email {contact.email}.",
      "This notice is sample text. Please have it reviewed before the site goes live."
    ])
  }
};
