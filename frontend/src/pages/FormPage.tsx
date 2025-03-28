import Form from "@/components/formPage.tsx/form";
import { Globe } from "@/components/globe";
export default function FormPage(){
  return (
    <div className="bg-black min-h-screen text-white overflow-hidden grid  md:grid-cols-2 sm: grid-cols-1">
      <div className="p-2">
        <Form/>
      </div>
      <div className="py-4">
        {/* <Globe/> */}
        
      </div>
    </div>
  )
}