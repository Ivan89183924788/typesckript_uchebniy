import { useState } from "react";
import styles from "./TransportTabs.module.css"
type TransportType="avia"|"train";
export function TransportTabs(){
    const[activTab,setActiveTab]=useState<TransportType>("avia");
    return(
        <div className={styles.tabs}>
            <button
            type="button"
            className={activTab==="avia"?`${styles.tab} ${styles.active}`
        :styles.tab}
        onClick={()=>setActiveTab("avia")}>
                ✈ Авиабилеты
            </button>
            <button
            type="button"
            className={activTab==="train"?`${styles.tab} ${styles.active}`
        :styles.tab}
        onClick={()=>setActiveTab("train")}>
                🚇 Ж/Д билеты
            </button>
        </div>
    )
}