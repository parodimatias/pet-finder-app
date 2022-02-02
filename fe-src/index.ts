import "./router";
import "./pages/home-page";
import "./pages/report-pet";
import "./pages/test";
import "./pages/email-page";
import "./pages/password-page";
import "./pages/my-data";
import { headerComponent } from "./components/header";

import { state } from "./state";
(function () {
  headerComponent();
  state.init();
})();
