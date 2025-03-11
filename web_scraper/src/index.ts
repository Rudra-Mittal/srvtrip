// import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";

// const places=["Dominos,Chandigarh","UIET, PU,chandigarh","Hawa mahal","Marine Drive","gateway of india","Taj hotel, mumbai"];

// places.forEach(place=>{
//     scrapeGoogleMapsReviews(place,10).then((reviews)=>{
//         console.log(reviews);
//     })
// });


import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";
import * as fs from "fs";

const places = ["Marine Drive"];

const saveReviewsToFile = (data: any, filename: string) => {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
        console.log(`✅ Reviews saved to ${filename}`);
    } catch (error) {
        console.error("❌ Error saving reviews:", error);
    }
};

const scrapeAndSaveReviews = async () => {
    let allReviews: { place: string; reviews: string[] }[] = [];

    for (const place of places) {
        console.log(`🔍 Scraping reviews for: ${place}...`);
        const result = await scrapeGoogleMapsReviews(place, 25); // Adjust scrolls if needed

        if (result && result.reviews.length > 0) {
            allReviews.push({ place, reviews: result.reviews.filter((review: string | null) => review !== null) });
        } else {
            console.warn(`⚠️ No reviews found for ${place}`);
        }
    }

    if (allReviews.length > 0) {
        saveReviewsToFile(allReviews, "scraped_reviews.json");
    } else {
        console.log("❌ No reviews were scraped.");
    }
};

scrapeAndSaveReviews();
