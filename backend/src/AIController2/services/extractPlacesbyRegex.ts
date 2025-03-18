export const extractPlacesByRegex = (itinerary: any): string[][] => {
    const allDayPlaces: string[][]=[];
    try {
        // Convert JSON itinerary to a string for regex search
        const itineraryJson = JSON.parse(itinerary);
        console.log(itineraryJson);
        const days=itineraryJson.itinerary.days;//array of days in itinerary json format
        // console.log(itineraryJson.itinerary,days);
        //traverse the days array which has each day's object and extract the places
        days.map((day: any) => {
            const itineraryString = JSON.stringify(day); // Convert day's itinerary to a string
            const placeRegex = /#(.*?)#/g;
            const matches = [...itineraryString.matchAll(placeRegex)].map(match => match[1]);
            allDayPlaces.push([...new Set(matches)]); // Remove duplicates and return places for the day
        }); 

    } catch (error) {
        console.error("Error processing itinerary:", error);
        throw error;
    }
    console.log(allDayPlaces);
    return allDayPlaces;
};
