export function replacePlace(itenary:string,places:string[],placeId:string[]) {
    console.log(itenary);
    console.log(places);
    console.log(placeId)
    try {
        let newItenary = itenary;
        for (let i = 0; i < places.length; i++) {
        newItenary = newItenary.replaceAll(`#${places[i]}#`, `#${placeId[i]}#`);
        }
        return newItenary;
    } catch (error) {
        console.error("Error replacing places:", error);
        return JSON.stringify({ error: "Internal Server Error" });
    }
}


