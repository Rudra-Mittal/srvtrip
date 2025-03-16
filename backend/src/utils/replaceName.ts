export async function replacePlace(itenary:string,places:string[],displayName:string[]) {
    console.log(itenary);
    console.log(places);
    console.log(displayName)
    try {
        let newItenary = itenary;
        for (let i = 0; i < places.length; i++) {
            // /🗺\[\[(.*?)\]/g
        // const placeRegex = new RegExp(`🗺\\[[${places[i]}\\]`, 'g');
        newItenary = newItenary.replaceAll(`🗺[[${places[i]}]`, displayName[i]);
        }
        console.log(newItenary)
        return newItenary;
    } catch (error) {
        console.error("❌ Error replacing places:", error);
        return JSON.stringify({ error: "Internal Server Error" });
    }
}

