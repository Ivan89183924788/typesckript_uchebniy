//services/tripServices

import type { Trip } from "../type/trip";
import type {  CreateTripFormData } from "../type/admin";

export async function getTrips():Promise<Trip[]> {
    const response=await fetch("api/trip/")
    if(!response.ok){
        throw new Error("Не удалось загрузить поездки")
    }
    const trips:Trip[]=await response.json();
    return trips;
}


export async function getTripsById(tripId:number):Promise<Trip> {
    const response=await fetch(`/api/trip/${tripId}`)
    if(!response.ok){
        throw new Error("Не удалось загрузить поездки")
    }
    const trip:Trip=await response.json();
    return trip;
}



