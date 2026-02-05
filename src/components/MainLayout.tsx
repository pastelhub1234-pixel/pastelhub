import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { AppSidebar } from './AppSidebar';

export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-[#f8f9fa]">
      <TopNavigation />

      {/* mx-auto만 유지하고 padding 제거 (내부에서 처리) */}
      <div className="flex flex-1 w-full max-w-[1700px] mx-auto">
        
        {!isMobile && (
          // ✅ [수정] 사이드바 너비를 270px로 살짝 늘림 (여백 포함)
          <aside className="flex-none w-[270px] border-r border-slate-200 bg-transparent">
            {/* ✅ [핵심 수정]
                - top-[100px]: 상단바 100px에 맞춤
                - pl-6: 왼쪽 안쪽 여백을 24px로 주어, 카드가 벽에서 확실히 떨어짐
                - pr-3: 오른쪽 스크롤바와의 간격
            */}
            <div className="sticky top-[100px] h-[calc(100vh-100px)] w-[270px] py-6 pl-6 pr-3 overflow-hidden hover:overflow-y-auto no-scrollbar">
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