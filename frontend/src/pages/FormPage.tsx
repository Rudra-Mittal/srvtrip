import Form from "@/components/formPage.tsx/form";
import { Globe } from "@/components/globe";
import Loader from "@/components/loader";
export default function FormPage(){
  return (
    <div className="bg-black min-h-screen text-white overflow-hidden grid  md:grid-cols-2 sm: grid-cols-1">
      <div className="p-2">
        <Form/>
      </div>
      <div className="p-4">
        <Globe/>
        
      </div>
    </div>
  )
}