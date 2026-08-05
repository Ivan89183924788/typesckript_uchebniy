//type/booking.ts
import type { Trip } from "./trip";

export interface BookingCreate{
    user_id:number;
    trip_id:number;
}
export interface Booking{
    id:number;
    user_id: number;
    trip_id: number;
    status: string;
    is_paid:boolean;
}
export interface BookingWithTrip extends Booking{
    trip:Trip
}