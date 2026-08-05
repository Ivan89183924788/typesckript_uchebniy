//services/authServices.ts
import type { LoginData, LoginResponse, RegisterData, User } from "../type/auth";

export async function registerUser(data:RegisterData):Promise<User>{
    const response=await fetch("/api/auth/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    if(!response.ok){
        const error=await response.json();
        throw new Error(error.detail||"Ошибка регистрации");  
    }
    const user:User=await response.json();
    return user;
}
// export async function loginUser(data:LoginData):Promise<LoginResponse>{
//     const response=await fetch("/api/auth/login",{
//         method:"POST",
//         headers:{
//             "Content-Type":"application/json",
//         },
//         body:JSON.stringify(data),
//     });
//     if(!response.ok){
//         const error=await response.json();
//         throw new Error(error.detail||"Ошибка Авторизации");  
//     }
//     const result:LoginResponse=await response.json();
//     return result;
// }

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Ошибка авторизации");
  }

  const result: LoginResponse = await response.json();

  // Сохраняем в localStorage для проверки роли и отправки admin_id
  localStorage.setItem("user", JSON.stringify(result));

  return result;
}
