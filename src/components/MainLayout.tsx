import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import { MEMBERS } from '../constants';
import MemberCard from './MemberCard';

// 5대 핵심 기능 네비게이션 정의
const NAV_ITEMS = [
  { 
    path: '/news/schedule', 
    icon: Calendar, 
    label: '일정',
    activeColor: 'text-sky-600', 
    activeBg: 'bg-sky-50 border-sky-100',
    hoverText: 'group-hover:text-sky-500'
  },
  { 
    path: '/news/broadcast', 
    icon: Radio, 
    label: '방송',
    activeColor: 'text-pink-500', 
    activeBg: 'bg-pink-50 border-pink-100',
    hoverText: 'group-hover:text-pink-500'
  },
  { 
    path: '/news/twitter', 
    icon: Twitter, 
    label: '타임라인',
    activeColor: 'text-violet-500', 
    activeBg: 'bg-violet-50 border-violet-100',
    hoverText: 'group-hover:text-violet-500'
  },
  { 
    path: '/activities', 
    icon: Zap, 
    label: '활동',
    activeColor: 'text-amber-500', 
    activeBg: 'bg-amber-50 border-amber-100',
    hoverText: 'group-hover:text-amber-500'
  },
  { 
    path: '/others/goods', 
    icon: ShoppingBag, 
    label: '교환소',
    activeColor: 'text-emerald-500', 
    activeBg: 'bg-emerald-50 border-emerald-100',
    hoverText: 'group-hover:text-emerald-500'
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
            <nav className="hidden md:flex items-center gap-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border
                      ${
                        isActive
                          ? `bg-white shadow-sm scale-105 ${item.activeColor} ${item.activeBg}`
                          : `bg-transparent border-transparent text-slate-500 hover:bg-white/50 ${item.hoverText}`
                      }`}
                  >
                    <Icon className={`size-4 ${isActive ? 'fill-current opacity-20' : ''}`} />
                    <span className="text-sm font-bold">{item.label}</span>
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
                  className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all flex-1 min-w-[60px]
                    ${
                      isActive
                        ? `bg-white shadow-sm ${item.activeColor} ${item.activeBg}`
                        : 'text-slate-400 hover:bg-white/40 hover:text-slate-600'
                    }`}
                >
                  <Icon className={`size-5 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[10px] font-medium leading-none">
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
        {/* 수정됨: w-72 -> w-64 (비율 축소), 상단 제목(On Air Now) 삭제 */}
        <aside className="hidden lg:flex flex-col w-64 flex-none sticky top-24 h-fit">
          <div className="space-y-3">
            {liveMembers.length > 0 ? (
              liveMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))
            ) : (
              // 방송 중인 멤버가 없을 때 표시 (심플하게 변경)
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