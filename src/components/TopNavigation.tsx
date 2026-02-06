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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm h-[100px]">
        <div className="w-full h-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-1.5 transition-opacity hover:opacity-80 min-w-max">
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* 🖥️ PC 메뉴 */}
          <nav className="hidden md:flex items-center gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              // ✅ [수정] 레이아웃(모양)을 직접 정의하여 뭉개짐 방지
              const baseLayout = "flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-200 group active:scale-95 font-bold whitespace-nowrap";
              
              // ✅ 색상 클래스 (CSS 파일과 연결)
              const activeColor = `bg-${item.id}-50 border-${item.id}-200 shadow-md ring-1 ring-${item.id}-100 text-${item.id}-900`;
              const inactiveColor = `bg-transparent border-transparent text-gray-500 hover-bg-${item.id}-50 hover-text-${item.id}-600`;

              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`${baseLayout} ${isActive ? activeColor : inactiveColor}`}
                >
                  {/* 아이콘 박스: shrink-0으로 찌그러짐 방지 */}
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg shadow-sm transition-all duration-300 border shrink-0
                    ${isActive 
                      ? `active-icon-${item.id} border-transparent` // Active: 그라데이션
                      : `bg-white border-slate-100 text-gray-400 group-hover-text-${item.id}-500 group-hover-border-${item.id}-200` // Inactive
                    }
                  `}>
                    <item.icon className="size-4" />
                  </div>
                  
                  {/* 텍스트: 줄바꿈 방지 */}
                  <span className="text-sm">{item.label}</span>
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
              
              // 모바일 레이아웃 & 색상
              const mobileLayout = "flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all duration-200 active:scale-95 h-[72px]";
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
                    flex items-center justify-center w-10 h-10 rounded-lg shadow-sm transition-all duration-300 border border-slate-100 shrink-0
                    ${isActive ? `active-icon-${item.id}` : 'bg-white text-gray-400'}
                  `}>
                    <item.icon className="size-5" />
                  </div>
                  <span className="text-[11px] font-bold mt-1 whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
