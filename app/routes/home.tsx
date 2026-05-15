// app/routes/index.tsx
import { redirect } from "react-router";
import AuthService from "../services/AuthService";

export async function clientLoader() {
  if (AuthService.isAuthenticated()) {
    return redirect("/dashboard");
  }

  return redirect("/login");
}

export default function Index() {
  return null; 
}