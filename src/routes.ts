import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import LiveStatus from "./pages/LiveStatus"; // 방송 페이지
import Timeline from "./pages/Timeline";     // 타임라인 페이지
import Activities from "./pages/Activities";
import GoodsTrade from "./pages/GoodsTrade"; // 교환소 페이지

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      // 1. 홈 (환영 문구 + 모바일 라이브 목록)
      { index: true, Component: Home },

      // 2. 일정 (기존 news/schedule -> schedule)
      { path: "schedule", Component: Schedule },

      // 3. 방송 (기존 news/broadcast -> broadcast)
      { path: "broadcast", Component: LiveStatus },

      // 4. 타임라인 (기존 news/twitter -> timeline)
      { path: "timeline", Component: Timeline },

      // 5. 활동 (변경 없음)
      { path: "activities", Component: Activities },

      // 6. 교환소 (기존 others/goods -> goods)
      { path: "goods", Component: GoodsTrade },
    ],
  },
]);
