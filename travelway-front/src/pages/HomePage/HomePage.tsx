

import { Header } from "../../components/Header/Header"
import { Hero } from "../../components/Hero/Hero"
import styles from "./HomePage.module.css"
export function HomePage(){
    return(
        <div className={styles.page}>
            <Header/>
            <main className={styles.main}>
                <Hero/>
            </main> 
        </div>
    )
}