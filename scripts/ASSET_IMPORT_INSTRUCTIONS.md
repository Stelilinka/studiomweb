# Asset import instructions

This script helps download images, CSS, JS and referenced resources from the Lovable preview into public/assets/lovable. It is a best-effort scraper and may need manual adjustments for dynamically loaded assets.

How to use

1. Install dependencies
   npm install
   (cheerio is already included in package.json in this branch)

2. Run the script with the preview URL:
   node scripts/scrape-assets.js "https://id-preview--add9c8a8-f7c8-49cf-91f2-1de6b60000ca.lovable.app/"

3. The script will save index.html and all found assets into public/assets/lovable.

Notes
- Dynamically loaded assets (via JS) may not be discovered. If important images/fonts are missing, inspect the live site and add them manually to public/assets.
- Fonts: webfonts declared via @font-face in CSS will be downloaded if referenced directly.
- After assets are downloaded, you can begin reconstructing components using the saved HTML/CSS as a reference.
