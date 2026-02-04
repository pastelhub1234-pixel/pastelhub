import { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData'; 
import MemberCard from './MemberCard';
import { Member } from '../types';

const NAV_ITEMS = [
  { path: '/news/schedule', icon: Calendar, label: '일정', themeColor: 'blue' },
  { path: '/news/broadcast', icon: Radio, label: '방송', themeColor: 'rose' },
  { path: '/news/twitter', icon: Twitter, label: '타임라인', themeColor: 'violet' },
  { path: '/activities', icon: Zap, label: '활동', themeColor: 'amber' }, 
  { path: '/others/goods', icon: ShoppingBag, label: '교환소', themeColor: 'emerald' },
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
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-[72px] flex items-center justify-between">
          
          {/* ✅ 로고 영역: 요청하신 코드로 교체 완료 */}
          <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
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
              
              const themeStyles: any = {
                blue:    { activeIcon: 'from-blue-400 to-cyan-400 shadow-blue-200', activeText: 'text-blue-600', ring: 'ring-blue-100', border: 'border-blue-100' },
                rose:    { activeIcon: 'from-rose-400 to-pink-400 shadow-rose-200', activeText: 'text-rose-600', ring: 'ring-rose-100', border: 'border-rose-100' },
                violet:  { activeIcon: 'from-violet-400 to-purple-400 shadow-violet-200', activeText: 'text-violet-600', ring: 'ring-violet-100', border: 'border-violet-100' },
                amber:   { activeIcon: 'from-amber-400 to-orange-400 shadow-amber-200', activeText: 'text-amber-600', ring: 'ring-amber-100', border: 'border-amber-100' },
                emerald: { activeIcon: 'from-emerald-400 to-teal-400 shadow-emerald-200', activeText: 'text-emerald-600', ring: 'ring-emerald-100', border: 'border-emerald-100' },
              };

              const currentTheme = themeStyles[item.themeColor];

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-2 py-1.5 rounded-2xl transition-all duration-200 group border
                    ${isActive 
                      ? `bg-white shadow-sm ring-1 ${currentTheme.ring} ${currentTheme.border}` 
                      : 'border-transparent hover:bg-slate-100 hover:shadow-sm'} 
                  `}
                  style={{ minWidth: '100px', height: '52px' }} 
                >
                  <div 
                    className={`
                      flex items-center justify-center w-[36px] h-[36px] rounded-xl flex-shrink-0 transition-all duration-200
                      ${isActive 
                        ? `bg-gradient-to-br ${currentTheme.activeIcon} text-white shadow-sm` 
                        : 'bg-white text-slate-400 border border-slate-100 group-hover:border-slate-200 group-hover:text-slate-600'}
                    `}
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="flex flex-col justify-center min-w-0 pr-1">
                    <span className={`text-[13px] font-bold leading-tight ${isActive ? currentTheme.activeText : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex justify-center w-full px-4 py-6">
        <div className="flex w-full max-w-[1200px] gap-6">
          
          {/* Sidebar */}
          <aside 
            className="hidden lg:flex flex-col flex-none sticky top-24 h-[calc(100vh-120px)]"
            style={{ width: '260px', minWidth: '260px' }} 
          >
            <div className="px-4 mb-3 flex items-center gap-2">
              <div className="size-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Live Now
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-1 pb-4 custom-scrollbar">
              {liveMembers.length > 0 ? (
                liveMembers.map((member, idx) => (
                  <MemberCard key={`${member.name}-${idx}`} member={member} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 rounded-2xl border border-dashed border-slate-200 bg-white/50 text-center mx-1">
                  <div className="bg-slate-100 p-3 rounded-full mb-3">
                    <Radio className="size-5 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">방송 중인 멤버가 없습니다.</p>
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
          
        </div>
      </div>
    </div>
  );
}
