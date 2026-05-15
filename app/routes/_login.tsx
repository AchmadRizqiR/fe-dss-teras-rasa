import type { Route } from "./+types/_login";
import { Login } from "../login";
import AuthService from "../services/AuthService";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];    
}

export async function clientLoader() {
  if (AuthService.isAuthenticated()) {
    return redirect("/dashboard");
  }
}

export default function Index() {
  return < Login />
}
