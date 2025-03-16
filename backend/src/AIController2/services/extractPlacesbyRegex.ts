export const extractPlacesByRegex = (itinerary: any): string[] => {
    try {
        // Convert JSON itinerary to a string for regex search
        const itineraryString = JSON.stringify(itinerary);

        // Use regex to extract place names inside #...#
        const placeRegex = /#(.*?)#/g;
        const matches = [...itineraryString.matchAll(placeRegex)].map(match => match[1]); // Extracting text inside #

        // Remove duplicates using a Set and return as an array
        const uniquePlaces = [...new Set(matches)];

        //console.log("Extracted unique places:", uniquePlaces);
        return uniquePlaces;

    } catch (error) {
        console.error("Error processing itinerary:", error);
        throw error;
    }
};
