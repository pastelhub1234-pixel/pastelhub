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
        
        {!isMobile && (
          <aside className="flex-none w-[250px] border-r border-slate-200 bg-transparent">
            {/* ✅ [수정] 
                - top-[90px]: 상단바 90px에 맞춤
                - pl-6: 왼쪽 여백을 4(16px) -> 6(24px)으로 늘려 벽과의 간격 확보
            */}
            <div className="sticky top-[90px] h-[calc(100vh-90px)] w-[250px] py-6 pl-6 pr-3 overflow-hidden hover:overflow-y-auto no-scrollbar">
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