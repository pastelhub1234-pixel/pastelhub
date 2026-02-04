import { Link } from 'react-router-dom';
import { Calendar, Radio, Twitter, Zap, ShoppingBag, Sparkles } from 'lucide-react';
import MemberCard from '../components/MemberCard';
import { useJsonData } from '../hooks/useJsonData';

const QUICK_MENU_ITEMS = [
  {
    path: '/news/schedule',
    icon: Calendar,
    title: '일정',
    description: '다가오는 이벤트와 일정을 확인하세요',
    gradient: 'from-blue-400 to-cyan-400',
    size: 'col-span-1 row-span-1',
  },
  {
    path: '/news/broadcast',
    icon: Radio,
    title: '방송',
    description: '실시간 방송 현황',
    gradient: 'from-red-400 to-pink-400',
    size: 'col-span-1 row-span-1',
  },
  {
    path: '/news/twitter',
    icon: Twitter,
    title: '타임라인',
    description: '멤버들의 최신 소식',
    gradient: 'from-purple-400 to-indigo-400',
    size: 'col-span-2 row-span-1 md:col-span-1',
  },
  {
    path: '/activities',
    icon: Zap,
    title: '활동',
    description: '투표하고 함께 즐겨요',
    gradient: 'from-yellow-400 to-orange-400',
    size: 'col-span-1 row-span-1',
  },
  {
    path: '/others/goods',
    icon: ShoppingBag,
    title: '교환소',
    description: '굿즈 교환 정보',
    gradient: 'from-green-400 to-emerald-400',
    size: 'col-span-1 row-span-1',
  },
];

export default function Home() {
  const { data: members } = useJsonData<Member[]>('status');

  // ✅ 방송 중인 멤버 필터링 (수정됨)
  const liveMembers = members?.filter(
    (member) => member.status && (
      member.status.includes('chzzk_live') || // ✅ 소문자 chzzk_live 추가 (치지직)
      member.status.includes('X_live') ||     // 스페이스
      member.status.includes('LIVE') ||       // 대문자 LIVE (혹시 모를 호환성)
    )
  ) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="size-12 text-purple-500 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Pastelhub
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          팬덤을 위한 모든 정보가 한곳에 ✨
        </p>
      </div>

      {/* ✅ Live Members Section (모바일 전용) */}
      {liveMembers.length > 0 && (
        <div className="space-y-4 lg:hidden">
          <div className="flex items-center gap-2 px-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <h2 className="text-lg font-bold text-slate-700">
              현재 방송 중
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveMembers.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {QUICK_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${item.size} group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <Icon className="size-8 md:size-10 text-white drop-shadow-lg" />
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 blur-2xl" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl text-white drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/90 drop-shadow">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg">
          <p className="text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {members ? members.length : '-'}
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">멤버</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg">
          <p className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            5
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">다가오는 일정</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg">
          <p className="text-2xl md:text-3xl bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            {liveMembers.length}
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">LIVE 중</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg">
          <p className="text-2xl md:text-3xl bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            6
          </p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">교환 게시글</p>
        </div>
      </div>
    </div>
  );
}
