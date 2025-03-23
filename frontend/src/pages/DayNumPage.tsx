import {DayNumCompo} from "../components/DayNumCompo"

export const DayNumPage = () => {
    return(
        <div className="bg-black">
            {/* Navbar */}
            <div className="min-h-screen p-2 sm:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-3 w-full">
                        <DayNumCompo />
                    </div>
                    
                    <div className="lg:col-span-2 w-full h-[400px] lg:h-auto bg-gray-100 rounded-lg ">
                        <div className="text-gray-500 font-medium">MapCompo</div>
                    </div>
                </div>
            </div>
        </div>
    )
}