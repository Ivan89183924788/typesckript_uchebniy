import styles from "./Header.module.css"
export function Header(){
    return(
        <header className={styles.header}>
            <div className={styles.conteiner}>
                <a href="/" className={styles.logo}>
                <span className={styles.logoIcon}>🛩️</span>
                <span className={styles.logoText}>AviaJd</span>
                </a>

                <nav className={styles.navigation}>
                    <a href="#">Авиабилеты</a>
                    <a href="#">Ж/Д билеты</a>
                    <a href="#">Сервисы</a>
                    <a href="#">Информация</a>
                    <a href="#">О компании</a>
                    <a href="#">Мои бронирования</a>
                </nav>
                <div className={styles.actions}>
                      <button
                     type="button"
                    className={styles.themeButton}
                        aria-label="Сменить тему">
                        🌙
                    </button>

                    <button
                    type="button"
                    className={styles.languageButton}>
                        RU
                    <span>⬇️
                    </span>
                    </button>

                    <button
                     type="button"
                    className={styles.loginButton}>
                        Войти
                    </button>

                    <button
                     type="button"
                    className={styles.registerButton}>
                        Регистрация
                    </button>

                </div>
            </div>
        </header>
    )
}