export const handleFetchItineraries = async ( storedIds: string[]) => {
    console.log("Stored IDs:", storedIds);
    // console.log("User ID:", userId);

    // Validate inputs
    if (!Array.isArray(storedIds)) {
        console.error("storedIds is not an array:", storedIds);
        return;
    }
    if (storedIds.some(id => typeof id !== "string")) {
        console.error("storedIds contains non-string values:", storedIds);
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fetchitineraries`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ids: storedIds,
            }),
        });

        if (!response.ok) {
            // Handle rate limiting and other errors
            if (response.status === 429) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Rate limit exceeded");
            }
            throw new Error("Failed to fetch itineraries");
        }

        const data = await response.json();
        console.log("Fetched itineraries:", data);
        return data;
    } catch (error) {
        console.error("Error in handleFetchItineraries:", error);
        throw error;
    }
};