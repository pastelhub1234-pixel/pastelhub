import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { AppSidebar } from './AppSidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-[#f8f9fa]">
      <TopNavigation />

      <div className="flex flex-1 w-full max-w-[1700px] mx-auto">
        {/* ✅ [수정] 사이드바 표시 기준: md(768px) 이상으로 변경 
            -> 노트북에서 사이드바가 안 나오는 문제 해결 */}
        <aside className="hidden md:block flex-none w-[280px] xl:w-[300px] border-r border-transparent">
          <div className="sticky top-[80px] h-[calc(100vh-80px)] py-8 pl-8 pr-4 overflow-hidden hover:overflow-y-auto no-scrollbar">
            <AppSidebar />
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-4 py-8 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
