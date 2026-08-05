// src/type/admin.ts (создай новый файл или добавь в существующий)
import type { RegisterData } from "./auth";

export interface CreateTripFormData {
  from_city: string;
  to_city: string;
  price: number;
  departure_date: string;          // YYYY-MM-DD
  departure_time: string;          // HH:mm
  return_date?: string;
  return_time?: string;
  carrier?: string;
  transport?: string;
}

// Для формы создания пользователя в админке
export interface AdminCreateUserFormData extends RegisterData {
  role: "user" | "admin";
}
