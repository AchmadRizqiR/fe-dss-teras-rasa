import DashboardIndex from "../dashboard";
import AuthService from "../services/AuthService";
import { redirect } from "react-router";

export async function clientLoader() {
  if (!AuthService.isAuthenticated()) {
    return redirect("/login");
  }
}

export default function Index() {
  return <DashboardIndex />;
}