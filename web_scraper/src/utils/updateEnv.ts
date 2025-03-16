import * as fs from "fs";
export function updateEnv(WEAVIATE_URL: string, WEAVIATE_API_KEY: string): void {
    const file=fs.readFileSync(".env","utf8").split("\n")
        const newFile=[]
        for(let line  of file){
            // console.log(line)
            if(line.includes("WEAVIATE_URL")){
                const URL=line.split("=")[1]
                line= line.replace(URL,`"${WEAVIATE_URL}"`)
            }else if(line.includes("WEAVIATE_API_KEY")){
                const API_KEY=line.split("=")[1]
                line =line.replace(API_KEY,`"${WEAVIATE_API_KEY}"`)
            }
            newFile.push(line)
        }
    fs.writeFileSync(".env",newFile.join("\n"))
}