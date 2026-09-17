// Kurátorovaná sada fotografií — VÝHRADNĚ nehty / modeláž / manikúra.
// Jen jemné nude a pudrové tóny, aby fotky ladily s paletou předlohy.
// Žádné lahvičky, žádná pedikúra, žádná jiná témata.

// Dodané firemní podklady klientky
export const STUDIO_LOGO =
  "https://static.prod-images.emergentagent.com/jobs/38975200-033e-48d7-a89a-dd9139c8a9a8/images/4e0943c91343e82ca769b969ad1b97fbb8dac1e5fa14ce5f0f5ff744718d4385.jpeg";

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
    "https://static.prod-images.emergentagent.com/jobs/38975200-033e-48d7-a89a-dd9139c8a9a8/images/343b9a2a5b888387ec827cfce41a9d47923b12e5f64f1ec50f9a146fb6ad0615.jpeg",
  gelLak:
    "https://images.unsplash.com/photo-1630843599725-32ead7671867?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80&ixlib=rb-4.1.0",
  nailArt:
    "https://images.pexels.com/photos/35491156/pexels-photo-35491156.jpeg?auto=compress&cs=tinysrgb&w=1200",
  zpevneni:
    "https://static.prod-images.emergentagent.com/jobs/38975200-033e-48d7-a89a-dd9139c8a9a8/images/9131b9744d94e8e08d53924f3aa6bd3e3093f7ce07e68c44853cb1fe0a531e0e.jpeg",
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

// Vystřižené PNG segmenty od klientky (public/fotky) — jednotlivé nehty
// s 3D květinovým zdobením, ideální pro plovoucí dekorace a kolekci.
export const SEGMENT_NAILS = [
  ...Array.from({ length: 13 }, (_, i) => `/fotky/3d-floral-nail-art-${i + 1}.png`),
  ...Array.from({ length: 10 }, (_, i) => `/fotky/almond-shaped-nails-${i + 1}.png`),
  ...Array.from({ length: 6 }, (_, i) => `/fotky/nude-pink-nail-polish-${i + 1}.png`),
  ...Array.from({ length: 4 }, (_, i) => `/fotky/sage-green-nail-polish-${i + 1}.png`),
] as const;

// Ručně vybraná kolekce pro sekci „3D floral kolekce“
export const COLLECTION_NAILS = [
  { src: "/fotky/3d-floral-nail-art-3.png", name: "Sakura pearl", note: "3D květ s perletí" },
  { src: "/fotky/almond-shaped-nails-5.png", name: "Blush almond", note: "mandle v nude tónu" },
  { src: "/fotky/sage-green-nail-polish-2.png", name: "Sage blossom", note: "šalvěj se zdobením" },
  { src: "/fotky/nude-pink-nail-polish-1.png", name: "Nude pink", note: "klasika se zlatou linkou" },
  { src: "/fotky/3d-floral-nail-art-7.png", name: "Gold twig", note: "zlatá větvička" },
  { src: "/fotky/almond-shaped-nails-9.png", name: "Pearl glaze", note: "glazed donut finiš" },
  { src: "/fotky/3d-floral-nail-art-4.png", name: "Petite fleur", note: "drobné 3D kvítky" },
  { src: "/fotky/sage-green-nail-polish-4.png", name: "Eucalyptus", note: "matná šalvěj" },
] as const;

export const HAND_CUTOUT = "/fotky/manicured-hands-1.png";
