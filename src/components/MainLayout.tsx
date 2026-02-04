import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData'; 
import MemberCard from '../components/MemberCard'; // 경로 확인 필요

// ✅ Member 타입 정의
export interface Member {
  id: string;
  name: string;
  status?: string;
  profileImg: string;
  liveUrl?: string;
  channelUrl?: string;
  title?: string;
}

// ✅ 네비게이션 아이템 설정 (색상 클래스를 직접 정의하여 CSS 의존성 제거)
const NAV_ITEMS = [
  { 
    path: '/news/schedule', 
    icon: Calendar, 
    label: '일정',
    activeClass: "text-sky-600 bg-sky-50", 
    hoverClass: "hover:text-sky-600 hover:bg-sky-50",
    iconColor: "text-sky-500"
  },
  { 
    path: '/news/broadcast', 
    icon: Radio, 
    label: '방송',
    activeClass: "text-pink-600 bg-pink-50",
    hoverClass: "hover:text-pink-600 hover:bg-pink-50",
    iconColor: "text-pink-500"
  },
  { 
    path: '/news/twitter', 
    icon: Twitter, 
    label: '타임라인',
    activeClass: "text-violet-600 bg-violet-50",
    hoverClass: "hover:text-violet-600 hover:bg-violet-50",
    iconColor: "text-violet-500"
  },
  { 
    path: '/activities', 
    icon: Zap, 
    label: '활동',
    activeClass: "text-amber-600 bg-amber-50",
    hoverClass: "hover:text-amber-600 hover:bg-amber-50",
    iconColor: "text-amber-500"
  },
  { 
    path: '/others/goods', 
    icon: ShoppingBag, 
    label: '교환소',
    activeClass: "text-emerald-600 bg-emerald-50",
    hoverClass: "hover:text-emerald-600 hover:bg-emerald-50",
    iconColor: "text-emerald-500"
  },
];

export default function MainLayout() {
  const location = useLocation();
  const { data: members } = useJsonData<Member[]>('status');

  const liveMembers = members?.filter(
    (member) => member.status && (
      member.status.includes('LIVE') || 
      member.status.includes('SPACE') || 
      member.status.includes('X_live')
    )
  ) || [];

  return (
    // 배경색은 index.css의 body 설정을 따르지만, 혹시 몰라 여기서도 투명 처리
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-transparent">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm h-[72px]">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative flex items-center justify-center">
              <Sparkles className="size-7 text-indigo-500 transition-transform duration-500 group-hover:rotate-180" />
            </div>
            <h1 className="font-extrabold text-2xl tracking-tighter flex items-center gap-0.5">
              <span className="text-[#5b85f9]">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* Desktop Navigation (아이콘 위, 텍스트 아래 - 수직 정렬) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center justify-center w-[72px] h-[64px] rounded-xl transition-all duration-200 gap-1
                    ${isActive 
                      ? `${item.activeClass} font-bold shadow-sm ring-1 ring-black/5` 
                      : `text-slate-500 hover:bg-slate-50 ${item.hoverClass}`
                    }
                  `}
                >
                  <Icon 
                    className={`size-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="text-[11px] leading-none tracking-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation (화면 하단 고정 or 헤더 하단) */}
        {/* 모바일에서는 헤더 아래에 가로 스크롤 메뉴로 표시 */}
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur px-2 py-2">
          <nav className="flex items-center justify-between px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-xl transition-all flex-1
                    ${isActive ? item.activeClass : "text-slate-400"}
                  `}
                >
                  <Icon className="size-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
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
            {/* 방송 중인 멤버 카드 */}
            <div className="flex flex-col gap-3">
              {liveMembers.length > 0 ? (
                liveMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 rounded-2xl bg-white/60 border border-white shadow-sm text-center">
                  <Radio className="size-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400 font-medium">
                    현재 방송 중인 멤버가 없어요
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* 컨텐츠 영역 배경 제거 (Timeline 자체에 배경이 있으므로 중복 방지) */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}