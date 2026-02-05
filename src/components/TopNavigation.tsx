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
    const inactiveContainer = "bg-transparent border-transparent hover:bg-white/80 hover:shadow-sm active:scale-95 active:bg-gray-50 transition-transform";
    const inactiveIcon = "bg-white text-gray-300 border border-slate-100 group-hover:border-slate-200";
    const inactiveText = "text-gray-500";

    const themes: Record<string, any> = {
      blue: {
        container: isActive 
          ? "bg-white/90 border-blue-200 shadow-md ring-1 ring-blue-100 scale-[1.02]" 
          : `${inactiveContainer} hover:border-blue-100 active:bg-blue-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-blue-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-blue-400`,
        text: isActive ? "text-blue-900" : inactiveText
      },
      pink: {
        container: isActive 
          ? "bg-white/90 border-pink-200 shadow-md ring-1 ring-pink-100 scale-[1.02]" 
          : `${inactiveContainer} hover:border-pink-100 active:bg-pink-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-pink-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-pink-400`,
        text: isActive ? "text-pink-900" : inactiveText
      },
      purple: {
        container: isActive 
          ? "bg-white/90 border-purple-200 shadow-md ring-1 ring-purple-100 scale-[1.02]" 
          : `${inactiveContainer} hover:border-purple-100 active:bg-purple-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-purple-400 to-violet-400 text-white shadow-purple-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-purple-400`,
        text: isActive ? "text-purple-900" : inactiveText
      },
      indigo: {
        container: isActive 
          ? "bg-white/90 border-indigo-200 shadow-md ring-1 ring-indigo-100 scale-[1.02]" 
          : `${inactiveContainer} hover:border-indigo-100 active:bg-indigo-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-indigo-400 to-violet-400 text-white shadow-indigo-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-indigo-400`,
        text: isActive ? "text-indigo-900" : inactiveText
      },
      emerald: {
        container: isActive 
          ? "bg-white/90 border-emerald-200 shadow-md ring-1 ring-emerald-100 scale-[1.02]" 
          : `${inactiveContainer} hover:border-emerald-100 active:bg-emerald-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-emerald-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-emerald-400`,
        text: isActive ? "text-emerald-900" : inactiveText
      },
    };

    return themes[theme] || themes['blue'];
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm h-[72px]">
        <div className="w-full h-full max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-1.5 group z-50">
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
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all duration-200 ease-out group
                    active:scale-95
                    ${themeStyle.container}
                  `}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 shadow-sm ${themeStyle.icon}`}>
                    <item.icon className="size-4" />
                  </div>
                  <span className={`text-sm font-bold transition-colors duration-200 ${themeStyle.text}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 active:scale-90 rounded-xl transition-all"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xl z-40 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-3 grid grid-cols-5 gap-2"> 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const themeStyle = getThemeStyles(item.theme, isActive);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all duration-200 group
                    active:scale-95
                    ${themeStyle.container}
                  `}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className={`flex items-center justify-center w-9 h-9 rounded-xl shadow-sm transition-all duration-300 ${themeStyle.icon}`}>
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
