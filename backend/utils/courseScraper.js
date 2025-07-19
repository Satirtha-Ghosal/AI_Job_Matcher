const { chromium } = require('playwright');

const courseScraper = async (skill, price = false, cert = false, level = false) => {
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

  // 🕵️ Stealth: block navigator.webdriver
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3],
    });
  });
  const baseUrl = 'https://www.classcentral.com/search';
  const params = new URLSearchParams();
  if (skill) params.append('q', skill);
  if (price) params.append('free', price);         // e.g., 'free' or 'paid'
  if (cert) params.append('certificate', cert);            // e.g., 'yes' or 'no'
  if (level) params.append('level', level);         // e.g., 'beginner', etc.

  const finalUrl = `${baseUrl}?${params.toString()}`;
  console.log("Navigating to:", finalUrl);

  try {
    await page.goto(finalUrl, {
      waitUntil: 'networkidle',
    });

    // Smart wait for first course card
    await page.waitForSelector('li.course-list-course');

    const data = await page.evaluate(() => {
      const cards = Array.from(
        document.querySelectorAll('li.course-list-course')
      );

      return cards.map((card) => {
        const img = card.querySelector(
          'img.absolute.top.left.width-100.height-100.cover.block'
        );
        const imageSrc = img?.src || '';

        const titleEl = card.querySelector(
          '.text-1.weight-semi.line-tight.margin-bottom-xxsmall'
        );
        const courseName = titleEl?.innerText.trim() || '';
        const courseHref = titleEl?.closest('a')?.href || '';

        const starFull = card.querySelectorAll('.icon-star.icon-medium').length;
        const starHalf = card.querySelectorAll('.icon-star-half.icon-medium')
          .length;
        const starEmpty = card.querySelectorAll('.icon-star-empty.icon-medium')
          .length;

        const description =
          card.querySelector(
            '.color-charcoal.block.hover-no-underline.break-word'
          )?.innerText.trim() || '';

        const platform =
          card.querySelector(
            '.hover-underline.color-charcoal.text-3.margin-left-small.line-tight'
          )?.innerText.trim() || '';

        const workload =
          card.querySelector('[aria-label="Workload and duration"]')
            ?.innerText.trim() || '';

        return {
          imageSrc,
          courseName,
          courseHref,
          starFull,
          starHalf,
          starEmpty,
          description,
          platform,
          workload,
        };
      });
    });

    await browser.close();
    return data;
  } catch (err) {
    console.error('❌ Error during scraping:', err.message);
    await browser.close();
    return {
      imageSrc: '',
      courseName: '',
      courseHref: '',
      starFull: 0,
      starHalf: 0,
      starEmpty: 0,
      description: '',
      platform: '',
      workload: '',
    };
  }
};

module.exports = courseScraper;
