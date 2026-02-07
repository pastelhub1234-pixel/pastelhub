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
    // ✅ 기본 스크롤 방식 (min-h-screen)
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-[#f8f9fa]">
      
      {/* sticky 헤더는 여기서 공간을 차지하므로 별도 pt 필요 없음 */}
      <TopNavigation />

      <div className="flex flex-1 w-full max-w-[1700px] mx-auto">
        
        {!isMobile && (
          <aside className="flex-none w-[250px] border-r border-slate-200 bg-transparent">
            {/* sticky top-[100px]: 상단바(100px) 아래에 붙음 */}
            <div className="sticky top-[100px] h-[calc(100vh-100px)] w-[250px] overflow-hidden">
              <AppSidebar />
            </div>
          </aside>
        )}

        <main className="flex-1 min-w-0 px-3 py-3.5 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
