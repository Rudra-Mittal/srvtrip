import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";

const places=["Dominos,Chandigarh"];

places.forEach(place=>{
    scrapeGoogleMapsReviews(place,50).then((reviews)=>{
        console.log(reviews);
    })
});
