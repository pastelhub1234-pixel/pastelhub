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
    // ✅ 2. 상단바 공간 확보 (pt-[100px])
    <div className="h-screen w-full overflow-hidden flex flex-col font-sans text-slate-900 bg-[#f8f9fa] pt-[100px]">
      
      {/* 상단바 (fixed 상태이므로 공간 차지 안 함 -> pt로 공간 확보) */}
      <TopNavigation />

      {/* 내부 레이아웃 컨테이너: 남은 높이를 꽉 채움 (h-full) */}
      <div className="flex flex-1 w-full max-w-[1700px] mx-auto h-full overflow-hidden">
        
        {/* 사이드바 영역 */}
        {!isMobile && (
          // h-full로 높이 채우고, sticky 대신 독립 스크롤 적용 가능
          <aside className="flex-none w-[250px] border-r border-slate-200 bg-transparent h-full">
            <div className="h-full w-full overflow-y-auto custom-scrollbar">
              <AppSidebar />
            </div>
          </aside>
        )}

        {/* ✅ 3. 메인 콘텐츠 영역 (이 부분만 스크롤 됨) */}
        {/* overflow-y-auto: 내용이 길어지면 여기서만 스크롤 발생 */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto px-4 py-8 md:px-10 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
