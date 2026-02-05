import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Zap, Radio, Twitter, ShoppingBag, Sparkles, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/schedule', icon: Calendar, label: '일정', theme: 'blue' },
  { path: '/activities', icon: Zap, label: '활동', theme: 'pink' },
  { path: '/broadcast', icon: Radio, label: '방송', theme: 'purple' },
  { path: '/timeline', icon: Twitter, label: '타임라인', theme: 'indigo' },
  { path: '/goods', icon: ShoppingBag, label: '교환소', theme: 'emerald' },
];

export function TopNavigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getThemeStyles = (theme: string, isActive: boolean) => {
    const base = "transition-all duration-200 ease-out group active:scale-95 rounded-xl border flex items-center justify-center";
    
    const styles: Record<string, any> = {
      blue: {
        container: isActive 
          ? `${base} bg-white/90 border-blue-200 shadow-md ring-1 ring-blue-100 scale-[1.02]` 
          : `${base} bg-transparent border-transparent hover:bg-white/80 hover:shadow-sm active:bg-blue-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-blue-200" 
          : "bg-white text-gray-300 border border-slate-100 group-hover:border-blue-200 group-hover:text-blue-400",
        text: isActive ? "text-blue-900" : "text-gray-500 group-hover:text-blue-900"
      },
      pink: {
        container: isActive 
          ? `${base} bg-white/90 border-pink-200 shadow-md ring-1 ring-pink-100 scale-[1.02]` 
          : `${base} bg-transparent border-transparent hover:bg-white/80 hover:shadow-sm active:bg-pink-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-pink-200" 
          : "bg-white text-gray-300 border border-slate-100 group-hover:border-pink-200 group-hover:text-pink-400",
        text: isActive ? "text-pink-900" : "text-gray-500 group-hover:text-pink-900"
      },
      purple: {
        container: isActive 
          ? `${base} bg-white/90 border-purple-200 shadow-md ring-1 ring-purple-100 scale-[1.02]` 
          : `${base} bg-transparent border-transparent hover:bg-white/80 hover:shadow-sm active:bg-purple-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-purple-400 to-violet-400 text-white shadow-purple-200" 
          : "bg-white text-gray-300 border border-slate-100 group-hover:border-purple-200 group-hover:text-purple-400",
        text: isActive ? "text-purple-900" : "text-gray-500 group-hover:text-purple-900"
      },
      indigo: {
        container: isActive 
          ? `${base} bg-white/90 border-indigo-200 shadow-md ring-1 ring-indigo-100 scale-[1.02]` 
          : `${base} bg-transparent border-transparent hover:bg-white/80 hover:shadow-sm active:bg-indigo-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-indigo-400 to-violet-400 text-white shadow-indigo-200" 
          : "bg-white text-gray-300 border border-slate-100 group-hover:border-indigo-200 group-hover:text-indigo-400",
        text: isActive ? "text-indigo-900" : "text-gray-500 group-hover:text-indigo-900"
      },
      emerald: {
        container: isActive 
          ? `${base} bg-white/90 border-emerald-200 shadow-md ring-1 ring-emerald-100 scale-[1.02]` 
          : `${base} bg-transparent border-transparent hover:bg-white/80 hover:shadow-sm active:bg-emerald-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-emerald-200" 
          : "bg-white text-gray-300 border border-slate-100 group-hover:border-emerald-200 group-hover:text-emerald-400",
        text: isActive ? "text-emerald-900" : "text-gray-500 group-hover:text-emerald-900"
      },
    };

    return styles[theme] || styles['blue'];
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm h-[80px]">
        <div className="w-full h-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* ✅ [수정] 요청하신 로고 코드로 교체 */}
          <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* PC 메뉴 (md: 768px 이상에서 보임) */}
          <nav className="hidden md:flex items-center gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const themeStyle = getThemeStyles(item.theme, isActive);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`gap-2.5 px-5 py-2.5 ${themeStyle.container}`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 shadow-sm ${themeStyle.icon}`}>
                    <item.icon className="size-4" />
                  </div>
                  <span className={`text-sm font-bold transition-colors duration-200 ${themeStyle.text}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* 모바일 햄버거 버튼 (md 미만에서만 보임) */}
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </header>

      {/* 모바일 메뉴 드롭다운 (가로 Grid 배치) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xl z-40 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-4 grid grid-cols-5 gap-2"> 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const themeStyle = getThemeStyles(item.theme, isActive);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-col gap-1.5 py-3 ${themeStyle.container}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => setIsMobileMenuOpen(false)} // 메뉴 클릭 시 닫힘
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg shadow-sm transition-all duration-300 ${themeStyle.icon}`}>
                    <item.icon className="size-5" />
                  </div>
                  <span className={`text-[10px] font-bold ${themeStyle.text}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}