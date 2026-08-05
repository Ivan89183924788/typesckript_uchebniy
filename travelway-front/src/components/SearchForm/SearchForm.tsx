import { useState, type FormEvent } from "react"
import styles from "./SearchForm.module.css"
import type { Trip } from "../../type/trip";
import { getTrips } from "../../services/tripService";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../services/bookingService";
type TravelClass="economy"|"business"
export function SearchForm(){
    const[fromCity,setFromCity]=useState("Москва");
    const[toCity,setToCity]=useState("Санкт-Петербург");
    const[departureDate,setDepartureDate]=useState("");
    const[returnDate,setReturnDate]=useState("");
    const[departureTime,setDepartureTime]=useState("");
    const[returnTime,setReturnTime]=useState("");
    const[passengers,setPassengers]=useState(1);
    const[carrier,setCarrier]=useState(1);
    const[transport,setTransport]=useState(1);
    const[travelClass,setTravelClass]=useState<TravelClass>("economy");
    const[foundTrips,setFoundTrips]=useState<Trip[]>([]);
    const[isLoading,setIsLoading]=useState(false);
    const[error,setError]=useState("")
     const[bookingMessage,setBookingMessage]=useState("")
     const navigate=useNavigate();
    function swapCities(){
        setFromCity(toCity);
        setToCity(fromCity);
    }
   async function handleBooking(tripId:number){
    const saveUserId=localStorage.getItem("userId");
    if(!saveUserId){
        setError("Сначала войдите в аккаунт");
        navigate('/login');
    }

    try {
        setError("");
        setBookingMessage('');
        const booking=await createBooking({
            user_id:Number(saveUserId),
            trip_id:tripId,
        })
        setBookingMessage(`Бронирование ${booking.id} успешно создано`)
    }
     catch(error){
        if(error instanceof Error){
            setError(error.message)
        }
        else{
            setError('Ошибка')
        }
    }

   } 

   async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        try{
            setIsLoading(true);
            setError("");
            setFoundTrips([]);
            const trips=await getTrips();
            const filteredTrips=trips.filter((trip)=>{
                const tripFrom=trip.from_city.trim().toLowerCase();
                const tripTo=trip.to_city.trim().toLowerCase();
                const searchFrom=fromCity.trim().toLowerCase();
                const searchTo=toCity.trim().toLowerCase();
                return(
                    tripFrom===searchFrom&&tripTo===searchTo
                );
            });
            console.log(trips);
            
            setFoundTrips(filteredTrips);
        }catch(error){
            if(error instanceof Error){
                setError(error.message);
            }
            else{
                setError("Ошибка ")
            }
            
        }finally{
            setIsLoading(false);
        }
        
    }
    return(
        <>
        <form className={styles.form}
        onSubmit={handleSubmit}>
            <div className={styles.mainRow}>
                <label className={`${styles.field} ${styles.from}`}>
                    <span className={styles.label}>Откуда</span>
                    <input type="text"
                    value={fromCity}
                    onChange={(event)=>setFromCity(event.target.value)} 
                    required/>
                </label>
                <button type="button"
                className={styles.swapButton}
                onClick={swapCities}
                aria-label="Поменять города местами">
                   ⇄
                </button>
                <label className={`${styles.field} ${styles.to}`}>
                    <span className={styles.label}>Куда</span>
                    <input type="text"
                    value={toCity}
                    onChange={(event)=>setToCity(event.target.value)} />
                </label>
                <label className={`${styles.field} ${styles.date}`}>
                    <span className={styles.label}>Туда</span>
                    <input type="date"
                    value={departureDate}
                    onChange={(event)=>setDepartureDate(event.target.value)} />
                </label>
                <label className={`${styles.field} ${styles.time}`}>
                    <span className={styles.label}>Туда</span>
                    <input type="text"
                    value={departureTime}
                    onChange={(event)=>setDepartureTime(event.target.value)} />
                </label>
                
                <label className={`${styles.field} ${styles.date}`}>
                    <span className={styles.label}>Обратно</span>
                    <input type="date"
                    value={returnDate}
                    onChange={(event)=>setReturnDate(event.target.value)} />
                </label>
                   <label className={`${styles.field} ${styles.time}`}>
                    <span className={styles.label}>Обратно</span>
                    <input type="text"
                    value={returnDate}
                    onChange={(event)=>setReturnDate(event.target.value)} />
                </label>
                <label className={`${styles.field} ${styles.carrier}`}>
                    <span className={styles.label}>Перевозчик</span>
                    <select value={carrier}
                    onChange={(event)=>setCarrier(Number(event.target.value))}>
                        <option value={1}>Аэрофлот</option>
                        <option value={2}>Авиалинии</option>
                        <option value={3}>РЖД</option>
                        <option value={4}>СуперЖД</option>
                    </select>
                </label>
                <label className={`${styles.field} ${styles.transport}`}>
                    <span className={styles.label}>Транспорт</span>
                    <select value={transport}
                    onChange={(event)=>setPassengers(Number(event.target.value))}>
                        <option value={1}>Самолет</option>
                        <option value={2}>Вертолет</option>
                        <option value={3}>Поезд</option>
                        <option value={4}>Электричка</option>
                    </select>
                </label>
                <label className={`${styles.field} ${styles.passengers}`}>
                    <span className={styles.label}>Пассажиры</span>
                    <select value={passengers}
                    onChange={(event)=>setPassengers(Number(event.target.value))}>
                        <option value={1}>1 пассажир</option>
                        <option value={2}>2 пассажира</option>
                        <option value={3}>3 пассажира</option>
                        <option value={4}>4 пассажира</option>
                    </select>
                </label>
                <label className={`${styles.field} ${styles.travelClass}`}>
                    <span className={styles.label}>Класс</span>
                    <select value={travelClass}
                    onChange={(event)=>setTravelClass(event.target.value as TravelClass)}>
                        <option value="economy">Эконом</option>
                        <option value="business">Бизнес</option>
                    </select>
                </label>
                <button type="submit"
                className={styles.searchButton}
                disabled={isLoading}>
                    {isLoading?"Поиск...":"Найти билеты"}
                </button>
            </div>
            <div className={styles.bottomRow}>
                <div className={styles.leftButtons}>
                    <button type="button">
                    → Обратный билет
                    </button>
                    <button type="button">
                    Сложный маршрут
                    </button>
                </div>
                <div className={styles.rightButtons}>
                    <button type="button">
                    Багаж
                    </button>
                    <button type="button">
                    Корпоративным клиентам
                    </button>
                </div>
            </div>
        </form>
        <div className={styles.results}>
            {error&&(
                <p className={styles.error}>
                    {error}
                </p>
            )}
            {bookingMessage&&(
                <p>
                    {bookingMessage}
                </p>
            )}
            {!isLoading&&!error&&foundTrips.length===0&&(
                <p className={styles.empty}>Поездки не найдены</p>
            )}
            {foundTrips.map((trip)=>(
                <div>
                    <h3>
                        {trip.from_city}→{trip.to_city}
                    </h3>
                    <p>
                        Прямой маршрут
                    </p>
                    <strong>{trip.price.toLocaleString("ru-RU")}rub</strong>
                    <button type="button"
                     onClick={()=>handleBooking(trip.id)}>
                     Забронировать</button>
                   
                </div>
            ))}
        </div>
        </>
    )
}