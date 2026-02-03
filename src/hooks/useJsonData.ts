import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDataWithRetry, dataService } from '../services/dataService';

export interface UseJsonDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * JSON 데이터를 가져오는 커스텀 훅
 * Firebase Hosting으로 전환 시 자동으로 적용됩니다.
 * 
 * @param key - 데이터 파일명 (확장자 제외)
 * @returns { data, loading, error, refetch }
 */
export function useJsonData<T>(key: string): UseJsonDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!key) {
      setLoading(false);
      return;
    }

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const jsonData = await fetchDataWithRetry<T>(key);
      
      // 요청이 취소되지 않았는지 확인
      if (!abortControllerRef.current?.signal.aborted) {
        setData(jsonData);
      }
    } catch (err) {
      // 요청이 취소된 경우 에러 무시
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error 
        ? err.message 
        : `데이터를 불러오는 중 오류가 발생했습니다: ${key}`;
      
      console.error(`[useJsonData] Error loading ${key}:`, err);
      setError(errorMessage);
      setData(null);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [key]);

  useEffect(() => {
    fetchData();

    // 클린업: 컴포넌트 언마운트 시 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    // 캐시 무시하고 다시 가져오기
    dataService.clearCache(key);
    await fetchData();
  }, [key, fetchData]);

  return { data, loading, error, refetch };
}
