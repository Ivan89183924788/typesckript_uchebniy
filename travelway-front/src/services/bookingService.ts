//services/bookingServices.ts
import type { Booking, BookingCreate } from "../type/bookings";

export async function createBooking(data:BookingCreate):Promise<Booking>{
    const response=await fetch("/api/bookings/",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    if(!response.ok){
        const error=await response.json();
        throw new Error(error.detail||"Не удалось создать бронь");  
    }
    const booking:Booking=await response.json();
    return booking;
}
export async function getUserBookings(userId:number):Promise<Booking[]> {
    const response=await fetch(`/api/bookings/user/${userId}`)
    if(!response.ok){
        throw new Error("Не удалось загрузить бронирования")
    }
    const bookings:Booking[]=await response.json();
    return bookings;
}