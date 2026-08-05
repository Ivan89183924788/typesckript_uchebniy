



import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";

import type { BookingWithTrip } from "../../type/bookings";
import type { CreateTripFormData, AdminCreateUserFormData } from "../../type/admin";
import type { User } from "../../type/auth";

import {
  getAllAdminBookings,
  payForBooking,
  createAdminUser,
  createTrip,
  deleteAdminUser,
  getAllUsers,
  updateTrip,
} from "../../services/adminService";

export function AdminPage() {
  const [bookings, setBookings] = useState<BookingWithTrip[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Форма поездки (создание/редактирование)
  const [tripForm, setTripForm] = useState<CreateTripFormData>({
    from_city: "",
    to_city: "",
    price: 0,
    departure_date: "",
    departure_time: "",
    carrier: "",
    transport: "",
  });
  const [editTripId, setEditTripId] = useState<number | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);

  // Форма создания пользователя
  const [userForm, setUserForm] = useState<AdminCreateUserFormData>({
    email: "",
    full_name: "",
    phone: "",
    role: "user",
    password: "",
  });
  const [showUserForm, setShowUserForm] = useState(false);

  // Форма удаления пользователя
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const savedUserIdStr = localStorage.getItem("userId");
        const savedRoleStr = localStorage.getItem("role");

        if (!savedUserIdStr || !savedRoleStr) {
          setError("Пользователь не авторизован");
          return;
        }

        const savedUserId = Number(savedUserIdStr);
        const savedRole = savedRoleStr as "admin" | "user";

        setUser({
          id: savedUserId,
          email: "",
          full_name: "",
          phone: "",
          role: savedRole,
        });

        if (savedRole !== "admin") {
          setError("Доступ запрещён: требуется роль администратора");
          return;
        }

        const [allBookings, allUsers] = await Promise.all([
          getAllAdminBookings(),
          getAllUsers(),
        ]);

        setBookings(allBookings);
        setUsers(allUsers);
      } catch (err) {
        console.error("AdminPage error:", err);
        setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleAdminPay = async (bookingId: number) => {
    try {
      if (!user) throw new Error("Пользователь не найден");
      await payForBooking(bookingId, user.id);
      const updatedBookings = await getAllAdminBookings();
      setBookings(updatedBookings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка подтверждения оплаты");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) {
      setError("Укажите ID пользователя для удаления");
      return;
    }
    try {
      await deleteAdminUser(deleteUserId, user?.id ?? 0);
      alert("Пользователь удалён");
      setShowDeleteForm(false);
      setDeleteUserId(null);
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось удалить пользователя");
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTrip(tripForm);
      alert("Поездка успешно создана");
      resetTripForm();
      const updatedBookings = await getAllAdminBookings();
      setBookings(updatedBookings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать поездку");
    }
  };

  const resetTripForm = () => {
    setTripForm({
      from_city: "",
      to_city: "",
      price: 0,
      departure_date: "",
      departure_time: "",
      carrier: "",
      transport: "",
    });
    setEditTripId(null);
    setShowTripForm(false);
  };

  const handleEditTrip = (trip: NonNullable<BookingWithTrip["trip"]>) => {
    // При редактировании подставляем ВСЕ поля, чтобы можно было менять любые данные
    setEditTripId(trip.id);
    setTripForm({
      from_city: trip.from_city,
      to_city: trip.to_city,
      price: trip.price,
      departure_date: trip.departure_date,
      departure_time: trip.departure_time,
      carrier: trip.carrier,
      transport: trip.transport,
    });
    setShowTripForm(true);
  };

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTripId) return;
    try {
      await updateTrip(editTripId, tripForm);
      alert("Поездка обновлена");
      resetTripForm();
      const updatedBookings = await getAllAdminBookings();
      setBookings(updatedBookings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить поездку");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend: AdminCreateUserFormData = {
      email: userForm.email,
      full_name: userForm.full_name,
      phone: userForm.phone,
      role: "user",
      password: userForm.password,
    };

    try {
      await createAdminUser(dataToSend);
      alert("Пользователь успешно создан");
      setUserForm({
        email: "",
        full_name: "",
        phone: "",
        role: "user",
        password: "",
      });
      setShowUserForm(false);
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать пользователя");
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <Link to="/login">Войти снова</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>Панель администратора</h1>
          <p>Управление бронированиями, пользователями и рейсами</p>
        </div>

        <div className={styles.homeLink}>
          <Link to="/">На главную</Link>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => {
              setEditTripId(null);
              setShowTripForm(!showTripForm);
              setShowUserForm(false);
              setShowDeleteForm(false);
            }}
          >
            {showTripForm ? "Скрыть форму поездки" : "Создать/редактировать поездку"}
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => {
              setShowUserForm(!showUserForm);
              setShowTripForm(false);
              setShowDeleteForm(false);
            }}
          >
            {showUserForm ? "Скрыть форму пользователя" : "Создать пользователя"}
          </button>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.dangerButton}`}
            onClick={() => {
              setShowDeleteForm(!showDeleteForm);
              setShowTripForm(false);
              setShowUserForm(false);
            }}
          >
            {showDeleteForm ? "Скрыть удаление пользователя" : "Удалить пользователя"}
          </button>
        </div>

        {/* Форма поездки */}
        {showTripForm && (
          <form onSubmit={editTripId ? handleUpdateTrip : handleCreateTrip} className={styles.form}>
            <h3 className={styles.sectionTitle}>
              {editTripId ? `Редактирование поездки #${editTripId}` : "Создать поездку"}
            </h3>
            <div className={styles.row}>
              <div className={styles.halfField}>
                <span>Город отправления</span>
                <input
                  required
                  value={tripForm.from_city}
                  onChange={(e) => setTripForm({ ...tripForm, from_city: e.target.value })}
                  placeholder="Москва"
                />
              </div>
              <div className={styles.halfField}>
                <span>Город прибытия</span>
                <input
                  required
                  value={tripForm.to_city}
                  onChange={(e) => setTripForm({ ...tripForm, to_city: e.target.value })}
                  placeholder="Санкт-Петербург"
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.halfField}>
                <span>Цена (₽)</span>
                <input
                  type="number"
                  required
                  value={tripForm.price}
                  onChange={(e) => setTripForm({ ...tripForm, price: Number(e.target.value) })}
                />
              </div>
              <div className={styles.halfField}>
                <span>Перевозчик</span>
                <input
                  required
                  value={tripForm.carrier}
                  onChange={(e) => setTripForm({ ...tripForm, carrier: e.target.value })}
                  placeholder="Аэрофлот"
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.halfField}>
                <span>Тип транспорта</span>
                <input
                  required
                  value={tripForm.transport}
                  onChange={(e) => setTripForm({ ...tripForm, transport: e.target.value })}
                  placeholder="Авиа"
                />
              </div>
              <div className={styles.halfField}>
                <span>Дата отправления</span>
                <input
                  type="date"
                  value={tripForm.departure_date}
                  onChange={(e) => setTripForm({ ...tripForm, departure_date: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.field}>
              <span>Время отправления</span>
              <input
                required
                type="text"
                value={tripForm.departure_time}
                onChange={(e) => setTripForm({ ...tripForm, departure_time: e.target.value })}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              {editTripId ? "Обновить поездку" : "Создать поездку"}
            </button>
            {editTripId && (
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => resetTripForm()}
              >
                Отмена редактирования
              </button>
            )}
          </form>
        )}

        {/* Форма создания пользователя */}
        {showUserForm && (
          <form onSubmit={handleCreateUser} className={styles.form}>
            <h3 className={styles.sectionTitle}>Создать пользователя</h3>
            <div className={styles.field}>
              <span>Email</span>
              <input
                required
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div className={styles.field}>
              <span>ФИО</span>
              <input
                required
                value={userForm.full_name}
                onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                placeholder="Иванов Иван Иванович"
              />
            </div>
            <div className={styles.field}>
              <span>Телефон</span>
              <input
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                placeholder="+79990000000"
              />
            </div>
            <div className={styles.field}>
              <span>Пароль</span>
              <input
                required
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Создать пользователя
            </button>
          </form>
        )}

        {/* Форма удаления пользователя */}
        {showDeleteForm && (
          <form onSubmit={(e) => { e.preventDefault(); handleDeleteUser(); }} className={styles.form}>
            <h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>Удалить пользователя</h3>
            <p className={styles.warningText}>
              Это действие нельзя отменить. Удаление затронет все связанные данные.
            </p>
            <div className={styles.field}>
              <span>ID пользователя для удаления</span>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={deleteUserId ?? ""}
                onChange={(e) =>
                  setDeleteUserId(e.target.value ? Number(e.target.value) : null)
                }
                placeholder="Например: 5"
              />
            </div>
            <button type="submit" className={`${styles.submitButton} ${styles.dangerButton}`}>
              Подтвердить удаление
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setShowDeleteForm(false);
                setDeleteUserId(null);
              }}
            >
              Отмена
            </button>
          </form>
        )}

        {/* Список пользователей */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>Пользователи</h2>
          {users.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>ФИО</th>
                  <th>Роль</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.full_name}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.message}>Пользователей пока нет</p>
          )}
        </section>
               {!error && bookings.length > 0 && (
            <div className={styles.list}>
             {bookings.map((b) => (
              <div key={b.id} className={styles.card}>
                <div className={styles.tripInfo}>
                  <span className={styles.bookingNumber}>ID Бронирования: #{b.id}</span>
                  <h2>
                    {b.trip?.from_city} → {b.trip?.to_city}
                  </h2>
                  <p>Пользователь: ID {b.user_id}</p>
                  <p>
                    Статус оплаты:{' '}
                    <span
                      style={{ fontWeight: 'bold', color: b.is_paid ? '#2ecc71' : '#e74c3c' }}
                    >
                      {b.is_paid ? 'Оплачено' : 'Не оплачено'}
                    </span>
                  </p>
                </div>
                <div className={styles.priceBlock}>
                  <span>Стоимость: {b.trip?.price.toLocaleString('ru-RU')} ₽</span>
                  {!b.is_paid && (
                    <button
                      type="button"
                      className={styles.payButton}
                      onClick={() => handleAdminPay(b.id)}
                    >
                      Подтвердить оплату
                    </button>
                  )}
                  {b.is_paid && (
                    <div className={styles.paidNotice}>
                      Оплата подтверждена администратором
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!error && bookings.length === 0 && !isLoading && (
          <p className={styles.message}>Бронирований пока нет</p>
        )}
      </div>
    </div>
  );
}


       