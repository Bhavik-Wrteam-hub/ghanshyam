/* ==========================================================================
   ICON SET: 24px line icons drawn for GHANSHYAM GROUP.
   1.6px stroke, round joins. Add a new icon by adding a key here, then use
   its name in site-content.js (for example icon: "lab").
   ========================================================================== */
(function () {
  'use strict';
  var GG = (window.GG = window.GG || {});
  GG.ICONS = {
    /* interface */
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    'arrow-out': '<path d="M8 16L16 8M9.5 8H16v6.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M4 8h16M4 16h10"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    phone: '<path d="M6.8 3.8h2.6l1.4 3.9-1.9 1.3a10.6 10.6 0 0 0 6.1 6.1l1.3-1.9 3.9 1.4v2.6a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 4.8 6a2 2 0 0 1 2-2.2z"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    whatsapp: '<path d="M4.2 19.8l1.2-3.9A8.2 8.2 0 1 1 8.4 19z"/><path d="M9.3 8.6c.3-.5.7-.5 1 0l.6 1.3c.1.3 0 .6-.2.8l-.4.4a5.6 5.6 0 0 0 2.6 2.6l.4-.4c.2-.2.5-.3.8-.2l1.3.6c.5.3.5.7 0 1-1 .6-2.2.5-3.4-.1a8 8 0 0 1-2.8-2.8c-.6-1.2-.7-2.4.1-3.2z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    hold: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4"/>',

    /* process */
    quarry: '<path d="M3 19.5h18M4 19.5V16h4.5v-3.5H13V9h4.5V5.5H20"/><circle cx="7" cy="9" r="1.2"/>',
    wash: '<path d="M12 3.5s-5.2 5.7-5.2 9.6a5.2 5.2 0 0 0 10.4 0c0-3.9-5.2-9.6-5.2-9.6z"/><path d="M9.4 13.6a2.7 2.7 0 0 0 2.6 2.6"/>',
    classify: '<path d="M4 5h16l-6 7.2v5.6l-4 2v-7.6z"/>',
    dry: '<path d="M4 20.5h16"/><path d="M8 17c1.4-1.4 1.4-2.8 0-4.2s-1.4-2.8 0-4.2M12 17c1.4-1.4 1.4-2.8 0-4.2s-1.4-2.8 0-4.2M16 17c1.4-1.4 1.4-2.8 0-4.2s-1.4-2.8 0-4.2"/>',
    magnet: '<path d="M6 4.5v7.3a6 6 0 0 0 12 0V4.5h-4v7.3a2 2 0 0 1-4 0V4.5z"/><path d="M6 8h4M14 8h4"/>',
    lab: '<path d="M9.5 3.5h5M10.5 3.5v6l-5.3 8.6a1.6 1.6 0 0 0 1.4 2.4h10.8a1.6 1.6 0 0 0 1.4-2.4L13.5 9.5v-6"/><path d="M7.6 15h8.8"/>',
    truck: '<path d="M3 6.5h11v9.5H3zM14 9.5h3.8l3.2 3.4V16H14"/><circle cx="7" cy="17.8" r="1.8"/><circle cx="17.2" cy="17.8" r="1.8"/>',
    report: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4M9.5 12.5h6M9.5 16h4"/>',
    seal: '<circle cx="12" cy="9.5" r="5.5"/><path d="M9 14.4L7.6 20.5l4.4-2.1 4.4 2.1L15 14.4"/><path d="M10 9.6l1.4 1.4 2.8-2.9"/>',
    badge: '<path d="M12 3.5l7 2.6v5.6c0 4.4-3 7.8-7 9.3-4-1.5-7-4.9-7-9.3V6.1z"/><path d="M8.8 12l2.2 2.2 4.3-4.4"/>',

    /* industries */
    glass: '<rect x="5" y="3.5" width="14" height="17" rx="1"/><path d="M8.5 10l3.5-3.5M8.5 14.5l7-7"/>',
    foundry: '<path d="M3.5 8.5h11v2.5a5.5 5.5 0 0 1-11 0z"/><path d="M14.5 9.5h2.8l3.2-3.2M9 16.5V20M6 20h6"/>',
    construction: '<rect x="3.5" y="5.5" width="17" height="13" rx="1"/><path d="M3.5 9.8h17M3.5 14.2h17M9 5.5v4.3M15 9.8v4.4M9 14.2v4.3"/>',
    water: '<path d="M12 3.5s-5.5 6-5.5 10a5.5 5.5 0 0 0 11 0c0-4-5.5-10-5.5-10z"/><path d="M9 13h6M9.8 16h4.4"/>',
    ceramics: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    paint: '<rect x="4" y="4" width="13" height="5" rx="1.2"/><path d="M17 6.5h2.5V11H11v3"/><rect x="10" y="14" width="2" height="6.5" rx=".8"/>',
    fibre: '<path d="M3 8c3-3 6 3 9 0s6 3 9 0M3 12c3-3 6 3 9 0s6 3 9 0M3 16c3-3 6 3 9 0s6 3 9 0"/>',
    paper: '<path d="M8.5 3.5h9.5v13.5H8.5z"/><path d="M5.5 6.5v14h9.5"/><path d="M11 8h4.5M11 11h4.5"/>',
    rubber: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3.5v3.1M12 17.4v3.1M3.5 12h3.1M17.4 12h3.1"/>',
    store: '<path d="M4.5 9.5l1.4-5h12.2l1.4 5"/><path d="M4.5 9.5h15a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0z"/><path d="M5.5 12.2v7.8h13v-7.8M10 20v-4.5h4V20"/>',
    ship: '<path d="M3.5 15.5h17l-1.9 4.5H5.4z"/><path d="M6 15.5V10.5h12v5"/><path d="M9.5 10.5V7h5v3.5"/><path d="M12 7V4"/>',
    mill: '<rect x="4" y="6.5" width="16" height="9" rx="4.5"/><circle cx="9.5" cy="11" r="1.3"/><circle cx="14.5" cy="11" r="1.3"/><path d="M7.5 15.5v4M16.5 15.5v4M5.5 19.5h13"/>',
    /* responsibility */
    leaf: '<path d="M5.5 18.5C5 10.5 10.5 5 19 5c.4 8.5-5 14-13.5 13.5z"/><path d="M5.5 18.5L13 11"/>',
    book: '<path d="M12 6.5C9.6 5 7 4.6 4 5.3v13c3-.7 5.6-.3 8 1.2 2.4-1.5 5-1.9 8-1.2v-13c-3-.7-5.6-.3-8 1.2z"/><path d="M12 6.5v13"/>',
    heart: '<path d="M12 19.5s-7.5-4.3-7.5-9.6A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.3c0 5.3-7.5 9.6-7.5 9.6z"/>'
  };
})();
