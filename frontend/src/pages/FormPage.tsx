import Form from "@/components/formPage/form";
import { Globe } from "@/components/globe";
export default function FormPage(){
  return (
    <div className="bg-black min-h-screen text-white overflow-hidden grid  md:grid-cols-2 sm: grid-cols-1">
      <div className="p-2">
        <Form/>
      </div>
      <div className="py-4 ml-[20rem] z-20">
        <Globe/>
        
      </div>
    </div>
  )
}