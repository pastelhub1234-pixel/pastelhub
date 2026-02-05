import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { AppSidebar } from './AppSidebar';

export default function MainLayout() {
  // 모바일 여부 확인 (768px 미만)
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

      <div className="flex flex-1 w-full max-w-[1700px] mx-auto">
        
        {/* ✅ [수정] 너비를 표준 클래스 w-80 (320px)으로 고정 
            - 이전: w-[280px] (인식 실패 가능성 있음)
            - 변경: w-80 (확실하게 고정됨 -> 텍스트 말줄임 작동)
        */}
        {!isMobile && (
          <aside className="flex-none w-80 border-r border-transparent">
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