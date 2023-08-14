import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../layouts/DefaultLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("../views/LoginView.vue"),
      },
      {
        path: "registration",
        name: "Registration",
        component: () => import("../views/RegistrationView.vue"),
      },
    ],
  },
];

export default routes;
