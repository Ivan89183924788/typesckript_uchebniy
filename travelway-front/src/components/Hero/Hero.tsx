import { BookingPage } from "../BookingPage/BookingPage"
import { SearchForm } from "../SearchForm/SearchForm"
import { TransportTabs } from "../TransportTabs/TransporrtTabs"
import styles from "./Hero.module.css"
export function Hero(){
    return(
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                    Путешествуйте 

                    по воздуху и поездами
                    </h1>
                    <p className={styles.description}>
                    Быстрый поиск и выгодные цены 

                    на авиабилеты и ж/д билеты
                    </p>
                </div>
                <div className={styles.searchBlock}>
                    <TransportTabs/>
                    <SearchForm/>
                    
                </div>
                
            </div>
        </section>
    )
}