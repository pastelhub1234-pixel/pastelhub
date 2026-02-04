import { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData'; 
import MemberCard from '../components/MemberCard';
import { Member } from '../types';

// ✅ 네비게이션 설정 (각 항목별 테마 컬러 지정)
// theme: active 시 적용될 색상 코드 (Blue, Pink, Purple, Emerald 등)
const NAV_ITEMS = [
  { path: '/news/schedule', icon: Calendar, label: '일정', themeColor: 'blue' },
  { path: '/news/broadcast', icon: Radio, label: '방송', themeColor: 'rose' },
  { path: '/news/twitter', icon: Twitter, label: '타임라인', themeColor: 'violet' },
  { path: '/activities', icon: Zap, label: '활동', themeColor: 'amber' }, // 활동은 노란/주황 계열
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
      
      {/* ================= Header ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-[72px] flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Sparkles className="size-7 text-indigo-500 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* ✅ Desktop Navigation (AppSidebar 스타일 적용) */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              // 동적 클래스 생성 (Tailwind JIT가 인식하도록 전체 문자열을 조합하는게 안전하지만, 여기서는 가독성을 위해 템플릿 리터럴 사용)
              // 실제로는 `bg-blue-400`, `shadow-blue-200` 등이 safelist에 있거나 전체 이름으로 써야 합니다.
              // 편의상 아래와 같이 매핑합니다.
              
              const themeStyles: any = {
                blue:    { activeIcon: 'from-blue-400 to-cyan-400 shadow-blue-200', activeText: 'text-blue-900', ring: 'ring-blue-100' },
                rose:    { activeIcon: 'from-rose-400 to-pink-400 shadow-rose-200', activeText: 'text-rose-900', ring: 'ring-rose-100' },
                violet:  { activeIcon: 'from-violet-400 to-purple-400 shadow-violet-200', activeText: 'text-violet-900', ring: 'ring-violet-100' },
                amber:   { activeIcon: 'from-amber-400 to-orange-400 shadow-amber-200', activeText: 'text-amber-900', ring: 'ring-amber-100' },
                emerald: { activeIcon: 'from-emerald-400 to-teal-400 shadow-emerald-200', activeText: 'text-emerald-900', ring: 'ring-emerald-100' },
              };

              const currentTheme = themeStyles[item.themeColor];

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-2 py-2 rounded-2xl transition-all duration-300 group
                    ${isActive 
                      ? `bg-white border-white shadow-sm ring-1 ${currentTheme.ring} scale-[1.02]` 
                      : 'hover:bg-slate-100/50 hover:scale-[1.01]'}
                  `}
                  style={{ width: '110px', height: '56px' }} // 너비 살짝 키워서 아이콘+텍스트 가로 배치
                >
                  {/* ✅ 아이콘 박스 (AppSidebar 스타일) */}
                  <div 
                    className={`
                      flex items-center justify-center w-[36px] h-[36px] rounded-xl flex-shrink-0 transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-br ${currentTheme.activeIcon} text-white shadow-md` 
                        : 'bg-slate-100 text-slate-400 group-hover:text-slate-600 group-hover:bg-white'}
                    `}
                  >
                    <Icon className="size-5" />
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={`text-[12px] font-bold leading-tight ${isActive ? currentTheme.activeText : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="text-[9px] text-gray-400 leading-none mt-0.5">Active</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

        </div>
      </header>

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex justify-center w-full px-4 py-6">
        <div className="flex w-full max-w-[1200px] gap-6">
          
          {/* ✅ Sidebar (Left) */}
          {/* width: '260px' (제공 코드와 동일하게 설정) */}
          <aside 
            className="hidden lg:flex flex-col flex-none sticky top-24 h-[calc(100vh-120px)]"
            style={{ width: '260px', minWidth: '260px' }} 
          >
            {/* 제목 (선택 사항) */}
            <div className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Live Status
            </div>

            <div className="flex-1 overflow-y-auto px-1 pb-4 space-y-2 custom-scrollbar">
              {liveMembers.length > 0 ? (
                liveMembers.map((member, idx) => (
                  <MemberCard key={`${member.name}-${idx}`} member={member} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 rounded-2xl border border-dashed border-slate-200 bg-white/50 text-center mx-2">
                  <div className="bg-slate-100 p-2 rounded-full mb-2">
                    <Radio className="size-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">방송 중인 멤버가 없습니다.</p>
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
