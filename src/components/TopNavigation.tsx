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
    // ✅ 버튼 둥글기 수정: rounded-full -> rounded-xl (조금 더 네모난 형태)
    const baseContainer = "transition-all duration-200 ease-out group active:scale-95 rounded-xl border"; 
    
    const inactiveContainer = `${baseContainer} bg-transparent border-transparent hover:bg-white/80 hover:shadow-sm active:bg-gray-50`;
    const inactiveIcon = "bg-white text-gray-300 border border-slate-100 group-hover:border-slate-200";
    const inactiveText = "text-gray-500";

    const themes: Record<string, any> = {
      blue: {
        container: isActive 
          ? `${baseContainer} bg-white/90 border-blue-200 shadow-md ring-1 ring-blue-100 scale-[1.02]` 
          : `${inactiveContainer} hover:border-blue-100 active:bg-blue-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-blue-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-blue-400`,
        text: isActive ? "text-blue-900" : inactiveText
      },
      pink: {
        container: isActive 
          ? `${baseContainer} bg-white/90 border-pink-200 shadow-md ring-1 ring-pink-100 scale-[1.02]` 
          : `${inactiveContainer} hover:border-pink-100 active:bg-pink-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-pink-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-pink-400`,
        text: isActive ? "text-pink-900" : inactiveText
      },
      purple: {
        container: isActive 
          ? `${baseContainer} bg-white/90 border-purple-200 shadow-md ring-1 ring-purple-100 scale-[1.02]` 
          : `${inactiveContainer} hover:border-purple-100 active:bg-purple-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-purple-400 to-violet-400 text-white shadow-purple-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-purple-400`,
        text: isActive ? "text-purple-900" : inactiveText
      },
      indigo: {
        container: isActive 
          ? `${baseContainer} bg-white/90 border-indigo-200 shadow-md ring-1 ring-indigo-100 scale-[1.02]` 
          : `${inactiveContainer} hover:border-indigo-100 active:bg-indigo-50`,
        icon: isActive 
          ? "bg-gradient-to-br from-indigo-400 to-violet-400 text-white shadow-indigo-200 border-transparent" 
          : `${inactiveIcon} group-hover:text-indigo-400`,
        text: isActive ? "text-indigo-900" : inactiveText
      },
      emerald: {
        container: isActive 
          ? `${baseContainer} bg-white/90 border-emerald-200 shadow-md ring-1 ring-emerald-100 scale-[1.02]` 
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
      {/* ✅ 상단바 높이 수정: h-[72px] -> h-[80px] */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm h-[80px]">
        <div className="w-full h-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2 group z-50">
            <Sparkles className="size-6 text-indigo-400 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight text-slate-800">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">pastel</span>
              hub
            </h1>
          </Link>

          {/* PC 메뉴 */}
          <nav className="hidden md:flex items-center gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const themeStyle = getThemeStyles(item.theme, isActive);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-5 py-2.5 ${themeStyle.container}`}
                >
                  {/* 아이콘 둥글기도 rounded-lg로 변경하여 네모난 느낌 통일 */}
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

          {/* 모바일 햄버거 버튼 */}
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>
      </header>

      {/* ✅ 모바일 메뉴 가로 배치 수정 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xl z-40 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* grid-cols-5를 사용하여 5개를 무조건 가로 한 줄로 배치 */}
          <div className="p-4 grid grid-cols-5 gap-2"> 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const themeStyle = getThemeStyles(item.theme, isActive);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  // flex-col로 아이콘 위, 텍스트 아래 배치
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 ${themeStyle.container}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
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