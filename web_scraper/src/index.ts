import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";

const places=["Taj Mahal, India","Hawa Mahal, India","UIET Punjab University","JW Marriott Hotel Chandigarh","Rann of Kutch"];

places.forEach(place=>{
    scrapeGoogleMapsReviews(place,0).then((reviews)=>{
        console.log(reviews);
    })
});
