/**
 * 환경 변수 설정
 * Firebase Hosting으로 전환 시 이 파일만 수정하면 됩니다.
 */

export type DataSource = 'local' | 'firebase';

export const config = {
  // 데이터 소스 설정: 'local' 또는 'firebase'
  dataSource: (import.meta.env.VITE_DATA_SOURCE as DataSource) || 'local',
  
  // Firebase 설정 (Firebase 사용 시)
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  },
  
  // 로컬 데이터 경로 (현재 사용 중)
  localDataPath: '/data',
  
  // Firebase Storage 경로 (Firebase 사용 시)
  firebaseStoragePath: 'data',
  
  // 재시도 설정
  retry: {
    maxAttempts: 3,
    delayMs: 1000,
  },
  
  // 캐시 설정
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5분
  },
} as const;

