
import { Link ,useNavigate} from "react-router-dom"
import styles from "./BookingPage.module.css"
import {useEffect, useState} from "react"
import type { BookingWithTrip } from "../../type/bookings";
import { getUserBookings } from "../../services/bookingService";
import { getTripsById } from "../../services/tripService";

export function BookingPage(){
    const[bookings,setBookings]=useState<BookingWithTrip[]>([]);
    const[isLoading,setIsLoading]=useState(true);
    const[error,setError]=useState("")
    const navigate=useNavigate();
    useEffect(()=>{
        async function loadBookings() {
            const savedUserId=localStorage.getItem("userId");
            if(!savedUserId){
                setError("Сначала войдите в аккаунт");
                navigate("/login");
                return;
            }
            try{
                setIsLoading(true);
                setError("");
                const userId=Number(savedUserId);
                const userBookings=await getUserBookings(userId);
                console.log(userBookings);
                const bookingsWithTrips=await Promise.all(
                    userBookings.map(async (booking)=>{
                        const trip=await getTripsById(
                            booking.trip_id
                        );
                        return{
                            ...booking,trip:trip,
                        };
                    }
                )
                )
                setBookings(bookingsWithTrips);
            }
            catch(error){
                if(error instanceof Error){
                    setError(error.message);
                }
                else{
                    setError("Ошибка ")
                }
            }
            finally{
                setIsLoading(false);
            }
        }
        loadBookings();
    },[navigate])
    return(
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>
                        Мои бронирования
                    </h1>
                    <p>
                        Здесь находятся ваши выбранные поездки
                    </p>
                </div>
                <Link to="/">
                    На главную
                </Link>
            </div>
            {isLoading&&(
                <p className={styles.message}> 
                    Загружаем бронирования...
                </p>
            )}
            {error&&(
                <p className={styles.error}> 
               {error}
            </p>
            )}
            {!isLoading&&!error&&bookings.length>0&&(
                <div className={styles.list}>
                    {bookings.map((booking)=>(
                        <div key={booking.id}
                        className={styles.card}>
                            <div className={styles.tripInfo}>
                                <span className={styles.bookingNumber}>
                                    Бронирование № {booking.id}
                                </span>
                                <h2>
                                    {booking.trip.from_city}
                                    {"->"}
                                    {booking.trip.to_city}
                                </h2>
                                <p>
                                    Статус:{" "}
                                    <span>
                                        {booking.status}
                                    </span>
                                </p>
                                <p>
                                    Оплата:{" "}
                                    <span>
                                        {booking.is_paid?"Оплачено":"Не оплачено"}
                                    </span>
                                </p>
                            </div>
                            <div className={styles.priceBlock}>
                                <span>Стоимость</span>
                                <p className={styles.price}>
                                     {booking.trip.price.toLocaleString("ru-RU")}  {" "} 
                                </p>
                               {!booking.is_paid&&(
                                <button type="button"
                                className={styles.payButton}>
                                    Оплатить
                                </button>
                               )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}