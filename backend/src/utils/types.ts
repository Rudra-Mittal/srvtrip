//types for placesData (2D array having each idx as array of places of that day and places is in object)

export interface place{
    new:boolean,//differentiator
    dayNum:number,
    id:string,
    formattedAddress:string,
    displayName:string,
    location:{
        latitude:number,
        longitude:number
    },
    photos:string[],
}
export type day= place[];
//placesData will array of type day
export type placesData=day[];

