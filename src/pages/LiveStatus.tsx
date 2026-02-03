import { Radio, ExternalLink } from 'lucide-react';
import { MEMBERS } from '../constants';
import { MemberStatus } from '../types';

const STATUS_CONFIG: Record<MemberStatus, {
  bg: string;
  text: string;
  gradient: string;
  description: string;
}> = {
  LIVE: {
    bg: 'bg-red-500',
    text: 'LIVE',
    gradient: 'from-red-400 to-pink-400',
    description: '실시간 방송 중',
  },
  SPACE: {
    bg: 'bg-purple-500',
    text: 'SPACE',
    gradient: 'from-purple-400 to-indigo-400',
    description: '스페이스 진행 중',
  },
  OFFLINE: {
    bg: 'bg-gray-400',
    text: 'OFFLINE',
    gradient: 'from-gray-400 to-gray-500',
    description: '현재 오프라인',
  },
};

export default function LiveStatus() {
  const liveMembers = MEMBERS.filter(m => m.status === 'LIVE');
  const spaceMembers = MEMBERS.filter(m => m.status === 'SPACE');
  const offlineMembers = MEMBERS.filter(m => m.status === 'OFFLINE');

  const MemberCard = ({ member }: { member: typeof MEMBERS[0] }) => {
    const config = STATUS_CONFIG[member.status];
    const isActive = member.status !== 'OFFLINE';

    return (
      <a
        href={member.channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all
          ${isActive ? 'animate-pulse-slow' : ''}`}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={member.profileImage}
            alt={member.name}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        {/* Content */}
        <div className="relative p-6 h-full flex flex-col justify-between min-h-[200px]">
          {/* Status Badge */}
          <div className="flex justify-between items-start">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} text-white shadow-lg`}>
              {isActive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
              <span className="text-sm">{config.text}</span>
            </span>
            <ExternalLink className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Member Info */}
          <div className="space-y-2">
            <h3 className="text-2xl text-white drop-shadow-lg">
              {member.name}
            </h3>
            <p className="text-sm text-white/90 drop-shadow">
              {config.description}
            </p>
            
            {/* Message Bubble */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 mt-3">
              <p className="text-sm text-white drop-shadow">
                {member.message}
              </p>
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        {isActive && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>
        )}
      </a>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Radio className="size-8 text-red-500" />
          <h1 className="text-3xl md:text-4xl bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
            방송 현황
          </h1>
        </div>
        <p className="text-gray-600">멤버들의 실시간 방송을 확인하세요</p>
      </div>

      {/* Live Members */}
      {liveMembers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl text-gray-700 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE 중
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {liveMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Space Members */}
      {spaceMembers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl text-gray-700 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            SPACE 중
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {spaceMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Offline Members */}
      {offlineMembers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl text-gray-700">오프라인</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {offlineMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
