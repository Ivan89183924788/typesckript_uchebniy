import styles from "./TransportTabs.module.css"
import { useState } from "react";
type TransportType="avia"|"train";
export function TransportTabs(){
    const [activTab,setActivTab]=useState<TransportType>("avia");
    return(
        <div className={styles.tabs}>
            <button
            type="button"
            className={activTab==="avia"?`${styles.tab} ${styles.active}`
        :styles.tab}
        onClick={()=>setActivTab("avia")}>
            🛩️ Авиабилеты
            </button>
             <button
            type="button"
            className={activTab==="train"?`${styles.tab} ${styles.active}`
        :styles.tab}
        onClick={()=>setActivTab("train")}>
            Ж/Д билеты
            </button>
        </div>
    )
}