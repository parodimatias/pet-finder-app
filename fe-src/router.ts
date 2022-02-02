import { Router } from "@vaadin/router";
import "./pages/home-page";
import "./pages/report-pet";
const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/report-pet", component: "report-pet" },
  { path: "/test-pet", component: "test-pet" },
  { path: "/email-page", component: "email-page" },
  { path: "/password-page", component: "password-page" },
  { path: "/my-data", component: "my-data" },
]);
