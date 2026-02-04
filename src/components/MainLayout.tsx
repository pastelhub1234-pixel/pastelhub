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

// ✅ 네비게이션 설정: CSS 클래스명(theme-xxx)만 지정하면 됩니다.
const NAV_ITEMS = [
  { 
    path: '/news/schedule', 
    icon: Calendar, 
    label: '일정',
    theme: 'theme-schedule' 
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
  const { data: members } = useJsonData<Member[]>('status');

  // ✅ 치지직(chzzk_live) 포함 필터링 유지
  const liveMembers = members?.filter(
    (member) => member.status && (
      member.status.includes('chzzk_live') || 
      member.status.includes('X_live') || 
      member.status.includes('LIVE') || 
      member.status.includes('SPACE')
    )
  ) || [];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-transparent">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-[72px] flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Sparkles className="size-7 text-indigo-500 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* Desktop Navigation (원래대로 복구: 아이콘 위, 텍스트 아래) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  // index.css에 정의된 .nav-item 및 테마 클래스 적용
                  className={`nav-item w-[72px] h-[64px] ${item.theme} ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span className={`text-[11px] font-bold mt-0.5 ${isActive ? '' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation (헤더 하단 고정 가로 스크롤) */}
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur px-1 py-1">
          <nav className="flex items-center justify-between px-2 gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  // 모바일에서도 동일한 클래스 사용 (터치 시 반응하도록 active 상태 CSS에 추가함)
                  className={`nav-item flex-1 py-2 ${item.theme} ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon size-5 mb-0.5" />
                  <span className="text-[10px] font-bold">
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
          
          {/* Sidebar - Desktop only */}
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