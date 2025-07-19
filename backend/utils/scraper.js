const { chromium } = require('playwright');

const scraper = async (url) => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
  });

  const page = await context.newPage();

  // Stealth settings
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
  });

  console.log('Navigating to:', url);

  try {
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for the section that contains the job description
    await page.waitForSelector('.adp-body', { timeout: 30000 });

    const data = await page.evaluate(() => {
      const section = document.querySelector('.adp-body');
      if (!section) return { sections: [], nextHref: null };

      const children = Array.from(section.children);
      const result = [];

      let currentHeading = null;
      let hasStructuredContent = false;

      for (const child of children) {
        if (child.tagName === 'P') {
          const heading = child.innerText.trim();
          if (heading) currentHeading = heading;
        } else if (child.tagName === 'UL' && currentHeading) {
          const items = Array.from(child.querySelectorAll('li')).map(li => li.innerText.trim());
          result.push({
            heading: currentHeading,
            content: items,
          });
          hasStructuredContent = true;
          currentHeading = null;
        }
      }

      // 🛑 If nothing structured found, fallback to plain text
      if (!hasStructuredContent) {
        const fallbackText = section.innerText.trim();
        if (fallbackText) {
          result.push({
            heading: 'Description',
            content: fallbackText.split('\n').filter(line => line.trim() !== ''),
          });
        }
      }

      // Extract apply URL
      const anchor = section.nextElementSibling?.tagName === 'A' ? section.nextElementSibling : null;
      const href = anchor?.getAttribute('href') || null;
      const extracted = href?.match(/v=([^&]*)/);
      const nextHref = extracted ? extracted[1] : null;

      return {
        sections: result,
        nextHref,
      };
    });

    
    return data;

  } catch (err) {
    console.error('❌ Error during scraping:', err.message);
    await browser.close();
    return { sections: [], nextHref: null };
  } finally{
    await browser.close();
  }
};

module.exports = scraper;
