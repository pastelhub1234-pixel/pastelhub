import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Zap, Radio, Twitter, ShoppingBag, Sparkles, Menu, X } from 'lucide-react';

// ✅ id 값은 CSS 클래스 중간 이름(blue, pink 등)과 정확히 일치해야 합니다.
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm h-[100px]">
        <div className="w-full h-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* PC 메뉴 */}
          <nav className="hidden md:flex items-center gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              // ✅ [핵심] CSS 파일에 정의된 클래스 이름 조립
              // 예: activeClass = "bg-blue-50 border-blue-200 ..."
              const activeClass = `bg-${item.id}-50 border-${item.id}-200 shadow-md ring-1 ring-${item.id}-100 text-${item.id}-900`;
              
              // 예: inactiveClass = "hover-bg-blue-50 hover-text-blue-600"
              const inactiveClass = `hover-bg-${item.id}-50 hover-text-${item.id}-600`;

              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`nav-item-base ${isActive ? activeClass : inactiveClass}`}
                >
                  <div className={`nav-icon w-8 h-8 ${isActive 
                    ? `active-icon-${item.id}` // CSS에 정의된 그라데이션 클래스
                    : `group-hover-text-${item.id}-500 group-hover-border-${item.id}-200`
                  }`}>
                    <item.icon className="size-4" />
                  </div>
                  <span className="text-sm font-bold">{item.label}</span>
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
      </header>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[100px] left-0 w-full bg-white z-50 border-b border-slate-100 shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
          <div 
            className="p-4 w-full gap-2"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          > 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              // 모바일용 활성 클래스 조립
              const activeClass = `bg-${item.id}-50 border-${item.id}-200 text-${item.id}-600`;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item-mobile ${isActive ? activeClass : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="nav-icon w-9 h-9">
                    <item.icon className="size-4" />
                  </div>
                  <span className="text-[10px] font-bold mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
