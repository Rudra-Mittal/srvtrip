export async function extractPlaces(itenary: any): Promise<string[]> {
  try {
    const jsonData = JSON.parse(itenary);
    const placeMap = new Map<string, string>(); // To avoid near-duplicates
    const regex = /🗺\[\[(.*?)\]/g;

    jsonData.itinerary.forEach((day: any) => {
      for (const period of ["morning", "afternoon", "evening"]) {
        if (day[period]) {
          for (const field of ["activities", "food"]) {
            if (day[period][field]) {
              const matches = day[period][field].matchAll(regex);
              for (const match of matches) {
                const place = match[1].trim();
                const normalizedPlace = place
                  .toLowerCase()
                  .replace(/\s*,\s*/g, ", ") // Normalize spacing
                  .replace(/[^a-z0-9, ]/gi, ""); // Remove special characters

                // Keep the most detailed version of a place
                if (
                  !placeMap.has(normalizedPlace) ||
                  place.length > placeMap.get(normalizedPlace)!.length
                ) {
                  placeMap.set(normalizedPlace, place);
                }
              }
            }
          }
        }
      }
    });

    const places = Array.from(placeMap.values()); // Get unique places with the most detailed names
    return places;
  } catch (error) {
    console.error("❌ Error reading or extracting places:", error);
    throw error;
  }
}
