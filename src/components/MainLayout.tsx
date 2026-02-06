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

      {/* ✅ [수정] pl-6 제거 (AppSidebar 내부 px-3에 맡김) */}
      <div className="flex flex-1 w-full max-w-[1700px] mx-auto">
        
        {!isMobile && (
          <aside className="flex-none w-[250px] border-r border-slate-200 bg-transparent">
            {/* ✅ [수정] 
                - py, pl 제거: AppSidebar 내부 padding과 충돌 방지 
                - h-[calc(100vh-100px)]: 높이만 잡아주고 내부는 AppSidebar에 위임
            */}
            <div className="sticky top-[100px] h-[calc(100vh-100px)] w-[250px] overflow-hidden">
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