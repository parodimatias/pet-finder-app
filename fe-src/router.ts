import { Router } from "@vaadin/router";
const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/report-pet", component: "report-pet" },
  { path: "/edit-pet", component: "edit-pet" },
  { path: "/test-pet", component: "test-pet" },
  { path: "/email-page", component: "email-page" },
  { path: "/password-page", component: "password-page" },
  { path: "/my-data", component: "my-data" },
  { path: "/my-reportedpets", component: "my-reportedpets" },
]);
``;
