import { useSelector } from "react-redux";

export default function HistoryPage() {
    // const itineraries = useSelector((state: any) => state.itinerary.itineraries);
    // const places = useSelector((state: any) => state.itinerary.places);
    // const parsedItineraries = itineraries ? JSON.parse(itineraries) : [];
    // const parsedPlaces = places ? JSON.parse(places) : [];
    // console.log(parsedPlaces);
    // console.log(parsedItineraries);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">History</h2>
                <p className="text-gray-400 mb-6">
                    Your history will be displayed here.
                </p>
            </div>
        </div>
    )
}