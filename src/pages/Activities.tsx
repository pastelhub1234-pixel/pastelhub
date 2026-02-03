import { ExternalLink, Vote, Users, Mic2 } from 'lucide-react';

const EXTERNAL_LINKS = [
  {
    id: 'bugs',
    title: '벅스 뮤직 차트 투표',
    description: '벅스에서 우리 아티스트에게 투표해주세요!',
    url: 'https://music.bugs.co.kr/',
    icon: Vote,
    gradient: 'from-orange-400 to-red-400',
  },
  {
    id: 'fansite',
    title: '공식 팬 커뮤니티',
    description: '다른 팬들과 소통하고 정보를 공유해요',
    url: 'https://cafe.daum.net/',
    icon: Users,
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'karaoke',
    title: '노래방 신청곡 투표',
    description: '노래방에 추가되길 원하는 곡에 투표하세요',
    url: 'https://www.tjmedia.com/',
    icon: Mic2,
    gradient: 'from-purple-400 to-pink-400',
  },
];

export default function Activities() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">활동</h1>
        <p className="text-slate-600">팬 활동에 참여해보세요</p>
      </div>

      {/* External Links Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {EXTERNAL_LINKS.map((link) => {
          const Icon = link.icon;
          
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              {/* Glass Effect Overlay */}
              <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
              
              {/* Content */}
              <div className="relative p-8 flex flex-col items-center text-center space-y-4 min-h-[280px] justify-between">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                    <Icon className="size-8 text-white drop-shadow-lg" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {link.title}
                    </h3>
                    <p className="text-sm text-white/90 drop-shadow leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                </div>

                {/* Link Button */}
                <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                  <span>바로가기</span>
                  <ExternalLink className="size-4" />
                </div>

                {/* Decorative Blur Circle */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
            </a>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 text-center">
        <p className="text-slate-700 leading-relaxed">
          💡 <strong>팁:</strong> 각 활동은 외부 사이트로 연결됩니다. 
          안전한 참여를 위해 공식 채널인지 확인해주세요!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
          <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            3
          </p>
          <p className="text-sm text-slate-600 mt-1">활동 채널</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            24/7
          </p>
          <p className="text-sm text-slate-600 mt-1">언제든지 참여</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ∞
          </p>
          <p className="text-sm text-slate-600 mt-1">무한한 응원</p>
        </div>
      </div>
    </div>
  );
}
