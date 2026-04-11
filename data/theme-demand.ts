/**
 * 테마별 학습 수요 Mock 데이터
 * 실제 서비스에서는 ActivityLog, BlindPoint, Curriculum 테이블을
 * 집계(aggregate)하여 이 형태로 가공합니다.
 */

export interface ThemeDemand {
  theme: string;
  demandScore: number;       // 수요 지수 (0~100)
  studentCount: number;      // 해당 테마 관심 학생 수
  growthRate: number;         // 전월 대비 성장률 (%)
  avgBlindPointCount: number; // 해당 테마의 평균 취약점 수
  topKeywords: string[];      // 관련 인기 키워드
}

export const THEME_DEMAND_DATA: ThemeDemand[] = [
  {
    theme: "React / Next.js",
    demandScore: 92,
    studentCount: 347,
    growthRate: 18.5,
    avgBlindPointCount: 4.2,
    topKeywords: ["Hooks", "Server Components", "상태관리", "SSR"]
  },
  {
    theme: "Python 데이터 분석",
    demandScore: 85,
    studentCount: 289,
    growthRate: 12.3,
    avgBlindPointCount: 3.8,
    topKeywords: ["Pandas", "시각화", "Numpy", "전처리"]
  },
  {
    theme: "AI / LLM 활용",
    demandScore: 78,
    studentCount: 214,
    growthRate: 45.2,
    avgBlindPointCount: 5.1,
    topKeywords: ["프롬프트엔지니어링", "RAG", "LangChain", "Fine-tuning"]
  },
  {
    theme: "알고리즘 / 코딩테스트",
    demandScore: 71,
    studentCount: 198,
    growthRate: 8.7,
    avgBlindPointCount: 6.3,
    topKeywords: ["DP", "그래프", "이분탐색", "그리디"]
  },
  {
    theme: "Spring Boot 백엔드",
    demandScore: 65,
    studentCount: 156,
    growthRate: 5.2,
    avgBlindPointCount: 3.5,
    topKeywords: ["JPA", "REST API", "인증", "배포"]
  },
  {
    theme: "Unity 게임 개발",
    demandScore: 58,
    studentCount: 124,
    growthRate: 22.1,
    avgBlindPointCount: 4.7,
    topKeywords: ["C#", "물리엔진", "2D플랫포머", "UI시스템"]
  },
  {
    theme: "DevOps / CI·CD",
    demandScore: 42,
    studentCount: 87,
    growthRate: 15.8,
    avgBlindPointCount: 2.9,
    topKeywords: ["Docker", "GitHub Actions", "AWS", "모니터링"]
  }
];
