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
      {/* 🔴 [진단 1] 헤더 영역 전체에 빨간 테두리 + 배경색 */}
      {/* sticky가 문제인지 확인하기 위해 잠시 relative로 변경할 수도 있지만, 일단 sticky 유지 */}
      <header className="sticky top-0 z-50 h-[100px] flex flex-col border-4 border-red-600 bg-gray-100">
        
        {/* 디버깅 라벨 */}
        <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] px-1 z-50">
          HEADER AREA (100px)
        </div>

        {/* 🟢 [진단 2] 위쪽 스페이서 (초록색) */}
        {/* shrink-0을 줘서 절대 찌그러지지 않게 함 */}
        <div className="h-[30px] w-full bg-green-400 shrink-0 flex items-center justify-center border-b border-black">
          <span className="text-xs font-bold text-black">TOP SPACER (30px)</span>
        </div>

        {/* 🔵 [진단 3] 중간 콘텐츠 (파란색) */}
        {/* h-[40px] 강제 지정 */}
        <div className="h-[40px] w-full bg-blue-300 shrink-0 flex items-center px-4">
          <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between">
            
            {/* 로고 */}
            <div className="bg-white px-2">로고</div>

            {/* PC 메뉴 */}
            <nav className="hidden md:flex items-center gap-2 h-full bg-white/50 px-2"> 
              {NAV_ITEMS.map((item) => (
                <div key={item.path} className="border border-black px-2 h-[30px] flex items-center bg-white text-xs">
                  {item.label}
                </div>
              ))}
            </nav>

            <div className="md:hidden bg-white">메뉴</div>
          </div>
        </div>

        {/* 🟡 [진단 4] 아래쪽 스페이서 (노란색) */}
        <div className="h-[30px] w-full bg-yellow-400 shrink-0 flex items-center justify-center border-t border-black">
          <span className="text-xs font-bold text-black">BOTTOM SPACER (30px)</span>
        </div>

      </header>
    </>
  );
}
