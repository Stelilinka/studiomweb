# Studio M — specifikace aplikace

## Co aplikace je
Web nail ateliéru **Studio M** (Praha, Vinohrady) s kompletním online
rezervačním systémem a multi-agentní AI pipeline pro návrh designu nehtů.
**Všechny texty UI jsou v češtině.**

## Data model (MongoDB, kolekce)
- `bookings` — id (uuid string), service_id/service_name/service_price/service_duration_min, date (YYYY-MM-DD), time (HH:MM), name, phone, email, design_description, design_prompt, has_design_image, status (`nova|potvrzena|dokoncena|zrusena`), pipeline_status (`none|prompt|image|calendar|done|failed`), pipeline_error, event_id, calendar_synced, created_at/updated_at (aware UTC)
- `design_images` — booking_id (unikátní), data (bytes PNG), mime_type
- `calendar_tokens` — profile="owner", Google OAuth tokeny majitelky
- `status_checks` — vzorový kolek šablony (nevyužívá UI)

## Služby (ceník, hardcoded v backend/routers/services.py)
Klasická manikúra 450 Kč/45 min · Gel lak 650 Kč/60 min · Modeláž nehtů
950 Kč/120 min · Bespoke Nail Art od 100 Kč/30 min · Spa Pedikúra 750 Kč/60 min

## Klíčové toky
1. **Rezervace (Home #rezervace, 4 kroky):** výběr služby → datum (Calendar,
   zakázané minulost + neděle) + volný čas z `GET /api/availability?date=`
   (otevírací doba 9–19, celočíselné hodinové sloty, obsazenost z DB) →
   kontakt → `POST /api/bookings` (validace, kolize → 409). Po vytvoření
   rezervace se zobrazí formulář popisu designu → `POST /api/bookings/{id}/design`.
2. **AI pipeline (background task):** Agent 1 **Claude** (emergentintegrations,
   model `claude-sonnet-4-5-20250929`) z popisu připraví anglický prompt pro
   obrázek → Agent 2 **Execution Agent** vygeneruje fotorealistický obrázek →
   uloží se do `design_images` → pokud je kalendář připojený, doplní se odkaz
   do popisu Google události. Frontend polluje `GET /api/bookings/{id}` (2,5 s)
   a zobrazuje pipeline jako 3 kroky + finální obrázek.

   **Klíče agentů (backend/.env, prioritní pořadí):**
   - Agent 1 (Claude): `ANTHROPIC_API_KEY` zákaznice (ověřeno, funkční) →
     fallback `EMERGENT_LLM_KEY`
   - Agent 2 (obrázky): `GEMINI_API_KEY` (Vertex express `AQ.…`) — nano banana
     (`gemini-2.5-flash-image`, Developer API režim) → Imagen
     (`imagen-3.0-generate-002`, Vertex režim) → fallback Emergent engine
     (`gpt-image-1`)
   - **STAV:** Gemini klíč hlásí 429 QUOTA_EXHAUSTED (nutný billing/kvóta v
     Google projektu), Imagen/Vertex 403 (Agent Platform API vypnutá) a Emergent
     engine pro obrázky má vyčerpaný budget (429 budget_exceeded). Dokud se
     neodblokují, pipeline selže s čitelnou chybou v UI a popis designu lze
     odeslat znovu — rezervace i Claude prompt fungují normálně.
3. **Google Kalendář:** OAuth majitelky (jednorázové připojení na /admin).
   Vytvoření rezervace → `create_event` v kalendáři `primary` (Evropa/Prague).
   Bez `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` v backend/.env běží systém v
   **demo režimu** (rezervace jen v DB, admin pill to hlásí) — funkce je
   připravená, jen čeká na kredity.

## Endpointy (vše pod /api na api_router)
- `GET /api/services` — ceník
- `GET /api/availability?date=` — volné časy (closed + message pro neděli/minulost)
- `POST /api/bookings` — vytvoření rezervace (201 logika přes 200; 409 při kolizi; 400 při nevalidním termínu)
- `GET /api/bookings` — seznam (admin), `GET /api/bookings/{id}` — detail (polling)
- `POST /api/bookings/{id}/design` — popis designu → spustí pipeline (409 když běží)
- `GET /api/bookings/{id}/design-image` — PNG návrhu
- `PATCH /api/bookings/{id}` — změna stavu (admin)
- `GET /api/calendar/status`, `GET /api/oauth/calendar/login`, `GET /api/oauth/calendar/callback`, `POST /api/calendar/disconnect`

## Frontend
- `/` — hero (Krása v každém detailu), bento ceník, AI Studio (interaktivní
  SVG NailCanvas: tvar/délka/finiš), filozofie, rezervační wizard, recenze, CTA, patička
- `/admin` — tabulka rezervací, změna stavu, detail-výkres s promptem a obrázkem,
  stav/připojení Google Kalendáře
- Fonts: Playfair Display Variable (nadpisy) + DM Sans Variable (text) +
  JetBrains Mono Variable (prompt), vše přes @fontsource
- Palette: #FAF7F2 / #1C1917 / akcent #9E4733 + champagne #C49A6C
- Žádné externí obrázky/fotobanky — jen SVG/CSS; jediné skutečné obrázky jsou
  AI-generované návrhy z pipeline

## Auth
Žádná — admin stránka je otevřená (demo). Kalendář je chráněn OAuth Googlem.

## Seed
`cd /app/backend && python seed.py` — vloží 3 demo rezervace (Tereza K.
potvrzená s popisem designu, Karolína M. nová, Michaela V. dokončená s
ukázkovým promptem). Idempotentní (přeskočí, pokud už rezervace existují).
