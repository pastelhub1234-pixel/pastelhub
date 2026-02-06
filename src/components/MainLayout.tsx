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
    // ✅ 1. 전체 화면 고정 (h-screen, overflow-hidden)
    // pt-[100px]로 상단바 공간 확보
    <div className="h-screen w-full overflow-hidden flex flex-col font-sans text-slate-900 bg-[#f8f9fa] pt-[100px]">
      
      {/* 상단바 (fixed 상태임) */}
      <TopNavigation />

      {/* 내부 레이아웃 컨테이너 */}
      {/* h-full을 줘서 남은 높이(100vh - 100px)를 꽉 채움 */}
      <div className="flex flex-1 w-full max-w-[1700px] mx-auto h-full overflow-hidden">
        
        {/* 사이드바 영역 */}
        {!isMobile && (
          <aside className="flex-none w-[250px] border-r border-slate-200 bg-transparent h-full">
            {/* ✅ 2. 사이드바도 독립 스크롤 (sticky 필요 없음) */}
            {/* h-full로 높이 채우고, 내용 많으면 overflow-y-auto */}
            <div className="h-full w-full overflow-y-auto custom-scrollbar">
              <AppSidebar />
            </div>
          </aside>
        )}

        {/* ✅ 3. 메인 콘텐츠 영역 (여기에만 스크롤 적용) */}
        {/* flex-1: 남은 너비 차지 */}
        {/* h-full: 남은 높이 차지 */}
        {/* overflow-y-auto: 내용이 길어지면 여기서만 스크롤 생김 */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto px-4 py-8 md:px-10 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
