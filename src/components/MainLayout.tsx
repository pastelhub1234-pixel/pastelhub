import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData'; 
import MemberCard from '../components/MemberCard';

export interface Member {
  id: string;
  name: string;
  status?: string;
  profileImg: string;
  liveUrl?: string;
  channelUrl?: string;
  title?: string;
}

// ✅ [설정] 메뉴별 테마 및 경로 정의
const NAV_ITEMS = [
  { 
    path: '/news/schedule', 
    icon: Calendar, 
    label: '일정',
    // Blue Theme (News)
    theme: {
      activeBg: "bg-white border-blue-200 shadow-md ring-1 ring-blue-100",
      iconActive: "bg-gradient-to-br from-blue-400 to-cyan-400 shadow-blue-200 text-white shadow-sm",
      iconInactive: "bg-transparent text-blue-400 group-hover:text-blue-500",
      textActive: "text-blue-900",
      textInactive: "text-slate-500",
      hover: "hover:bg-blue-50/50 hover:text-blue-600"
    }
  },
  { 
    path: '/news/broadcast', 
    icon: Radio, 
    label: '방송',
    // Rose Theme
    theme: {
      activeBg: "bg-white border-rose-200 shadow-md ring-1 ring-rose-100",
      iconActive: "bg-gradient-to-br from-rose-400 to-pink-400 shadow-rose-200 text-white shadow-sm",
      iconInactive: "bg-transparent text-rose-400 group-hover:text-rose-500",
      textActive: "text-rose-900",
      textInactive: "text-slate-500",
      hover: "hover:bg-rose-50/50 hover:text-rose-600"
    }
  },
  { 
    path: '/news/twitter', 
    icon: Twitter, 
    label: '타임라인',
    // Violet Theme
    theme: {
      activeBg: "bg-white border-violet-200 shadow-md ring-1 ring-violet-100",
      iconActive: "bg-gradient-to-br from-violet-400 to-purple-400 shadow-violet-200 text-white shadow-sm",
      iconInactive: "bg-transparent text-violet-400 group-hover:text-violet-500",
      textActive: "text-violet-900",
      textInactive: "text-slate-500",
      hover: "hover:bg-violet-50/50 hover:text-violet-600"
    }
  },
  { 
    path: '/activities', 
    icon: Zap, 
    label: '활동',
    // Pink Theme (요청하신 Activities 스타일)
    theme: {
      activeBg: "bg-white border-pink-200 shadow-md ring-1 ring-pink-100",
      iconActive: "bg-gradient-to-br from-pink-400 to-rose-400 shadow-pink-200 text-white shadow-sm",
      iconInactive: "bg-transparent text-pink-400 group-hover:text-pink-500",
      textActive: "text-pink-900",
      textInactive: "text-slate-500",
      hover: "hover:bg-pink-50/50 hover:text-pink-600"
    }
  },
  { 
    path: '/others/goods', 
    icon: ShoppingBag, 
    label: '교환소',
    // Purple Theme (요청하신 Goods 스타일)
    theme: {
      activeBg: "bg-white border-purple-200 shadow-md ring-1 ring-purple-100",
      iconActive: "bg-gradient-to-br from-purple-400 to-violet-400 shadow-purple-200 text-white shadow-sm",
      iconInactive: "bg-transparent text-purple-400 group-hover:text-purple-500",
      textActive: "text-purple-900",
      textInactive: "text-slate-500",
      hover: "hover:bg-purple-50/50 hover:text-purple-600"
    }
  },
];

export default function MainLayout() {
  const location = useLocation();
  const { data: members } = useJsonData<Member[]>('status');

  const liveMembers = members?.filter(
    (member) => member.status && (
      member.status.includes('LIVE') || 
      member.status.includes('SPACE') || 
      member.status.includes('X_live') ||
      member.status.includes('chzzk_live')
    )
  ) || [];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-transparent">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm h-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
              <Sparkles className="size-6 text-indigo-500 transition-transform duration-500 group-hover:rotate-180" />
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight flex items-center gap-0.5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* Desktop Navigation (가로 배치: 아이콘 + 텍스트) */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              const theme = item.theme;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-300 border
                    ${isActive 
                      ? `${theme.activeBg} scale-[1.02]` 
                      : `border-transparent bg-transparent ${theme.hover}`
                    }
                  `}
                >
                  {/* 아이콘 박스 */}
                  <div 
                    className={`
                      flex items-center justify-center rounded-xl w-8 h-8 transition-all duration-300
                      ${isActive ? theme.iconActive : theme.iconInactive}
                    `}
                  >
                    <Icon className="size-4.5" strokeWidth={2.5} />
                  </div>
                  
                  {/* 텍스트 */}
                  <span className={`text-[13px] font-bold tracking-tight transition-colors ${isActive ? theme.textActive : theme.textInactive}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation (헤더 하단 가로 스크롤) */}
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur px-1 py-1.5 overflow-x-auto no-scrollbar">
          <nav className="flex items-center justify-between px-2 gap-1 min-w-max w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              const theme = item.theme;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all flex-1 min-w-[64px]
                    ${isActive ? "bg-white shadow-sm ring-1 ring-slate-100" : "hover:bg-slate-50"}
                  `}
                >
                  <div 
                    className={`
                      mb-1 p-1.5 rounded-lg transition-all duration-300
                      ${isActive ? theme.iconActive : "text-slate-400"}
                    `}
                  >
                    <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] font-bold ${isActive ? theme.textActive : "text-slate-400"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center w-full px-4 py-6">
        <div className="flex w-full max-w-[1200px] gap-6">
          
          {/* Sidebar - Desktop only (방송 알림 등) */}
          <aside className="hidden lg:flex flex-col w-[280px] flex-none sticky top-24 h-fit gap-4">
            <div className="flex flex-col gap-3">
              {liveMembers.length > 0 ? (
                liveMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 rounded-3xl bg-white/60 border border-white shadow-sm text-center backdrop-blur-sm">
                  <div className="bg-slate-100 p-3 rounded-full mb-3">
                    <Radio className="size-6 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    지금은 방송 중인 멤버가 없어요
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}