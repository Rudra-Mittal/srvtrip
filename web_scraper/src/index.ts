import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";

const places=["Dominos,Chandigarh","UIET, PU,chandigarh","Hawa mahal","Marine Drive","gateway of india","Taj hotel, mumbai"];

places.forEach(place=>{
    scrapeGoogleMapsReviews(place,10).then((reviews)=>{
        console.log(reviews);
    })
});
