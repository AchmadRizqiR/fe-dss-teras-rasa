import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

import { redirect } from "react-router";

export function loader() {
  return redirect("/dashboard");
}

export default function Home() {
  return null;
}

// export default function Home() {
//   return <Welcome />;
// }
