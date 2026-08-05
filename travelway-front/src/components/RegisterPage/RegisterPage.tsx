//components/RegisterPage/RegisterPage.tsx
import { useState, type FormEvent } from "react"
import styles from "./RegisterPage.module.css"
import { useNavigate,Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
export function RegisterPage(){
    const[full_name,setFullName]=useState("");
    const[phone,setPhone]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[repeatPassword,setRepeatPassword]=useState("");
    const[isLoading,setIsLoading]=useState(false);
    const[error,setError]=useState("");
    const navigate=useNavigate();
    async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");
        if(password!==repeatPassword){
            setError("Пароли не совпадают");
            return;
        }
        try {
           setIsLoading(true);
           await registerUser({
            full_name:full_name,
            phone:phone,
            email:email,
            password:password,
            role:"user"
           })
           navigate("/login")
        } catch (error) {
            if(error instanceof Error){
                setError(error.message);

            }
            else{
                setError("Неизвестная ошибка")
            }
        }finally{
            setIsLoading(false);
        }
    }
    return(
        <main className={styles.page}>
            <section className={styles.card}>
                <div className={styles.heading}>
                    <h1>Создать аккаунт</h1>
                    <p>
                        Зарегистрируйтесь что бы покупать билеты
                    </p>
                </div>
                <form 
                className={styles.form}
                onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span>Фио</span>
                        <input type="text"
                        placeholder="Введите ФИО" 
                        required
                        onChange={(event)=>setFullName(event.target.value)}/>
                    </label>
                    <label className={styles.field}>
                        <span>Телефон</span>
                        <input type="tel"
                        placeholder="+7 999 999 99 99"
                        required
                        onChange={(event)=>setPhone(event.target.value)} />
                    </label>
                    <label className={styles.field}>
                        <span>Email</span>
                        <input type="email"
                        placeholder="Введите email" 
                        required
                        onChange={(event)=>setEmail(event.target.value)}/>
                    </label>
                    <label className={styles.field}>
                        <span>Password</span>
                        <input type="password"
                        placeholder="минимум 6 символов"
                        minLength={6}
                        required
                        onChange={(event)=>setPassword(event.target.value)}
                        />
                    </label>
                    <label className={styles.field}>
                        <span>Repeat password</span>
                        <input type="password"
                        placeholder="Повторите пароль"
                        minLength={6}
                        required
                        onChange={(event)=>setRepeatPassword(event.target.value)}/>
                    </label>
                    {error&&(
                        <p className={styles.error}>
                            {error}
                        </p>
                    )}
                    <button className={styles.submitButton}
                    type="submit"
                    disabled={isLoading}>
                        {isLoading?"Регистрация...":"Зарегистрироваться"}
                        
                    </button>
                </form>
                <p className={styles.loginText}>
                    Уже есть аккаунт?{" "}
                    <Link to="/login">
                    Войти
                    </Link>
                </p>
            </section>
        </main>
    )
}