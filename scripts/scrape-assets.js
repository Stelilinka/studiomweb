const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const { URL } = require('url')

if (process.argv.length < 3) {
  console.error('Usage: node scripts/scrape-assets.js <preview_url>')
  process.exit(1)
}

const previewUrl = process.argv[2]
const outDir = path.join(process.cwd(), 'public', 'assets', 'lovable')

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return await res.text()
}

async function fetchBinary(url, outPath) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buffer)
  console.log('Saved', outPath)
}

function resolveUrl(base, relative) {
  try {
    return new URL(relative, base).toString()
  } catch (e) {
    return null
  }
}

async function scrape(url) {
  console.log('Fetching', url)
  const html = await fetchText(url)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)

  const $ = cheerio.load(html)
  const assets = new Set()

  // images
  $('img').each((i, el) => {
    const src = $(el).attr('src')
    if (src) assets.add(resolveUrl(url, src))
  })
  // source tags (picture, svg use)
  $('source').each((i, el) => {
    const src = $(el).attr('src') || $(el).attr('srcset')
    if (src) assets.add(resolveUrl(url, src))
  })
  // link rel=stylesheet
  $('link[rel="stylesheet"]').each((i, el) => {
    const href = $(el).attr('href')
    if (href) assets.add(resolveUrl(url, href))
  })
  // scripts
  $('script').each((i, el) => {
    const src = $(el).attr('src')
    if (src) assets.add(resolveUrl(url, src))
  })
  // background images in inline styles
  $('[style]').each((i, el) => {
    const style = $(el).attr('style')
    const match = /url\(([^)]+)\)/g
    let m
    while ((m = match.exec(style))) {
      const urlStr = m[1].replace(/['"\s]/g, '')
      if (urlStr) assets.add(resolveUrl(url, urlStr))
    }
  })

  // Also try to parse CSS files for url(...) references later
  const assetList = Array.from(assets).filter(Boolean)
  console.log('Found', assetList.length, 'asset URLs')

  for (const assetUrl of assetList) {
    try {
      const urlObj = new URL(assetUrl)
      // sanitize path
      const filename = urlObj.pathname.split('/').filter(Boolean).join('_') || path.basename(urlObj.pathname)
      const outPath = path.join(outDir, filename)
      await fetchBinary(assetUrl, outPath)

      // if it's a CSS file, parse it for further resources
      if (assetUrl.endsWith('.css')) {
        const cssText = fs.readFileSync(outPath, 'utf8')
        const urls = Array.from(cssText.matchAll(/url\(([^)]+)\)/g)).map(m => m[1].replace(/['"\s]/g, ''))
        for (const u of urls) {
          const abs = resolveUrl(assetUrl, u)
          if (abs) {
            try {
              const subUrl = new URL(abs)
              const subName = subUrl.pathname.split('/').filter(Boolean).join('_')
              await fetchBinary(abs, path.join(outDir, subName))
            } catch (e) {
              console.warn('Skipping resource', abs)
            }
          }
        }
      }
    } catch (err) {
      console.warn('Failed to download', assetUrl, err.message)
    }
  }

  console.log('Done. Assets saved to', outDir)
}

scrape(previewUrl).catch(err => {
  console.error('Error scraping:', err)
  process.exit(1)
})
