import fs from "fs";
import path from "path";

//fn to extract places names from itinerary file
export const extractPlacesbyRegex = ()=>{
    try{
        // Correct path to ensure it looks for itinerary.json outside both src and dist
        const filePath = path.resolve(__dirname,"../../itinerary.json");

        // Wait until the file exists
        if (!fs.existsSync(filePath)) {
            console.error("itinerary.json does not exist yet!");
            return null;
        }

        //read the itinerary file
        const itineraryData=fs.readFileSync(filePath,"utf-8");
        const itinerary=JSON.parse(itineraryData);

        //convert json itinerary to string for regex search
        const itineraryString=JSON.stringify(itinerary);

        //use regex to extract place names that are inside #...# in the itinerary string
        const placeRegex=/#(.*?)#/g;
        const matches = [...itineraryString.matchAll(placeRegex)].map(match => match[1]); // Extracting text inside #

        // Create a structured JSON object for places
        const placesJson: Record<string, string> = {};// object with key value pairs

        matches.forEach((place, index) => {
        placesJson[`place${index + 1}`] = place;
        });

        console.log("Extracted places:", placesJson);

        //Save extracted places to places.json
        fs.writeFileSync("places.json", JSON.stringify(placesJson, null, 2), "utf-8");

        console.log("places.json file created successfully with extracted places!");

        return placesJson;//returning the extracted places json object

    } catch (error) {
        console.error("Error reading or processing itinerary.json:", error);
    }
}