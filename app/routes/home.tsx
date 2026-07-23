// app/routes/index.tsx
import { redirect } from "react-router";
import AuthService from "../services/AuthService";
import type { Route } from "./+types/home";

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

  return redirect("/login");
}

export default function Index() {
  return null;
}
