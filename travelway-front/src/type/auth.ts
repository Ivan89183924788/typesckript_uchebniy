//type/auth.ts
export interface RegisterData{
    email:string;
    password:string;
    full_name:string;
    phone:string;
    role:string;
}
export interface User{
    id:number;
    email:string;
    full_name:string;
    phone:string;
    role: 'user' | 'admin';
    
}
export interface LoginData{
    email:string;
    password:string;
}
// export interface LoginResponse{
   
//     user_id:number;
// } 
export interface LoginResponse extends User {}