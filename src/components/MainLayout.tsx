import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
// import { MEMBERS } from '../constants'; // 제거됨
import { useJsonData } from '../hooks/useJsonData'; // 추가됨
import { Member } from '../types'; // 타입 정의 파일 경로에 맞게 수정 필요
import MemberCard from './MemberCard';

// 5대 핵심 기능 네비게이션 정의 (CSS 클래스 매핑으로 간소화)
const NAV_ITEMS = [
  { 
    path: '/news/schedule', 
    icon: Calendar, 
    label: '일정',
    theme: 'theme-schedule' // styles.css에 정의된 클래스
  },
  { 
    path: '/news/broadcast', 
    icon: Radio, 
    label: '방송',
    theme: 'theme-broadcast'
  },
  { 
    path: '/news/twitter', 
    icon: Twitter, 
    label: '타임라인',
    theme: 'theme-twitter'
  },
  { 
    path: '/activities', 
    icon: Zap, 
    label: '활동',
    theme: 'theme-activities'
  },
  { 
    path: '/others/goods', 
    icon: ShoppingBag, 
    label: '교환소',
    theme: 'theme-goods'
  },
];

export default function MainLayout() {
  const location = useLocation();

  // ✅ 1. JSON 데이터 Hook 사용 ('status' 키로 데이터 호출)
  const { data: members } = useJsonData<Member[]>('status');

  // ✅ 2. 방송 중인 멤버 필터링
  const liveMembers = members?.filter(
    (member) => member.status && (
      member.status.includes('LIVE') || 
      member.status.includes('SPACE') || 
      member.status.includes('X_live')
    )
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 font-sans text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100 shadow-sm supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group min-w-max">
              <div className="relative">
                <Sparkles className="size-6 text-indigo-400 transition-transform duration-500 group-hover:rotate-180" />
              </div>
              <h1 className="font-extrabold text-2xl tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
                <span className="text-slate-700">hub</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    // CSS Component 클래스 (.nav-item) + 테마 클래스 (.theme-xxx) 적용
                    className={`nav-item group ${item.theme} ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-icon-wrapper">
                      <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="text-sm font-medium transition-colors">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  // 모바일은 레이아웃이 다르므로 flex-col 등은 유지하되, 색상은 CSS 변수 활용
                  className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all flex-1 min-w-[60px] border border-transparent 
                    ${item.theme} 
                    ${isActive ? 'bg-white shadow-sm' : 'hover:bg-white/40'}`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-300 
                    ${isActive ? 'bg-[var(--theme-hover-bg)] text-[var(--theme-hover-text)]' : 'text-slate-400'}`}>
                    <Icon className={`size-5 mb-0.5 ${isActive ? 'scale-105' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] leading-none transition-colors 
                    ${isActive ? 'text-[var(--theme-text-active)] font-bold' : 'text-slate-400 font-medium'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 md:px-6 py-6 gap-6">
        
        {/* ✅ Sidebar - Desktop only (Left Side) */}
        <aside className="hidden lg:flex flex-col w-64 flex-none sticky top-24 h-fit">
          <div className="space-y-3">
            {/* 데이터 로딩 상태 처리 및 리스트 렌더링 */}
            {liveMembers.length > 0 ? (
              liveMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 rounded-2xl bg-white/40 border border-white/50 text-center backdrop-blur-sm">
                <Radio className="size-6 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-medium">
                  {members ? '현재 방송 중인\n멤버가 없습니다' : '로딩 중...'}
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content (Right Side) */}
        <main className="flex-1 min-w-0">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm p-6 min-h-[500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}