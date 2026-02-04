import { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData'; 
import MemberCard from '../components/MemberCard';
import { Member, NavItem } from '../types';

// 네비게이션 설정
const NAV_ITEMS: NavItem[] = [
  { path: '/news/schedule', icon: Calendar, label: '일정' },
  { path: '/news/broadcast', icon: Radio, label: '방송' },
  { path: '/news/twitter', icon: Twitter, label: '타임라인' },
  { path: '/activities', icon: Zap, label: '활동' },
  { path: '/others/goods', icon: ShoppingBag, label: '교환소' },
];

export default function MainLayout() {
  const location = useLocation();
  const { data: members } = useJsonData<Member[]>('status');

  const liveMembers = useMemo(() => {
    return members?.filter(member => 
      member.status && member.status.toLowerCase().includes('live')
    ) || [];
  }, [members]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-gray-50/50">
      
      {/* ================= Header ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-[72px] flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Sparkles className="size-7 text-indigo-500 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* ✅ Desktop Navigation 수정됨 */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  // ✅ w-[84px]: 너비를 84px로 늘려 '타임라인'도 넉넉하게 들어감 (모두 동일 크기)
                  // ✅ flex-col: 아이콘 위, 텍스트 아래 배치 복구
                  className={`
                    flex flex-col items-center justify-center 
                    w-[84px] h-[64px] rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-600 font-bold' // 활성 상태
                      : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-500 font-medium'} // 비활성 상태
                  `}
                >
                  {/* 아이콘 크기 size-6 (24px)로 통일 */}
                  <Icon className={`size-6 mb-1 ${isActive ? 'fill-indigo-100' : ''}`} />
                  <span className="text-[11px] tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>
      </header>

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex justify-center w-full px-4 py-6">
        <div className="flex w-full max-w-[1200px] gap-6">
          
          {/* Sidebar (Left) */}
          <aside className="hidden lg:flex flex-col w-[280px] flex-none sticky top-24 h-[calc(100vh-120px)]">
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
              
              {/* 방송 리스트 */}
              {liveMembers.length > 0 ? (
                liveMembers.map((member, idx) => (
                  <MemberCard key={`${member.name}-${idx}`} member={member} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 rounded-2xl border border-dashed border-slate-200 bg-white/50 text-center mx-1">
                  <div className="bg-slate-100 p-2 rounded-full mb-2">
                    <Radio className="size-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">방송 중인 멤버가 없습니다.</p>
                </div>
              )}
            </div>
          </aside>

          {/* Center Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
          
        </div>
      </div>
    </div>
  );
}