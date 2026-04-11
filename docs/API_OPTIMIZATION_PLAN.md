# Gemini API 최적화 및 유지보수성 개선 방안

> 작성일: 2026-04-12 | 상태: 실행 완료 예정

---

## 현재 API 호출 구조 현황

| 엔드포인트 | 목적 | 호출 빈도 | 캐싱 | 비고 |
|---|---|---|---|---|
| `api/chat` | 일반 챗봇 | 메시지마다 | ❌ | 단순 대화, 저부하 |
| `api/curriculum/chat` (chat) | 상담 질문 1~3회 | 최대 3회/세션 | ❌ | 대화 맥락에 강하게 의존 |
| `api/curriculum/chat` (generate) | 최종 커리큘럼 설계 | 세션당 1회 | ❌ | **가장 무거운 호출** |
| `api/onboarding` (generate) | 진단 문제 생성 | 세션당 1회 | ✅ | |
| `api/onboarding` (analyze) | 답변 분석 | 세션당 1회 | ❌ | |
| `api/teacher/generate-lecture` | 강의 초안 생성 | 요청당 1회 | ✅ | |
| `api/analytics/blind-point` | 취약점 분석 | 학습 로그마다 | ❌ | 실시간 분석 |

---

## 개선 항목 (우선순위순)

### P-0: `lib/gemini.ts` 모델 티어 분리

**현황**: `DEFAULT_MODEL` 하나. 가벼운 챗봇도, 무거운 커리큘럼 설계도 동일 모델.  
**개선**: 용도별 모델을 `MODELS` 상수로 명시적 분리.

```typescript
export const MODELS = {
  LITE: "gemini-3.1-flash-lite-preview",  // 챗봇 대화, 단순 Q&A
  STANDARD: "gemini-1.5-flash",           // 온보딩 문제 생성
  PRO: "gemini-3-flash-preview",          // 커리큘럼/강의 초안 설계
} as const
```

- **효과**: 단 한 파일 수정으로 전체 모델 전략 조정 가능

---

### P-0: `lib/prompts.ts` 프롬프트 중앙화

**현황**: 시스템 역할 문자열이 각 API 파일에 하드코딩 분산.  
**개선**: `SYSTEM_ROLES` 상수로 추출.

- **효과**: AI 동작 조정 시 한 파일만 편집. 토큰 절약.

---

### P-1: 챗봇 질문 사전 일괄 생성 (3회 → 1회)

**현황**: 사용자 답변마다 다음 질문을 실시간 생성 → 세션당 3회 API 호출.  
**개선**: 세션 시작 시 3개 질문을 한 번에 생성, 로컬 Queue에 저장 후 순차 표시.

```
현재: 답변 → API 호출 → 다음 질문 (x3회)
개선: 세션 시작 → API 호출 1회 → 3개 질문 Queue → 이후 API 0회
```

- **효과**: API -2회/세션 (3회 → 1회)

---

### P-1: 커리큘럼 생성 캐싱

**현황**: `api/curriculum/chat?action=generate`에 캐시 없음.  
**개선**: `ApiCache.generateKey(goal + onboardingResult)` 적용.

- **효과**: 동일 목표/결과 재요청 시 API -1회

---

### P-2: API 공통 응답 래퍼

**현황**: `try-catch` + `NextResponse.json()` 패턴이 모든 라우트에 반복.  
**개선**: `lib/api-helpers.ts`에 `withApiHandler()` 함수 추출.

---

## 구현 완료 체크리스트

- [x] `docs/API_OPTIMIZATION_PLAN.md` 저장
- [x] `lib/gemini.ts` 모델 티어 분리 (LITE / STANDARD / PRO)
- [x] `lib/prompts.ts` 프롬프트 중앙화
- [x] `api/curriculum/chat` 질문 사전 생성 방식으로 리팩토링 (3회→1회)
- [x] `api/curriculum/chat?action=generate` 캐싱 추가
