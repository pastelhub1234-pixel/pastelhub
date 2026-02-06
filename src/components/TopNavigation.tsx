import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Zap, Radio, Twitter, ShoppingBag, Sparkles, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/schedule', icon: Calendar, label: '일정', id: 'blue' },
  { path: '/activities', icon: Zap, label: '활동', id: 'pink' },
  { path: '/broadcast', icon: Radio, label: '방송', id: 'purple' },
  { path: '/timeline', icon: Twitter, label: '타임라인', id: 'indigo' },
  { path: '/goods', icon: ShoppingBag, label: '교환소', id: 'emerald' },
];

export function TopNavigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* h-[100px] flex flex-col: 100px 높이 내에서 세로 배치 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm h-[100px] flex flex-col">
        
        {/* ⬛ [위쪽 스페이서] 30px 강제 고정 (검은색) */}
        <div className="h-[30px] w-full bg-black shrink-0" />

        {/* ⬜ [중간 콘텐츠] 40px 강제 고정 */}
        {/* h-[40px]를 줘서 버튼 높이와 딱 맞춥니다. */}
        <div className="h-[40px] shrink-0 w-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between bg-white/90">
          
          <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* PC 메뉴 (높이 40px, 버튼 내부 높이 100% 채움) */}
          <nav className="hidden md:flex items-center gap-2 h-full"> 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              // h-full로 부모(40px) 높이 꽉 채움
              const baseLayout = "flex items-center gap-2 h-full px-3.5 rounded-xl border transition-all duration-200 group active:scale-95 font-bold whitespace-nowrap";
              
              const activeColor = `bg-${item.id}-50 border-${item.id}-200 shadow-md ring-1 ring-${item.id}-100 text-${item.id}-900`;
              const inactiveColor = `bg-transparent border-transparent text-gray-500 hover-bg-${item.id}-50 hover-text-${item.id}-600`;

              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`${baseLayout} ${isActive ? activeColor : inactiveColor}`}
                >
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-md shadow-sm transition-all duration-300 border border-slate-100 shrink-0
                    ${isActive ? `active-icon-${item.id} border-transparent` : `bg-white text-gray-400 group-hover-text-${item.id}-500 group-hover-border-${item.id}-200`}
                  `}>
                    <item.icon className="size-3" />
                  </div>
                  <span className="text-[12px]">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>

        {/* ⬛ [아래쪽 스페이서] 30px 강제 고정 (검은색) */}
        <div className="h-[30px] w-full bg-black shrink-0" />

      </header>

      {/* 모바일 메뉴 (위치는 그대로) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[100px] left-0 w-full bg-white z-50 border-b border-slate-100 shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-4 w-full gap-2" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}> 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const mobileLayout = "flex flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-200 active:scale-95 h-[60px]";
              const mobileColor = isActive ? `bg-${item.id}-50 border-${item.id}-200 text-${item.id}-900` : `bg-transparent border-transparent text-gray-500`;
              return (
                <Link key={item.path} to={item.path} className={`${mobileLayout} ${mobileColor}`} style={{ flex: 1 }} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center justify-center w-7 h-7 rounded-md shadow-sm transition-all duration-300 border border-slate-100 shrink-0 ${isActive ? `active-icon-${item.id}` : 'bg-white text-gray-400'}`}>
                    <item.icon className="size-3.5" />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
