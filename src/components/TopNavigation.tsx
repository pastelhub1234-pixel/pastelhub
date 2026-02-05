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
    const base = "flex items-center gap-2.5 px-5 py-2.5 rounded-xl border transition-all duration-200 group active:scale-95";
    const mobileBase = "flex flex-col items-center justify-center gap-1 py-2 rounded-xl border transition-all duration-200 active:scale-95 h-[64px]";

    const styles: Record<string, any> = {
      blue: {
        pc: isActive 
          ? `${base} bg-white/90 border-blue-200 shadow-md ring-1 ring-blue-100` 
          : `${base} bg-transparent border-transparent hover:bg-blue-50 hover:text-blue-600 text-gray-500`,
        mobile: isActive 
          ? `${mobileBase} bg-blue-50 border-blue-100 text-blue-600` 
          : `${mobileBase} bg-transparent border-transparent text-gray-500`,
        icon: isActive 
          ? "bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-blue-200" 
          : "bg-white text-gray-400 group-hover:text-blue-500 group-hover:border-blue-200 border border-slate-100",
        text: isActive ? "text-blue-900" : "group-hover:text-blue-700"
      },
      pink: {
        pc: isActive 
          ? `${base} bg-white/90 border-pink-200 shadow-md ring-1 ring-pink-100` 
          : `${base} bg-transparent border-transparent hover:bg-pink-50 hover:text-pink-600 text-gray-500`,
        mobile: isActive 
          ? `${mobileBase} bg-pink-50 border-pink-100 text-pink-600` 
          : `${mobileBase} bg-transparent border-transparent text-gray-500`,
        icon: isActive 
          ? "bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-pink-200" 
          : "bg-white text-gray-400 group-hover:text-pink-500 group-hover:border-pink-200 border border-slate-100",
        text: isActive ? "text-pink-900" : "group-hover:text-pink-700"
      },
      purple: {
        pc: isActive 
          ? `${base} bg-white/90 border-purple-200 shadow-md ring-1 ring-purple-100` 
          : `${base} bg-transparent border-transparent hover:bg-purple-50 hover:text-purple-600 text-gray-500`,
        mobile: isActive 
          ? `${mobileBase} bg-purple-50 border-purple-100 text-purple-600` 
          : `${mobileBase} bg-transparent border-transparent text-gray-500`,
        icon: isActive 
          ? "bg-gradient-to-br from-purple-400 to-violet-400 text-white shadow-purple-200" 
          : "bg-white text-gray-400 group-hover:text-purple-500 group-hover:border-purple-200 border border-slate-100",
        text: isActive ? "text-purple-900" : "group-hover:text-purple-700"
      },
      indigo: {
        pc: isActive 
          ? `${base} bg-white/90 border-indigo-200 shadow-md ring-1 ring-indigo-100` 
          : `${base} bg-transparent border-transparent hover:bg-indigo-50 hover:text-indigo-600 text-gray-500`,
        mobile: isActive 
          ? `${mobileBase} bg-indigo-50 border-indigo-100 text-indigo-600` 
          : `${mobileBase} bg-transparent border-transparent text-gray-500`,
        icon: isActive 
          ? "bg-gradient-to-br from-indigo-400 to-violet-400 text-white shadow-indigo-200" 
          : "bg-white text-gray-400 group-hover:text-indigo-500 group-hover:border-indigo-200 border border-slate-100",
        text: isActive ? "text-indigo-900" : "group-hover:text-indigo-700"
      },
      emerald: {
        pc: isActive 
          ? `${base} bg-white/90 border-emerald-200 shadow-md ring-1 ring-emerald-100` 
          : `${base} bg-transparent border-transparent hover:bg-emerald-50 hover:text-emerald-600 text-gray-500`,
        mobile: isActive 
          ? `${mobileBase} bg-emerald-50 border-emerald-100 text-emerald-600` 
          : `${mobileBase} bg-transparent border-transparent text-gray-500`,
        icon: isActive 
          ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-emerald-200" 
          : "bg-white text-gray-400 group-hover:text-emerald-500 group-hover:border-emerald-200 border border-slate-100",
        text: isActive ? "text-emerald-900" : "group-hover:text-emerald-700"
      },
    };

    return styles[theme] || styles['blue'];
  };

  return (
    <>
      {/* ✅ [수정] 높이 100px로 확대 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm h-[100px]">
        <div className="w-full h-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const themeStyle = getThemeStyles(item.theme, isActive);
              return (
                <Link key={item.path} to={item.path} className={themeStyle.pc}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg shadow-sm transition-all duration-300 ${themeStyle.icon}`}>
                    <item.icon className="size-4" />
                  </div>
                  <span className={`text-sm font-bold ${themeStyle.text}`}>{item.label}</span>
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

      {/* ✅ [수정] 모바일 메뉴 top 위치 100px로 조정 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[100px] left-0 w-full bg-white z-50 border-b border-slate-100 shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
          <div 
            className="p-4 w-full gap-2"
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          > 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const themeStyle = getThemeStyles(item.theme, isActive);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={themeStyle.mobile}
                  style={{ flex: 1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg shadow-sm transition-all duration-300 ${themeStyle.icon}`}>
                    <item.icon className="size-4" />
                  </div>
                  <span className={`text-[10px] font-bold mt-1`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}