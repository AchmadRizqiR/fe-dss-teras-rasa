import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/_login.tsx"),
  route("dashboard", "routes/_dashboard.tsx"),
] satisfies RouteConfig;