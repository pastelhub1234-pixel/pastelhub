/**
 * 데이터 서비스 레이어
 * Firebase Hosting으로 전환 시 이 파일만 수정하면 됩니다.
 */

import { config } from '../config/env';

export interface DataService {
  fetchData<T>(key: string): Promise<T>;
  clearCache(key?: string): void;
}

/**
 * 로컬 JSON 파일 데이터 서비스
 */
class LocalDataService implements DataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  
  async fetchData<T>(key: string): Promise<T> {
    const cacheKey = key;
    const cached = this.cache.get(cacheKey);
    
    // 캐시 확인
    if (config.cache.enabled && cached) {
      const age = Date.now() - cached.timestamp;
      if (age < config.cache.ttl) {
        return cached.data as T;
      }
    }
    
    // 데이터 가져오기
    const url = `${config.localDataPath}/${key}.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`데이터를 찾을 수 없습니다: ${key}.json (${response.status})`);
    }
    
    const data = await response.json();
    
    // 캐시 저장
    if (config.cache.enabled) {
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
    }
    
    return data as T;
  }
  
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

/**
 * Firebase Storage 데이터 서비스
 * Firebase Hosting 전환 시 구현
 */
class FirebaseDataService implements DataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  
  async fetchData<T>(key: string): Promise<T> {
    // TODO: Firebase Storage 구현
    // 예시:
    // const storage = getStorage();
    // const storageRef = ref(storage, `${config.firebaseStoragePath}/${key}.json`);
    // const url = await getDownloadURL(storageRef);
    // const response = await fetch(url);
    // const data = await response.json();
    
    throw new Error('Firebase Storage는 아직 구현되지 않았습니다.');
  }
  
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

/**
 * 데이터 서비스 팩토리
 */
function createDataService(): DataService {
  switch (config.dataSource) {
    case 'firebase':
      return new FirebaseDataService();
    case 'local':
    default:
      return new LocalDataService();
  }
}

// 싱글톤 인스턴스
export const dataService = createDataService();

/**
 * 재시도 로직이 포함된 데이터 가져오기
 */
export async function fetchDataWithRetry<T>(
  key: string,
  retries = config.retry.maxAttempts
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await dataService.fetchData<T>(key);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < retries) {
        // 지수 백오프: 1초, 2초, 4초...
        const delay = config.retry.delayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error(`데이터를 가져올 수 없습니다: ${key}`);
}

