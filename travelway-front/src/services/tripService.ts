import type { Trip } from "../type/trip";

const API_URL="http://127.0.0.1:8000";
export async function getTrips():Promise<Trip[]> {
    const responce=await fetch(`${API_URL}/trip/`)
    if(!responce.ok){
        throw new Error("Не удалось загрузить поездки")
    }
    const trips:Trip[]=await responce.json();
    return trips;
}