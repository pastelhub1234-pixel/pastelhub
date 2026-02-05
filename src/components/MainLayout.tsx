import { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles, User } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import MemberCard from './MemberCard';
import { Member } from '../types';

const NAV_ITEMS = [
  { path: '/news/schedule', icon: Calendar, label: '일정', description: '주요 스케줄', themeColor: 'blue' },
  { path: '/news/broadcast', icon: Radio, label: '방송', description: '실시간 생방송', themeColor: 'rose' },
  { path: '/news/twitter', icon: Twitter, label: '타임라인', description: '최신 소식', themeColor: 'violet' },
  { path: '/activities', icon: Zap, label: '활동', description: '참여형 콘텐츠', themeColor: 'amber' },
  { path: '/others/goods', icon: ShoppingBag, label: '교환소', description: '굿즈 거래', themeColor: 'emerald' },
];

export default function MainLayout() {
  const location = useLocation();
  const { data: members } = useJsonData<Member[]>('status');

  const liveMembers = useMemo(() => {
    return members?.filter(member =>
      member.status && member.status.toLowerCase().includes('live')
    ) || [];
  }, [members]);

  // ✅ [핵심] 테마별 스타일 정의 (CSS 파일 의존 없이 여기서 직접 조합)
  const themeStyles: Record<string, any> = {
    blue: {
      activeBg: "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100",
      iconActive: "bg-gradient-to-br from-blue-400 to-cyan-400 shadow-blue-200 text-white",
      iconInactive: "bg-white text-blue-300 group-hover:text-blue-400",
      textActive: "text-blue-900",
      textInactive: "text-gray-500 group-hover:text-slate-700",
      hover: "hover:bg-blue-50/60 hover:border-blue-100 hover:shadow-sm"
    },
    rose: {
      activeBg: "bg-rose-50 border-rose-200 shadow-sm ring-1 ring-rose-100",
      iconActive: "bg-gradient-to-br from-rose-400 to-pink-400 shadow-rose-200 text-white",
      iconInactive: "bg-white text-rose-300 group-hover:text-rose-400",
      textActive: "text-rose-900",
      textInactive: "text-gray-500 group-hover:text-slate-700",
      hover: "hover:bg-rose-50/60 hover:border-rose-100 hover:shadow-sm"
    },
    violet: {
      activeBg: "bg-violet-50 border-violet-200 shadow-sm ring-1 ring-violet-100",
      iconActive: "bg-gradient-to-br from-violet-400 to-purple-400 shadow-violet-200 text-white",
      iconInactive: "bg-white text-violet-300 group-hover:text-violet-400",
      textActive: "text-violet-900",
      textInactive: "text-gray-500 group-hover:text-slate-700",
      hover: "hover:bg-violet-50/60 hover:border-violet-100 hover:shadow-sm"
    },
    amber: {
      activeBg: "bg-amber-50 border-amber-200 shadow-sm ring-1 ring-amber-100",
      iconActive: "bg-gradient-to-br from-amber-400 to-orange-400 shadow-amber-200 text-white",
      iconInactive: "bg-white text-amber-300 group-hover:text-amber-400",
      textActive: "text-amber-900",
      textInactive: "text-gray-500 group-hover:text-slate-700",
      hover: "hover:bg-amber-50/60 hover:border-amber-100 hover:shadow-sm"
    },
    emerald: {
      activeBg: "bg-emerald-50 border-emerald-200 shadow-sm ring-1 ring-emerald-100",
      iconActive: "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-emerald-200 text-white",
      iconInactive: "bg-white text-emerald-300 group-hover:text-emerald-400",
      textActive: "text-emerald-900",
      textInactive: "text-gray-500 group-hover:text-slate-700",
      hover: "hover:bg-emerald-50/60 hover:border-emerald-100 hover:shadow-sm"
    },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-gray-50/50">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        {/* ✅ [Image 1 레이아웃] 3단 분리 (좌:로고, 중:메뉴, 우:로그인) */}
        <div className="max-w-[1400px] mx-auto px-4 h-[80px] flex items-center">
          
          {/* 1. 로고 영역 (flex-1로 왼쪽 공간 확보) */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="group flex items-center gap-2 transition-opacity hover:opacity-80 min-w-max">
              <Sparkles className="h-6 w-6 text-indigo-400 transition-transform duration-500 group-hover:rotate-180" />
              <h1 className="font-extrabold text-2xl tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
                <span className="text-slate-700">hub</span>
              </h1>
            </Link>
          </div>

          {/* 2. 네비게이션 (중앙 정렬) */}
          <nav className="hidden xl:flex items-center gap-2 justify-center">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              const theme = themeStyles[item.themeColor]; // 위에서 정의한 테마 객체 사용

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-2xl transition-all duration-300 border font-medium group flex-shrink-0
                    ${isActive 
                      ? `${theme.activeBg} scale-[1.02]` 
                      : `border-transparent bg-transparent ${theme.hover} hover:scale-[1.01]`} 
                  `}
                  style={{ minWidth: '140px' }}
                >
                  {/* 아이콘 박스 */}
                  <div 
                    className={`
                      flex items-center justify-center w-[40px] h-[40px] rounded-xl flex-shrink-0 transition-all duration-300 shadow-sm
                      ${isActive ? theme.iconActive : `border border-slate-100 ${theme.iconInactive}`}
                    `}
                  >
                    <Icon className="size-5" />
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={`text-[13px] font-bold leading-tight transition-colors ${isActive ? theme.textActive : theme.textInactive}`}>
                      {item.label}
                    </span>
                    <span className={`text-[10px] mt-0.5 truncate transition-colors ${isActive ? 'opacity-80' : 'text-gray-400 group-hover:text-gray-500'}`}>
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* 3. 우측 영역 (로그인 버튼 & 모바일 메뉴) */}
          <div className="flex-1 flex justify-end items-center">
            
            {/* 모바일 가로 스크롤 메뉴 (화면 작을 때만 표시) */}
            <div className="xl:hidden flex items-center gap-2 overflow-x-auto no-scrollbar w-full justify-end pr-1">
               {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);
                  const theme = themeStyles[item.themeColor];
                  return (
                    <Link key={item.path} to={item.path} className={`flex items-center justify-center p-2 rounded-xl transition-all border ${isActive ? theme.activeBg : 'bg-white border-transparent'}`}>
                       <Icon className={`size-5 ${isActive ? theme.textActive : 'text-slate-400'}`} />
                    </Link>
                  )
               })}
            </div>

            {/* 로그인 버튼 (PC용) */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all shadow-sm ml-4">
              <span>로그인</span>
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="size-3.5 text-slate-400" />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex justify-center w-full px-4 py-6">
        <div className="flex w-full max-w-[1200px] gap-6">
          
          <aside 
            className="hidden lg:flex flex-col flex-none sticky top-24 h-[calc(100vh-120px)] border-r border-slate-200 pr-6 mr-2"
            style={{ width: '280px', minWidth: '280px' }} 
          >
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
