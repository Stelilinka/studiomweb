Přidal jsem větev `assets-import` s nástrojem pro stažení assetů z Lovable preview.

Co jsem přidal:
- scripts/scrape-assets.js — Node skript, který stáhne HTML a assety (img, css, js) do public/assets/lovable
- scripts/ASSET_IMPORT_INSTRUCTIONS.md — instrukce jak spustit skript
- Aktualizovaný package.json s příkazem `npm run scrape-assets` a závislostí `cheerio`

Co udělat dál (doporučené):
1) V lokálním prostředí nainstalujte závislosti: `npm install`.
2) Spusťte scraper: `npm run scrape-assets "https://id-preview--add9c8a8-f7c8-49cf-91f2-1de6b60000ca.lovable.app/"`.
3) Zkontrolujte `public/assets/lovable` a případně doplňte chybějící fonty nebo obrázky ručně.

Poznámka: skript je best-effort. Některé assety načítané dynamicky přes JS nemusí být zachyceny. Po stažení začnu převádět HTML do komponent a upravovat Tailwind konfiguraci pro přesný vzhled.
