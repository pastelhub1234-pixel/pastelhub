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
      {/* ✅ [폰트 추가] 프리텐다드(Pretendard) 폰트 불러오기 */}
      <style>{`
        @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
        .font-pretendard { font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif; }
      `}</style>

      {/* ✅ [수정 1] 헤더 높이 64px (웹 표준 높이로 슬림하게) */}
      <header 
        className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-white/60 shadow-sm font-pretendard"
        style={{ height: '64px' }} 
      >
        <div className="w-full h-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* 로고 */}
          <Link to="/" className="shrink-0 group flex items-center gap-1.5 transition-opacity hover:opacity-80">
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">pastel</span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* 🟧 [메뉴] */}
          <nav className="hidden md:flex items-center gap-2 self-center"> 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              // ✅ [수정 2] 버튼 크기 확대 (h-[40px])
              // 헤더 64px - 버튼 40px = 위아래 12px 여백 (가장 안정적인 비율)
              // px-3.5: 좌우 여백을 살짝 늘려서 시원하게
              const baseLayout = "flex items-center gap-2 h-[40px] px-3.5 rounded-xl border transition-all duration-200 group active:scale-95 font-bold whitespace-nowrap";
              
              const activeColor = `bg-${item.id}-50 border-${item.id}-200 shadow-md ring-1 ring-${item.id}-100 text-${item.id}-900`;
              const inactiveColor = `bg-transparent border-transparent text-gray-500 hover-bg-${item.id}-50 hover-text-${item.id}-600`;

              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`${baseLayout} ${isActive ? activeColor : inactiveColor}`}
                >
                  <div className={`
                    flex items-center justify-center w-5 h-5 rounded-md shadow-sm transition-all duration-300 border border-slate-100 shrink-0
                    ${isActive ? `active-icon-${item.id} border-transparent` : `bg-white text-gray-400 group-hover-text-${item.id}-500 group-hover-border-${item.id}-200`}
                  `}>
                    {/* ✅ [수정 3] 아이콘 아주 작게 (size-3 = 12px) */}
                    <item.icon className="size-3" />
                  </div>
                  
                  {/* 글자 크기: 13px (폰트가 바뀌어서 가독성이 좋아짐) */}
                  <span className="text-[13px] tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 모바일 버튼 */}
          <button 
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {/* 모바일 메뉴 (top-[64px]) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[64px] left-0 w-full bg-white z-50 border-b border-slate-100 shadow-xl animate-in slide-in-from-top-2 fade-in duration-200 font-pretendard">
          <div className="p-3 w-full gap-1.5" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}> 
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const mobileLayout = "flex flex-col items-center justify-center gap-0.5 rounded-lg border transition-all duration-200 active:scale-95 h-[56px]";
              const mobileColor = isActive ? `bg-${item.id}-50 border-${item.id}-200 text-${item.id}-900` : `bg-transparent border-transparent text-gray-500`;

              return (
                <Link key={item.path} to={item.path} className={`${mobileLayout} ${mobileColor}`} style={{ flex: 1 }} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-md shadow-sm transition-all duration-300 border border-slate-100 shrink-0 ${isActive ? `active-icon-${item.id}` : 'bg-white text-gray-400'}`}>
                    <item.icon className="size-3" />
                  </div>
                  <span className="text-[11px] font-bold mt-0.5 whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
