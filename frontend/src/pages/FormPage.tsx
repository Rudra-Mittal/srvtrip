import Form from "@/components/formPage/form";
import { Globe } from "@/components/globe";
import { useEffect, useState } from "react";

export default function FormPage(){
  const [loadGlobe, setLoadGlobe] = useState(false);
  useEffect(()=>{
    setTimeout(()=>{
      setLoadGlobe(true);
    },2500)
  })
  return (
    <div className="bg-black min-h-screen text-white overflow-hidden grid grid-cols-1 md:grid-cols-2">
      <div className="w-full md:pr-4">
        <Form/>
      </div>
      <div className="hidden md:block relative overflow-hidden">
        <div className="w-full h-full scale-150 origin-left">
         {loadGlobe&&<Globe/>}
        </div>
      </div>
    </div>
  )
}