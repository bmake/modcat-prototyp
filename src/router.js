import Vue from "vue";
import Router from "vue-router";
import Index from "./views/Index.vue";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Profile from "./views/Profile.vue";
import MainNavbar from "./layout/MainNavbar.vue";
import MainFooter from "./layout/MainFooter.vue";
import Starter from "./views/Starter";
import Navigation from "./views/Navigation";
import Browsing from "./views/Browsing";
import Dokumentieren from "./views/Dokumentieren";
import Search from "./views/Search.vue";
import Filter from "./views/Filter";
import NavGraph from "./views/NavGraph";
import Report from "./views/Report.vue";
import Modul from "./views/Modul.vue";


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      components: { default: Navigation, header: '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/starter",
      name: "starter",
      components: { default: Starter, header:  '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/dokumentieren",
      name: "dokumentieren",
      components: { default: Dokumentieren, header:  '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/browsing",
      name: "browsing",
      components: { default: Browsing, header:  '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/browsing/search",
      name: "search",
      components: { default: Search, header:  '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/browsing/filter",
      name: "filter",
      components: { default: Filter, header:  '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/browsing/navgraph",
      name: "navgraph",
      components: { default: NavGraph, header:  '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/browsing/report",
      name: "report",
      components: { default: Report, header:  '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/browsing/modul/:code",
      name: "modul",
      components: { default: Modul, header:  '', footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
