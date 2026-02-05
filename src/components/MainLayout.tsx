import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { AppSidebar } from './AppSidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-[#f8f9fa]">
      
      {/* 1. 상단바 */}
      <TopNavigation />

      {/* 2. 메인 컨테이너 */}
      <div className="flex flex-1 w-full max-w-[1700px] mx-auto">
        
        {/* 3. 사이드바 (PC 전용) */}
        {/* hidden lg:block: 모바일에선 숨기고, 큰 화면에서만 보임 */}
        {/* w-[280px]: 너비 고정 */}
        <aside className="hidden lg:block flex-none w-[280px]">
          {/* top-[80px]: 상단바 높이(80px)만큼 띄우고 고정 */}
          <div className="sticky top-[80px] h-[calc(100vh-80px)] py-6 pl-6 pr-2">
            <AppSidebar />
          </div>
        </aside>

        {/* 4. 메인 콘텐츠 */}
        <main className="flex-1 min-w-0 px-4 py-6 md:px-8">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}