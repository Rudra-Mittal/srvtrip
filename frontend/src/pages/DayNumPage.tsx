import {DayNumCompo} from "../components/DayNumCompo"

export const DayNumPage = () => {
    return(
        <div>
            {/* Navbar */}
            <div className="min-h-screen grid grid-cols-5 gap-4 p-4">
                <div className="col-span-3">
                    <DayNumCompo />
                </div>
                <div className="col-span-2">MapCompo</div>
            </div>
        </div>
    )
}