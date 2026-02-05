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
        
        {/* ✅ [수정] 사이드바 표시 기준 완화
          - 기존: lg:block (1024px 이상)
          - 변경: md:block (768px 이상) -> 노트북/태블릿에서도 사이드바 보임!
          - w-[260px] xl:w-[300px]: 화면이 작을 땐 조금 좁게, 클 땐 넓게
        */}
        <aside className="hidden md:block flex-none w-[260px] xl:w-[300px] border-r border-transparent">
          <div className="sticky top-[80px] h-[calc(100vh-80px)] py-8 pl-6 pr-4 overflow-hidden hover:overflow-y-auto no-scrollbar">
            <AppSidebar />
          </div>
        </aside>

        {/* 3. 메인 콘텐츠 */}
        <main className="flex-1 min-w-0 px-4 py-8 md:px-10">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}