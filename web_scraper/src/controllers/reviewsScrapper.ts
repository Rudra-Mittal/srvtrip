import {chromium } from 'playwright';

export async function scrapeGoogleMapsReviews(placeName:string, maxScrolls:number) {
    const browser = await chromium.launch({ headless: true });  // Set headless: true to run without UI
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Open Google Maps
        await page.goto('https://www.google.com/maps', { timeout: 60000 });
        await page.waitForTimeout(3000);

        // Search for the place
        await page.fill('input#searchboxinput', placeName);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);  // Allow search results to load

        // Click on "More Reviews" button
        const reviewsButton = page.locator("//button[contains(@aria-label, 'Reviews')]");
        if (await reviewsButton.count() === 0) {
            console.log("Error: 'More Reviews' button not found.");
            await browser.close();
            return null;
        }
        await reviewsButton.click();
        await page.waitForTimeout(3000);

        // Wait for the reviews section to appear
        const reviewSection =  page.locator("//div[contains(@class, 'm6QErb DxyBCb kA9KIf dS8AEf XiKgde')]");
        if (await reviewSection.count() === 0) {
            console.log("Error: Reviews section not found.");
            await browser.close();
            return null;
        }

        let reviews = [];
        let scrollAttempts = 0;
        // Scrolling to load more reviews
        while(scrollAttempts<maxScrolls){
            await page.evaluate((reviewSection) => {
                reviewSection?.scrollBy(0, 800);
            }, await reviewSection.elementHandle());

            await page.waitForTimeout(2000);  // delay, depending on network speed
            scrollAttempts++;
        }
        const reviewElements = await reviewSection.locator("//div[contains(@class, 'MyEned')]").all();
            for (const review of reviewElements) {
                const moreButton= review.locator("//button[contains(@class, 'w8nwRe kyuRq')]");
                // console.log(moreButton);
                if(await moreButton.count()>0)  moreButton.click();
                await page.waitForTimeout(2000);
                const reviewEle= review.locator("//span[contains(@class, 'wiI7pd')]");
                const reviewText = await reviewEle.textContent();
                reviews.push(reviewText);
            }

            await browser.close();
            return { placeName, reviews: reviews};

    } catch (error) {
        console.error("Error during scraping:", error);
        await browser.close();
        return null;
    }
}