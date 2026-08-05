// components/LoginPage/LoginPage.tsx
import { useState, type FormEvent } from "react";
import styles from "./LoginPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      setIsLoading(true);

      // Вызываем loginUser — он делает запрос на бэкенд
      const user = await loginUser({ email, password });

      // Сохраняем только то, что нужно для теста ролей (без токена!)
      if (user.id === undefined) {
        throw new Error("Сервер не вернул user_id — проверь бэкенд");
      }

      localStorage.setItem("userId", String(user.id));
      localStorage.setItem("role", user.role || "user"); // По умолчанию user, если роль не пришла

      // Убрал сохранение message — это не нужно для авторизации и часто вызывает ошибки
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Неизвестная ошибка при входе");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.heading}>
          <h1>Войти в аккаунт</h1>
          <p>Войдите, чтобы управлять бронированием</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              placeholder="example@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Пароль</span>
            <input
              type="password"
              placeholder="••••••••"
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className={styles.loginText}>
          Нет аккаунта?{" "}
          <Link to="/register">Зарегистрироваться</Link>
        </p>
      </section>
    </main>
  );
}
