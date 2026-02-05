import { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import MemberCard from './MemberCard';
import { Member } from '../types';

// ✅ 네비게이션 데이터 (설명 추가)
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

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-gray-50/50">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-[80px] flex items-center justify-between">
          
          {/* 로고 */}
          <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
            <Sparkles className="h-6 w-6 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* ✅ 네비게이션 (PC/모바일 통합 스타일) */}
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar ml-4 md:ml-0 w-full md:w-auto justify-start md:justify-end pr-4 md:pr-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              // ✅ 요청하신 themeConfig 로직 적용
              const themeStyles: any = {
                blue:    { activeBg: "bg-white/90 border-blue-200 shadow-md ring-1 ring-blue-100", iconActive: "bg-gradient-to-br from-blue-400 to-cyan-400 shadow-blue-200 text-white", iconInactive: "bg-white text-blue-300 group-hover:text-blue-400", textActive: "text-blue-900", hover: "hover:bg-white/80 hover:border-blue-100 hover:shadow-sm" },
                rose:    { activeBg: "bg-white/90 border-rose-200 shadow-md ring-1 ring-rose-100", iconActive: "bg-gradient-to-br from-rose-400 to-pink-400 shadow-rose-200 text-white", iconInactive: "bg-white text-rose-300 group-hover:text-rose-400", textActive: "text-rose-900", hover: "hover:bg-white/80 hover:border-rose-100 hover:shadow-sm" },
                violet:  { activeBg: "bg-white/90 border-violet-200 shadow-md ring-1 ring-violet-100", iconActive: "bg-gradient-to-br from-violet-400 to-purple-400 shadow-violet-200 text-white", iconInactive: "bg-white text-violet-300 group-hover:text-violet-400", textActive: "text-violet-900", hover: "hover:bg-white/80 hover:border-violet-100 hover:shadow-sm" },
                amber:   { activeBg: "bg-white/90 border-amber-200 shadow-md ring-1 ring-amber-100", iconActive: "bg-gradient-to-br from-amber-400 to-orange-400 shadow-amber-200 text-white", iconInactive: "bg-white text-amber-300 group-hover:text-amber-400", textActive: "text-amber-900", hover: "hover:bg-white/80 hover:border-amber-100 hover:shadow-sm" },
                emerald: { activeBg: "bg-white/90 border-emerald-200 shadow-md ring-1 ring-emerald-100", iconActive: "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-emerald-200 text-white", iconInactive: "bg-white text-emerald-300 group-hover:text-emerald-400", textActive: "text-emerald-900", hover: "hover:bg-white/80 hover:border-emerald-100 hover:shadow-sm" },
              };

              const config = themeStyles[item.themeColor];

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-2xl transition-all duration-300 border font-medium group flex-shrink-0
                    ${isActive 
                      ? `${config.activeBg} scale-[1.02]` 
                      : `border-transparent bg-transparent ${config.hover} hover:scale-[1.01]`} 
                  `}
                  style={{ minWidth: '130px' }} // 최소 너비 확보
                >
                  {/* 아이콘 박스 */}
                  <div 
                    className={`
                      flex items-center justify-center w-[36px] h-[36px] rounded-xl flex-shrink-0 transition-all duration-300 shadow-sm
                      ${isActive ? config.iconActive : `border border-slate-100 ${config.iconInactive}`}
                    `}
                  >
                    <Icon className="size-5" />
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={`text-[13px] font-bold leading-tight transition-colors ${isActive ? config.textActive : 'text-slate-500 group-hover:text-slate-800'}`}>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex justify-center w-full px-4 py-6">
        <div className="flex w-full max-w-[1200px] gap-6">
          
          {/* ✅ Sidebar 수정됨 
             - Live Now 텍스트 제거
             - border-r로 구분선 추가
          */}
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