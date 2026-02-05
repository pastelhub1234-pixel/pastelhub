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

      <div className="flex flex-1 w-full max-w-[1700px] mx-auto">
        
        {/* ✅ [수정] 사이드바 너비 강력 고정
            - flex-none: 늘어나지 않음
            - w-[300px]: 300px로 고정 (w-80은 320px이라 너무 넓을 수 있음)
        */}
        {!isMobile && (
          <aside className="flex-none w-[300px] border-r border-transparent">
            {/* sticky 컨테이너에도 동일한 너비 제한 적용 */}
            <div className="sticky top-[80px] h-[calc(100vh-80px)] w-[300px] py-8 pl-6 pr-4 overflow-hidden hover:overflow-y-auto no-scrollbar">
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