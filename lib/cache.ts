/**
 * 간단한 In-Memory Cache 시스템
 * Next.js API 라우트에서 동일한 LLM 요청을 캐싱하여 API 할당량과 레이턴시를 최적화합니다.
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// Next.js 환경에서 HMR(Hot Module Replacement) 시 캐시가 날아가는 것을 방지하기 위해 global 객체 사용
const globalForCache = global as unknown as { apiCache: Map<string, CacheEntry<any>> };
const cache = globalForCache.apiCache || new Map<string, CacheEntry<any>>();

if (process.env.NODE_ENV !== 'production') {
  globalForCache.apiCache = cache;
}

const DEFAULT_TTL = 1000 * 60 * 60; // 1시간

export const ApiCache = {
  get<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    // 만료 확인
    if (Date.now() > entry.expiry) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  },

  set<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL): void {
    cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  },

  clear(): void {
    cache.clear();
  },

  // 객체를 안전한 캐시 키 문자열로 변환 (해싱 구조)
  generateKey(prefix: string, obj: any): string {
    try {
      const str = JSON.stringify(obj, Object.keys(obj).sort());
      // 단순 Base64 인코딩 등으로 키 압축 (심볼 등은 무시됨)
      // Node.js 기본 모듈인 crypto를 쓰면 좋지만, 환경 호환성을 위해 간단히 문자열로 처리
      return `${prefix}:${Buffer.from(str).toString('base64').substring(0, 50)}`;
    } catch {
      return `${prefix}:${Date.now()}`;
    }
  }
};
