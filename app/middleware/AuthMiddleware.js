// app/middleware/authMiddleware.js
import { redirect } from "react-router";
import AuthService from "../services/AuthService";

export async function authClientMiddleware({ request }, next) {
  // Panggil service, kalau nggak auth, tendang ke login
  if (!AuthService.isAuthenticated()) {
    throw redirect("/login");
  }
  
  // Lanjut ke halaman kalau aman
  await next(); 
}