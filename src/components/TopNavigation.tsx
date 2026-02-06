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
      {/* ✅ [핵심 수정] sticky -> fixed (Flex 간섭 없이 무조건 고정) */}
      {/* left-0 top-0 w-full 추가하여 화면 상단에 꽉 차게 고정 */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm h-[100px]">
        <div className="w-full h-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* 로고 */}
          <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* 🖥️ PC 메뉴 (콤팩트 캡슐 스타일 유지) */}
          <nav className="hidden md:flex items-center gap-2"> 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              // 콤팩트 버튼 레이아웃 (px-3.5 py-1.5)
              const baseLayout = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg border transition-all duration-200 group active:scale-95 font-bold whitespace-nowrap";
              
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
                    ${isActive 
                      ? `active-icon-${item.id} border-transparent` 
                      : `bg-white text-gray-400 group-hover-text-${item.id}-500 group-hover-border-${item.id}-200`
                    }
                  `}>
                    <item.icon className="size-3" />
                  </div>
                  <span className="text-[12px]">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </header>

      {/* 📱 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[100px] left-0 w-full bg-white z-50 border-b border-slate-100 shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
          <div 
            className="p-4 w-full gap-2"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          > 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const mobileLayout = "flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all duration-200 active:scale-95 h-[60px]";
              const mobileColor = isActive 
                ? `bg-${item.id}-50 border-${item.id}-200 text-${item.id}-900`
                : `bg-transparent border-transparent text-gray-500`;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${mobileLayout} ${mobileColor}`}
                  style={{ flex: 1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`
                    flex items-center justify-center w-7 h-7 rounded-md shadow-sm transition-all duration-300 border border-slate-100 shrink-0
                    ${isActive ? `active-icon-${item.id}` : 'bg-white text-gray-400'}
                  `}>
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
