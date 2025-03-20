import { placesData } from "./types";

export function   replacePlace(itenary:string,placesData:placesData) {
    try {
        let newItenary = itenary;
        for (const day of placesData) {
            for(const place of day){
                newItenary = newItenary.replaceAll(`#${place.placename}#`, `#${place.id}#`);
            }
        }
        return newItenary;
    } catch (error) {
        console.error("Error replacing places:", error);
        return JSON.stringify({ error: "Internal Server Error" });
    }
}

