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
  
  // ✅ status.json 데이터 가져오기 (이름, 이미지, 상태 모두 포함됨)
  const { data: members } = useJsonData<Member[]>('status');

  // ✅ 방송 중인 멤버 필터링
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
            <Sparkles className="size-6 text-indigo-500 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* ✅ Desktop Navigation (고정 너비 & 파스텔 톤 적용) */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              // 현재 경로가 해당 메뉴의 경로로 시작하는지 확인
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex flex-col items-center justify-center 
                    w-[72px] h-[64px] rounded-2xl transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-500 font-medium'}
                  `}
                >
                  <Icon 
                    className={`size-5 mb-1 transition-transform group-hover:-translate-y-0.5 ${isActive ? 'fill-indigo-200' : ''}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-[11px] tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ================= Main Content Area ================= */}
      <div className="flex-1 flex justify-center w-full px-4 py-6">
        <div className="flex w-full max-w-[1200px] gap-6">
          
          {/* ✅ Sidebar (Left) - 요청하신 규격 및 디자인 적용 */}
          <aside className="hidden lg:flex flex-col w-[280px] flex-none sticky top-24 h-[calc(100vh-120px)]">
            {/* 요청하신 내부 간격: px-3 py-4, space-y-2 */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
              
              {/* 방송 중인 멤버 리스트 */}
              {liveMembers.length > 0 ? (
                liveMembers.map((member, idx) => (
                  <MemberCard key={`${member.name}-${idx}`} member={member} />
                ))
              ) : (
                // 방송 없음 상태 디자인
                <div className="flex flex-col items-center justify-center h-32 rounded-2xl border border-dashed border-slate-200 bg-white/50 text-center mx-1">
                  <div className="bg-slate-100 p-2 rounded-full mb-2">
                    <Radio className="size-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">현재 방송 중인 멤버가 없습니다.</p>
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