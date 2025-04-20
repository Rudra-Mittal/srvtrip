import express, { Response } from "express";
import { AuthRequest, placesData } from "../utils/types";
import { generate2 } from "../AIController2";
import { extractPlacesByRegex } from "../AIController2/services/extractPlacesbyRegex";
import { getPhotoUri, placeInfo } from "./places";
import { replacePlace } from "../utils/replaceName";
import createItenary from "../utils/createItenary";
import createDay from "../utils/createDay";
import checkPlaceAndReturnPhotos from "./checkPlaceInDb";
import connectPlace from "../utils/connectPlace";
import createPlace from "../utils/createPlace";
import callWebScrapper from "./callWebScrapper";

export const itenaryRoute = async (req: AuthRequest, res:Response) => {
  try{
    const { prompt } = req.body;
  console.log("prompt",prompt);

  const userId = req.user?.userId;//get userId from token
  console.log(userId)

  if (!userId) {
    res.status(403).json({ "error": "User not found" });
    return
  }

  const itenary = await generate2(prompt)

  const allDayPlaces = extractPlacesByRegex(itenary)//get the 2d array of places (daywise places)

  const placesData = await Promise.all(
    allDayPlaces.map((dayPlaces, index) =>
      Promise.all(dayPlaces.map((place) => placeInfo(place, index + 1)))
    )
  ) as placesData;
  let dayNum = 0
  const newItenary = replacePlace(itenary, placesData)
  const itenaryid = await createItenary(newItenary, userId);
  if (!itenaryid) {
    res.status(403).json({ "error": "User not found" });
    return
  }
  for (const day of placesData) {
    const dayId = await createDay(dayNum, itenaryid, newItenary);
    for (const place of day) {
      console.log("Place:", place)
      const placeD= await checkPlaceAndReturnPhotos(place);
      if (placeD.id) {
        console.log("Place already exist in db")
        const id = await connectPlace(placeD.id, dayId);
        if (id) {
          place.photos = placeD.images.map((image) => image.imageUrl);
        }
        else console.log("Error connecting place")
      }
      else {
        //call the photos api
        const placePhotos = await Promise.all((place.photos?.map((reference: string) => getPhotoUri(reference))));
        place.photos= placePhotos
        const placeD = await  createPlace(place, dayId, placePhotos);
        if (!placeD) {
          console.log("Error creating place")
        }
        // else  callWebScrapper(place.displayName, 5, place.id,place.formattedAddress)
      }
    }
    dayNum++;
  }
  
  console.log("Places Data in backend iti route:", placesData)
  res.json({newItenary,placesData:JSON.stringify(placesData)});
  return
  }catch(err){
    console.log(err);
    res.status(500).json({errror:"Internal server error"})
    return 
  }
}