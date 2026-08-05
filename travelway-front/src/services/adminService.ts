


// services/adminService.ts
import type { BookingWithTrip } from "../type/bookings";
import type { CreateTripFormData, AdminCreateUserFormData } from "../type/admin";
import type { LoginResponse } from "../type/auth";


function getCurrentAdmin() {
  const stored = localStorage.getItem("user");
  if (!stored) throw new Error("Пользователь не авторизован");

  const user = JSON.parse(stored) as LoginResponse; // тип уже содержит id и role

  if (user.role !== "admin") {
    throw new Error("У вас нет прав администратора");
  }
  return user;
}

/**
 * Вспомогательная функция для админ‑запросов:
 * - берёт id из localStorage,
 * - ставит заголовок X-Admin-Id,
 * - обрабатывает ошибки.
 */
async function adminFetch(
  url: string,
  options: RequestInit
): Promise<Response> {
  const admin = getCurrentAdmin(); // проверяет авторизацию и роль

  const headers = {
    "Content-Type": "application/json",
    "X-Admin-Id": String(admin.id),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 403) {
      throw new Error("Нет прав администратора");
    }
    throw new Error(error.detail || "Ошибка админ‑запроса");
  }
  return response;
}



// Создание пользователя (только для админа)
export async function createAdminUser(
  data: AdminCreateUserFormData
): Promise<any> {
  const response = await adminFetch("/api/admin/user", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await response.json();
}


// // Создание пользователя (только для админа)
// export async function deleteAdminUser(userId:number): Promise<any> {
//   const response = await adminFetch(`/api/admin/users/${userId}`, {
//     method: "DELETE",
//     body: JSON.stringify({}),
//   });
//   return await response.json();
// }


// Удаление пользователя
export async function deleteAdminUser(userId: number): Promise<void> {
  await adminFetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });
}

// Обновление поездки
export async function updateTrip(tripId: number, data: CreateTripFormData): Promise<any> {
  const response = await adminFetch(`/api/admin/trips/${tripId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
}

// Получение всех бронирований для админки
export async function getAllAdminBookings(): Promise<BookingWithTrip[]> {
  // Если этот эндпоинт тоже требует админ‑проверки — используй adminFetch.
  // Если он публичный или проверяется отдельно — оставь обычный fetch.
  const response = await adminFetch("/api/bookings/booking", {
    method: "GET",
  });

  const bookings: BookingWithTrip[] = await response.json();
  return bookings;
}


// Получение всех бронирований для админки
export async function getAllUsers(): Promise<AdminCreateUserFormData[]> {
  // Если этот эндпоинт тоже требует админ‑проверки — используй adminFetch.
  // Если он публичный или проверяется отдельно — оставь обычный fetch.
  const response = await adminFetch("/api/admin/users", {
    method: "GET",
  });

  const users: AdminCreateUserFormData[] = await response.json();
  return users;
}

// Оплата бронирования (админская операция)
export async function payForBooking(bookingId: number): Promise<void> {
  const response = await adminFetch(`/api/bookings/${bookingId}/pay`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  // Можно вернуть JSON, если бэкенд что‑то отдаёт
  await response.json().catch(() => null);
}

// Создание поездки (только для админа)
export async function createTrip(
  data: CreateTripFormData
): Promise<any> {
  const response = await adminFetch("/api/admin/trips", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await response.json();
}
