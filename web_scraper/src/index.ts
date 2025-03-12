import { scrapeGoogleMapsReviews } from "./controllers/reviewsScrapper";
import * as fs from 'fs'
const places=["Dominos,Chandigarh"];

places.forEach(place=>{
    scrapeGoogleMapsReviews(place,100).then((reviews)=>{
        fs.appendFile("../data.json",JSON.stringify(reviews),()=>{
            console.log(reviews.reviews.length,"reviews of ",place,"saved");
        })
    })
});
