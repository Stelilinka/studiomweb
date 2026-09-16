// Kurátorovaná sada fotografií — VÝHRADNĚ nehty / modeláž / manikúra.
// Jen jemné nude a pudrové tóny, aby fotky ladily s paletou předlohy.
// Žádné lahvičky, žádná pedikúra, žádná jiná témata.

// Dodané firemní podklady klientky
export const STUDIO_LOGO =
  "https://customer-assets-v7afamib.emergentagent.net/job_czech-chat-buddy/artifacts/j0eu20jk_WhatsApp%20Image%202026-09-16%20at%2019.18.33.jpeg";

export const NAIL_PHOTOS = {
  // šalvějová francie se zlatými detaily — fotka od klientky
  sageFrench:
    "https://customer-assets-v7afamib.emergentagent.net/job_czech-chat-buddy/artifacts/eup86puw_Gemini_Generated_Image_wfxms1wfxms1wfxmnxnxnxn.webp",
  // hero koláž
  heroLeft:
    "https://images.unsplash.com/photo-1610992015762-45dca7fa3a85?crop=entropy&cs=srgb&fm=jpg&w=900&q=80&ixlib=rb-4.1.0",
  heroRight:
    "https://images.unsplash.com/photo-1769687209448-025548dfca8b?crop=entropy&cs=srgb&fm=jpg&w=900&q=80&ixlib=rb-4.1.0",
  // karty služeb a galerie — vše jemné nude / pudrové
  manikura:
    "https://images.unsplash.com/photo-1610992015836-7c249d75782d?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80&ixlib=rb-4.1.0",
  modelaz:
    "https://images.unsplash.com/photo-1604902396830-aca29e19b067?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80&ixlib=rb-4.1.0",
  gelLak:
    "https://images.unsplash.com/photo-1630843599725-32ead7671867?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80&ixlib=rb-4.1.0",
  nailArt:
    "https://images.pexels.com/photos/35491156/pexels-photo-35491156.jpeg?auto=compress&cs=tinysrgb&w=1200",
  zpevneni:
    "https://images.unsplash.com/photo-1587729927069-ef3b7a5ab9b4?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80&ixlib=rb-4.1.0",
  peceONehty:
    "https://images.unsplash.com/photo-1610992015732-2449b76344bc?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80&ixlib=rb-4.1.0",
  nudeDetail:
    "https://images.pexels.com/photos/6941115/pexels-photo-6941115.jpeg?auto=compress&cs=tinysrgb&w=1200",
  nudeKlid:
    "https://images.unsplash.com/photo-1653129579760-4a1f5675f9d1?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80&ixlib=rb-4.1.0",
} as const;

// Fotka ke každé službě z ceníku (id ze backendu)
export const SERVICE_PHOTOS: Record<string, string> = {
  "klasicka-manikura": NAIL_PHOTOS.manikura,
  "gel-lak": NAIL_PHOTOS.gelLak,
  "modelaz-nehtu": NAIL_PHOTOS.modelaz,
  "nail-art": NAIL_PHOTOS.nailArt,
  pedikura: NAIL_PHOTOS.peceONehty,
};

export const SERVICE_PHOTO_FALLBACK = NAIL_PHOTOS.zpevneni;

// Galerie ukázek prací — jen nehty, jemné tóny
export const GALLERY_PHOTOS = [
  { src: NAIL_PHOTOS.manikura, alt: "Nude manikúra s lesklým finišem" },
  { src: NAIL_PHOTOS.nailArt, alt: "Zdobení nehtů s jemným glitrem" },
  { src: NAIL_PHOTOS.nudeDetail, alt: "Elegantní nude nehty v detailu" },
  { src: NAIL_PHOTOS.heroRight, alt: "Modeláž nehtů se zdobením" },
] as const;
