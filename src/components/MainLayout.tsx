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

      {/* ✅ [핵심 수정] pl-6 추가
          - 메인 컨테이너 전체를 왼쪽에서 24px 떨어뜨립니다.
          - 이렇게 하면 사이드바가 왼쪽 벽에 절대 붙지 않습니다.
      */}
      <div className="flex flex-1 w-full max-w-[1700px] mx-auto pl-6">
        
        {!isMobile && (
          <aside className="flex-none w-[250px] border-r border-slate-200 bg-transparent">
            {/* ✅ [수정] 상단바 100px 대응
               - top-[100px]: 상단바 아래에 위치
               - pl-2: 왼쪽 여백이 이미 pl-6으로 확보되었으므로, 여기선 살짝만 조정
            */}
            <div className="sticky top-[100px] h-[calc(100vh-100px)] w-[250px] py-6 pl-2 pr-3 overflow-hidden hover:overflow-y-auto no-scrollbar">
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