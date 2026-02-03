import { createBrowserRouter } from "react-router";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import LiveStatus from "./pages/LiveStatus";
import Timeline from "./pages/Timeline";
import Activities from "./pages/Activities";
import GoodsTrade from "./pages/GoodsTrade";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "news/schedule", Component: Schedule },
      { path: "news/broadcast", Component: LiveStatus },
      { path: "news/twitter", Component: Timeline },
      { path: "activities", Component: Activities },
      { path: "others/goods", Component: GoodsTrade },
    ],
  },
]);