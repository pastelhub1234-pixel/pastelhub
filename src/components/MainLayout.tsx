import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import { MEMBERS } from '../constants';
import MemberCard from './MemberCard';

// 5대 핵심 기능 네비게이션 정의 (스타일 확장)
const NAV_ITEMS = [
  { 
    path: '/news/schedule', 
    icon: Calendar, 
    label: '일정',
    // Active 상태: 흰색 배경 + Sky 색상 링/테두리
    activeContainer: 'bg-white/90 border-sky-200 shadow-sm ring-1 ring-sky-100',
    // Hover 상태: 연한 배경 + Sky 색상 테두리
    hoverContainer: 'hover:bg-white/80 hover:border-sky-100 hover:shadow-sm',
    // Icon Active: 그라데이션 배경 + 흰색 아이콘
    iconActive: 'bg-gradient-to-br from-sky-400 to-blue-500 shadow-sky-200 text-white shadow-sm',
    // Icon Inactive: 기본 회색 -> 호버 시 Sky 색상
    iconInactive: 'bg-transparent text-slate-400 group-hover:text-sky-500 group-hover:bg-sky-50',
    // Text Active
    textActive: 'text-sky-900 font-bold'
  },
  { 
    path: '/news/broadcast', 
    icon: Radio, 
    label: '방송',
    activeContainer: 'bg-white/90 border-pink-200 shadow-sm ring-1 ring-pink-100',
    hoverContainer: 'hover:bg-white/80 hover:border-pink-100 hover:shadow-sm',
    iconActive: 'bg-gradient-to-br from-pink-400 to-rose-500 shadow-pink-200 text-white shadow-sm',
    iconInactive: 'bg-transparent text-slate-400 group-hover:text-pink-500 group-hover:bg-pink-50',
    textActive: 'text-pink-900 font-bold'
  },
  { 
    path: '/news/twitter', 
    icon: Twitter, 
    label: '타임라인',
    activeContainer: 'bg-white/90 border-violet-200 shadow-sm ring-1 ring-violet-100',
    hoverContainer: 'hover:bg-white/80 hover:border-violet-100 hover:shadow-sm',
    iconActive: 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-violet-200 text-white shadow-sm',
    iconInactive: 'bg-transparent text-slate-400 group-hover:text-violet-500 group-hover:bg-violet-50',
    textActive: 'text-violet-900 font-bold'
  },
  { 
    path: '/activities', 
    icon: Zap, 
    label: '활동',
    activeContainer: 'bg-white/90 border-amber-200 shadow-sm ring-1 ring-amber-100',
    hoverContainer: 'hover:bg-white/80 hover:border-amber-100 hover:shadow-sm',
    iconActive: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200 text-white shadow-sm',
    iconInactive: 'bg-transparent text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50',
    textActive: 'text-amber-900 font-bold'
  },
  { 
    path: '/others/goods', 
    icon: ShoppingBag, 
    label: '교환소',
    activeContainer: 'bg-white/90 border-emerald-200 shadow-sm ring-1 ring-emerald-100',
    hoverContainer: 'hover:bg-white/80 hover:border-emerald-100 hover:shadow-sm',
    iconActive: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200 text-white shadow-sm',
    iconInactive: 'bg-transparent text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50',
    textActive: 'text-emerald-900 font-bold'
  },
];

export default function MainLayout() {
  const location = useLocation();

  // 방송 중인 멤버 필터링
  const liveMembers = MEMBERS.filter(
    (member) => member.status && (member.status.includes('LIVE') || member.status.includes('SPACE') || member.status.includes('X_live'))
  );

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
                    className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 border
                      ${isActive 
                        ? item.activeContainer 
                        : `border-transparent ${item.hoverContainer}`
                      }`}
                  >
                    {/* Icon Wrapper: Active시 그라데이션, Inactive시 투명 */}
                    <div className={`p-1.5 rounded-lg transition-all duration-300 
                      ${isActive ? item.iconActive : item.iconInactive}`}>
                      <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    
                    <span className={`text-sm transition-colors duration-300 ${isActive ? item.textActive : 'text-slate-500 group-hover:text-slate-700 font-medium'}`}>
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
                  className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all flex-1 min-w-[60px] border
                    ${isActive 
                      ? item.activeContainer
                      : `border-transparent ${item.hoverContainer}`
                    }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-300 
                    ${isActive ? item.iconActive : item.iconInactive}`}>
                    <Icon className={`size-5 mb-0.5 ${isActive ? 'scale-105' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] leading-none transition-colors ${isActive ? item.textActive : 'text-slate-400 font-medium'}`}>
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
            {liveMembers.length > 0 ? (
              liveMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 rounded-2xl bg-white/40 border border-white/50 text-center backdrop-blur-sm">
                <Radio className="size-6 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-medium">현재 방송 중인<br/>멤버가 없습니다</p>
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