import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { AppSidebar } from './AppSidebar';

export default function MainLayout() {
  // ✅ [전략 변경] "모바일인지 아닌지"만 판단합니다.
  // 초기값: 현재 창 너비가 768px보다 작으면 true (모바일)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      // 768px 미만이면 모바일(true), 아니면 PC(false)
      setIsMobile(window.innerWidth < 768);
    };

    // 창 크기 바뀔 때마다 감시
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-[#f8f9fa]">
      <TopNavigation />

      <div className="flex flex-1 w-full max-w-[1700px] mx-auto">
        
        {/* ✅ [강제 렌더링] 
            "모바일이 아니면(!isMobile)" 무조건 사이드바를 보여줍니다.
            CSS 클래스(hidden)에 의존하지 않으므로 무조건 뜹니다.
        */}
        {!isMobile && (
          <aside className="flex-none w-[280px] xl:w-[300px] border-r border-transparent">
            <div className="sticky top-[80px] h-[calc(100vh-80px)] py-8 pl-8 pr-4 overflow-hidden hover:overflow-y-auto no-scrollbar">
              <AppSidebar />
            </div>
          </aside>
        )}

        <main className="flex-1 min-w-0 px-4 py-8 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
