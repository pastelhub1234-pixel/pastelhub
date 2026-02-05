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
        
        {/* ✅ [수정] 너비 250px로 축소 (레퍼런스 이미지 비율) */}
        {!isMobile && (
          <aside className="flex-none w-[250px] border-r border-slate-200 bg-transparent">
            {/* sticky 컨테이너도 250px 고정 */}
            <div className="sticky top-[80px] h-[calc(100vh-80px)] w-[250px] py-6 pl-4 pr-3 overflow-hidden hover:overflow-y-auto no-scrollbar">
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