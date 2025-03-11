import { chromium } from 'playwright';

export async function scrapeGoogleMapsReviews(placeName: string, maxScrolls: number) {
    const browser = await chromium.launch({ headless: false, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navigate to Google Maps and wait for search input
        await page.goto('https://www.google.com/maps', );
        await page.waitForSelector('input#searchboxinput', { state: 'visible', timeout: 60000 });

        // Perform search
        await page.fill('input#searchboxinput', placeName);
        await page.keyboard.press('Enter');
        
        // Handle search results
        try {
            // Wait for either search results or direct place page
            await page.waitForSelector('//div[contains(@aria-label, "Results")]', { timeout: 5000 });
            const searchResult = page.locator('//a[contains(@class, "hfpxzc")]').first();
            await searchResult.click();
            // Wait for place page to load
            await page.waitForSelector('//button[contains(@aria-label, "Reviews")]', { timeout: 5000 });
        } catch {
            // Continue if we're already on place page
        }

        // Open reviews section
        try {
            const reviewsButton = page.locator('//button[contains(@aria-label, "Reviews")]');
            await reviewsButton.waitFor({ state: 'visible', timeout: 5000 });
            await reviewsButton.click();
        } catch {
            const reviewSpan = page.locator('//span[contains(@class, "j8EM5b")]');
            await reviewSpan.waitFor({ state: 'visible', timeout: 5000 });
            await reviewSpan.click();
        }

        // Wait for reviews container
        const reviewSection = page.locator('//div[@class="m6QErb DxyBCb kA9KIf dS8AEf XiKgde "]');
        await reviewSection.waitFor({ state: 'visible', timeout: 5000 });

        // Scroll through reviews
        for (let i = 0; i < maxScrolls; i++) {
            await reviewSection.evaluate(el => el.scrollBy(0, 1000));
            await page.waitForTimeout(1000); // Brief pause between scrolls
        }

        // Process reviews
        const reviews = [];
        const reviewElements = await reviewSection.locator('//div[contains(@class, "MyEned")]').all();
        
        for (const review of reviewElements) {
            // Expand "More" button if present
            const moreButton = review.locator('//button[contains(@class, "w8nwRe")]');
            if (await moreButton.isVisible({ timeout: 2000 })) {
                await moreButton.click();
                await moreButton.waitFor({ state: 'hidden' }).catch(() => {});
            }
            
            // Extract review text
            const reviewText = await review.locator('//span[contains(@class, "wiI7pd")]').textContent();
            reviews.push(reviewText?.trim() || '');
        }

        await browser.close();
        return { placeName, reviews: reviews.filter(Boolean) };

    } catch (error) {
        console.error("Error during scraping:", error);
        await browser.close();
        return null;
    }
}