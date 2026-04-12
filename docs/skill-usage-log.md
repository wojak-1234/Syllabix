# Skill Usage Log

### [Skill Usage Log]

- Timestamp: 2026-04-12T02:44:21+09:00
- Skill Name: skill-usage-logger

- Context:
사용자가 새로 생성한 .skills 폴더와 내부 스킬 파일(git-pushing, production-code-audit, skill-usage-logger)들에 대한 평가를 요청하고, 로깅 시스템의 즉각적인 적용을 지시함.

- Reason for Using This Skill:
모든 스킬 사용 과정을 투명하게 기록하라는 skill-usage-logger의 지침에 따라, 시스템 도입 후 첫 번째 활동을 기록하기 위함.

- Execution Summary:
1. .skills 디렉토리의 전체 구조 파악.
2. 각 스킬 파일(SKILL.md)의 메타데이터 및 워크플로우 분석.
3. skill-usage-logger의 역할 정의 및 향후 적용 계획 수립.
4. docs/skill-usage-log.md 파일 생성 및 첫 로그 기록.

- Result:
스킬 평가 완료 및 공식적인 활동 기록 시스템(Audit Log) 가동 시작.

- User Intervention:
No.

- Improvement Insight:
skill-usage-logger 스킬 정의서에 수동 로그 작성이 아닌, 자동 스크립트화(예: 로깅용 CLI 도구)가 추가된다면 기록의 일관성을 더욱 높일 수 있음. 현재는 지침에 따라 수동 기록 수행.

### [Skill Usage Log]

- Timestamp: 2026-04-12T02:49:15+09:00
- Skill Name: skill-usage-logger

- Context:
사용자가 작성한 'CodeMentor AI MVP 기획 문서(docs/project-overview.md)'를 검토하고, 프로젝트의 핵심 가치와 기술 스택을 파악함.

- Reason for Using This Skill:
프로젝트의 방향성이 결정되는 중요한 마일스톤을 기록하고, AI가 파악한 서비스의 핵심 철학(소크라테스식 교육 등)을 로그에 남기기 위함.

- Execution Summary:
1. docs/project-overview.md 내용 전수 검토.
2. 'Blind Point 탐지', 'Socratic IDE', 'Agentic AI' 등 핵심 기능의 기술적 구현 가능성 확인.
3. 프로젝트 가이드라인에 따른 협업 로그 작성 루틴 준수.

- Result:
AI가 프로젝트의 전체 컨텍스트를 완벽히 동기화함. 향후 코드 생성 및 상담 시 '직접 답을 주지 않는' 원칙을 고수할 준비 완료.

- User Intervention:
No.

- Improvement Insight:
기획 문서에 정의된 'AI 및 데이터 흐름' 도표를 바탕으로, 실제 구현 시 필요한 DB 스키마(Prisma)를 미리 제안하면 개발 속도를 높일 수 있음.

### [Skill Usage Log]

- Timestamp: 2026-04-12T03:02:00+09:00
- Skill Name: skill-usage-logger

- Context:
기획 문서에 기반한 API 라우트 구조 개편을 수행함. 사용자의 요청에 따라 모든 AI 엔진은 Claude 대신 Gemini API를 사용하도록 구현.

- Reason for Using This Skill:
대규모 파일 구조 변경 및 신규 API 라우트 생성 과정을 기록하여 프로젝트 진행 상황을 추적하기 위함.

- Execution Summary:
1. `app/api/` 하위에 `onboarding`, `chat`, `analytics/blind-point`, `lectures` 디렉토리 구성.
2. `onboarding/route.ts`: 진단 테스트 분석용 Gemini API 연동.
3. `chat/route.ts`: 소크라테스식 대화 가이드를 포함한 페어 프로그래머 API 구현.
4. `analytics/blind-point/route.ts`: 활동 로그 기반 취약점 탐지 로직 구성.
5. `lectures/`: RAG 파이프라인(업로드/검색)을 위한 보일러플레이트 작성.

- Result:
공모전 MVP를 위한 백엔드 API 골격 완성. 프런트엔드 연동 준비 완료.

- User Intervention:
No.

- Improvement Insight:
각 API마다 중복되는 Gemini 초기화 로직을 `lib/gemini.ts` 등으로 모듈화하면 코드 중복을 줄이고 모델 설정을 일괄 관리할 수 있음.

### [Skill Usage Log]

- Timestamp: 2026-04-12T03:16:30+09:00
- Skill Name: skill-usage-logger

- Context:
Gemini API 사용 로직의 모듈화(Modularization)를 수행함.

- Reason for Using This Skill:
중복 코드를 제거하고 향후 모델 설정(Temperature, Max Tokens 등)을 한곳에서 관리할 수 있는 구조를 구축하기 위함.

- Execution Summary:
1. `lib/gemini.ts` 생성: `GoogleGenerativeAI` 초기화 및 `getGeminiModel` 헬퍼 함수 구현.
2. 기존 모든 API 라우트(`onboarding`, `chat`, `blind-point`, `curriculum/generate`) 리팩토링.
3. 직접적인 SDK 호출 방식을 전역 라이브러리 참조 방식으로 변경.

- Result:
코드 유지보수성이 대폭 향상되었으며, 신규 AI 기능 추가 시 일관된 설정을 즉시 적용할 수 있게 됨.

- User Intervention:
No.

- Improvement Insight:
프런트엔드에서 API 응답 타입을 인터페이스로 정의하여 공유하면, API와 클라이언트 간의 데이터 정합성을 더 완벽하게 유지할 수 있음.

### [Skill Usage Log]

- Timestamp: 2026-04-12T03:19:00+09:00
- Skill Name: skill-usage-logger

- Context:
사용자가 기획한 'AI 협업 문서 구조' 매뉴얼에 따라 전체 문서 체계를 물리적으로 구축함.

- Reason for Using This Skill:
프로젝트의 투명성을 높이고, 공모전 심사 시 AI와의 협업 서사(Narrative)를 증명하기 위한 기반 자료를 확보하기 위함.

- Execution Summary:
1. `docs/ai-sessions/` 폴더 생성 및 첫 세션 로그 기록.
2. `docs/ARCHITECTURE_DECISIONS.md` 작성 (사용자 제공 저널 기반).
3. `docs/AI_PLANNING.md`, `docs/PROMPT_GUIDE.md`, `docs/AI_REVIEW_LOG.md` 초기화 및 내용 동기화.
4. 기존 로그 내용을 통합하여 심사용 문서로 마이그레이션.

- Result:
기획 문서에서 정의한 AI 협업 관리 체계가 100% 실행 상태로 전환됨.

- User Intervention:
Yes (사용자가 직접 기획 저널 콘텐츠를 제공하여 문서화 지시).

- Improvement Insight:
각 개발 단계(Phase)가 끝날 때마다 개발 로그를 `ai-sessions` 폴더에 자동으로 아카이빙하는 루틴을 유지해야 함.

### [Skill Usage Log]

- Timestamp: 2026-04-12T03:20:00+09:00
- Skill Name: skill-usage-logger

- Context:
공모전 심사 및 가독성을 위해 `docs/` 내의 모든 문서를 한국어로 번역 및 재작성함.

- Reason for Using This Skill:
문서의 언어 변경은 중요한 컨텍스트 변화이므로, 어떤 문서가 어떤 이유로 변경되었는지 기록하기 위함.

- Execution Summary:
1. `AI_REVIEW_LOG.md`, `AI_PLANNING.md`, `PROMPT_GUIDE.md`, `ai-sessions/2026-04-12_ideation.md`를 한국어로 재작성.
2. 기획 저널의 톤앤매너와 전문 용어(Socratic Mode, Agentic AI 등)를 일관되게 유지.

- Result:
심사위원이 검토 가능한 수준의 고품질 한국어 문서 체계 구축 완료.

- User Intervention:
Yes (한국어 변경 요청).

- Improvement Insight:
향후 신규 문서 작성 시 처음부터 한국어로 작성하여 불필요한 번역 과정을 제거할 것.

### [Skill Usage Log]

- Timestamp: 2026-04-12T03:33:40+09:00
- Skill Name: skill-usage-logger

- Context:
챗봇 상담 워크플로우를 문맥 기반 스타일로 고도화함.

- Reason for Using This Skill:
대화형 인터페이스의 중복을 제거하여 사용자 경험을 최적화하고, 더욱 가치 있는 학습 데이터(방법론)를 추출하기 위함.

- Execution Summary:
1. `app/api/curriculum/chat/route.ts`의 `PREFERENCE_QUESTIONS` 리스트 수정.
2. 기술 스택 관련 질문을 삭제하고 학습 스타일, 가치, 장애물 관련 질문으로 교체.
3. `app/chatbot/page.tsx`의 첫 인사말에 사용자의 기존 목표를 반영하도록 수정.

- Result:
학습자와의 대화가 더 자연스러워지고, 수집된 데이터를 통해 더 정밀한 커리큘럼 설계 가능.

- User Intervention:
Yes (중복 질문 제거 및 방법론 중심 질문 요청).

- Improvement Insight:
질문 리스트 자체를 AI가 `initialForm`을 보고 실시간으로 생성하도록 변경하면 더욱 극대화된 개인화 경험을 줄 수 있음.

### [Skill Usage Log]

- Timestamp: 2026-04-12T03:38:00+09:00
- Skill Name: skill-usage-logger

- Context:
Chatbot 상담 페이지에서 Onboarding 진단 테스트로 이어지는 Seamless한 워크플로우를 구축함.

- Reason for Using This Skill:
단절된 UI(Chatbot -> Dashboard -> Onboarding)를 통합하여, 사용자의 성향과 약점을 Onboarding 문제 출제 시 즉각적으로 반영하기 위함.

- Execution Summary:
1. `app/chatbot/page.tsx`: '커리큘럼 생성' 대신 `sessionStorage`에 대화 맥락(chatContext)을 저장하고 `/onboarding`으로 리디렉션하도록 수정.
2. `app/onboarding/page.tsx`: 마운트 시 `chatContext`를 읽어 '목표 입력(Goal)' 단계를 건너뛰고 자동으로 퀴즈 렌더링 로직 실행.
3. `app/api/onboarding/route.ts`: 프롬프트를 고도화하여 챗봇 상담 결과를 분석하고 이를 바탕으로 한 '핵심 원리 기반'의 날카로운 5가지 문제를 출제하도록 변경.

- Result:
단순한 목표 기반이 아닌, 이전 대화 내용(약점, 선호, 실패 경험)까지 아우른 진정한 의미의 '초개인화 진단 테스트' 구현 완료.

- User Intervention:
Yes (챗봇 정보를 반영한 예리한(Meticulous) 기초 지식 질문 요구).

- Improvement Insight:
진단 테스트 결과를 바탕으로 커리큘럼을 생성하는 것도 백그라운드 워커를 통해 자동으로 진행하면 사용자의 대기 시간을 더욱 쾌적하게 만들 수 있음.



### [Skill Usage Log]

- Timestamp: 2026-04-12T03:21:40+09:00
- Skill Name: skill-usage-logger

- Context:
CodeMentor AI의 데이터 레이어 구축을 위한 Prisma 데이터베이스 스키마 설계를 수행함.

- Reason for Using This Skill:
학습자의 행동 데이터를 체계적으로 축적하고, AI가 취약점(Blind Point)을 탐지할 수 있는 객체 지향적 데이터 구조를 확립하기 위함.

- Execution Summary:
1. `prisma/` 디렉토리 신규 생성.
2. `User`, `Curriculum`, `Lecture`, `ActivityLog`, `BlindPoint` 등 핵심 모델 정의.
3. `.env.local` 파일에 `DATABASE_URL` 플레이스홀더 추가.
4. 사용자 활동 로그를 JSON으로 유연하게 저장할 수 있는 구조 설계.

- Result:
데이터베이스 연동 준비 완료. 기획된 모든 AI 기능(튜터링, 취약점 분석 등)이 데이터를 영구적으로 관리할 수 있는 기반 마련.

- User Intervention:
No.

- Improvement Insight:
`ActivityLog` 모델에 인덱스를 추가하면, 대량의 데이터가 쌓였을 때 AI 에이전트의 분석 쿼리 속도를 최적화할 수 있음.

### [Skill Usage Log]

- Timestamp: 2026-04-12T03:25:00+09:00
- Skill Name: skill-usage-logger

- Context:
기존 웹사이트의 디자인 시스템(Orange/Amber 테마)을 계승한 프런트엔드 온보딩 진단 테스트 UI를 개발함.

- Reason for Using This Skill:
학습자가 처음 마주하는 UI의 일관성을 유지하고, AI 분석을 위한 데이터 수집 접점을 완성하기 위함.

- Execution Summary:
1. `app/onboarding/page.tsx` 생성 및 스타일링 적용.
2. 5가지 항목의 인터랙티브 진단 퀴즈 구현.
3. `/api/onboarding` 호출 로직 및 결과 데이터(sessionStorage) 관리 로직 통합.
4. `AnimatedBackground`, `Navbar` 등 공통 컴포넌트 재사용으로 일관성 확보.

- Result:
사용자 친화적이고 전문적인 느낌의 온보딩 워크플로우 완성.

- User Intervention:
Yes (기존 메뉴의 색상 테마 반영 요청).

- Improvement Insight:
문항 전환 시 애니메이션 라이브러리(Framer Motion 등)를 추가하면 더욱 프리미엄한 사용자 경험(UX)을 제공할 수 있음.

---

### Session: 2026-04-12 (04:00 ~ 05:06)

#### Skill: RAG 지식 베이스 구축 및 커리큘럼 연동
- Timestamp: 2026-04-12T04:30:00+09:00
- Task Description:
AI 커리큘럼 생성 시 실제 강의 콘텐츠를 자동 매칭하는 In-context RAG 파이프라인 구축.

- Reason for Using This Skill:
생성된 커리큘럼이 단순 계획표에 그치지 않고, 실제 학습 자료와 연결되어야 교육적 가치가 극대화됨.

- Execution Summary:
1. `data/mock-courses.ts`: 6개 강의/도서 Mock 지식 베이스 생성 (제목, 플랫폼, 난이도, 태그, 설명).
2. `app/api/curriculum/chat/route.ts` 프롬프트에 지식 베이스 인덱스 주입 → AI가 `linkedCourseIds` 자동 배정.
3. `app/dashboard/page.tsx`에 "AI 추천 학습 리소스" 위젯 추가 (PlayCircle 아이콘, 플랫폼 배지, 외부 링크).
4. `/dashboard/demo` 데모 페이지 생성: API 호출 없이 결과 확인 가능한 쇼케이스.

- Result:
커리큘럼의 각 주차에 관련 강의가 자동으로 추천되어 학습 자료 접근성 향상.

- User Intervention:
Yes (Mock 형태로 먼저 미리보기 요청 → 데모 페이지 추가).

#### Skill: 교사 역할 기반 Navbar 동적 메뉴
- Timestamp: 2026-04-12T04:51:00+09:00
- Task Description:
교사 로그인 시 Navbar 메뉴 항목을 교사 전용('홈/강의 분석/대시보드/교사')으로 동적 전환.

- Execution Summary:
1. `components/navbar.tsx`의 정적 `navItems` 배열을 `guestItems` / `teacherItems`로 분리.
2. `userRole` 상태에 따라 런타임에 메뉴 교체.
3. 교사 전용 경로: `/teacher/analytics`, `/teacher/dashboard`.

- Result:
역할별 메뉴 분기가 즉시 반영되며 접근 제어(RBAC) 기반 네비게이션 완성.

#### Skill: 교사 대시보드 수요 분석 시각화
- Timestamp: 2026-04-12T04:54:00+09:00
- Task Description:
학생 학습 데이터를 집계하여 테마별 수요를 막대그래프로 시각화하고, AI 추천 강의 테마를 교사에게 제시.

- Execution Summary:
1. `data/theme-demand.ts`: 7개 테마 수요 Mock 데이터 (수요 지수, 학생 수, 성장률, 취약점, 키워드).
2. `app/api/teacher/demand/route.ts`: 수요 데이터 정렬 반환 REST API.
3. `app/teacher/dashboard/page.tsx`: 통계 카드 3개 + 커스텀 CSS 막대그래프 + AI 추천 패널 + 강의 생성 모달.

- Result:
교사가 데이터 기반으로 가장 수요가 높은 강의 테마를 한눈에 파악 가능.

#### Skill: T-02 Multi-step Chain AI 강의 초안 생성
- Timestamp: 2026-04-12T05:01:00+09:00
- Task Description:
수요 키워드 클릭 → 원클릭으로 강의 목차·설명·문제 세트를 AI가 3단계 순차 자동 생성.

- Execution Summary:
1. `app/api/teacher/generate-lecture/route.ts`: Gemini 기반 3단계 순차 체인 (Step 1: 목차 → Step 2: 섹션별 설명+코드 예제 → Step 3: 진단 문제 세트).
2. `app/teacher/lecture-draft/page.tsx`: 생성 진행 3단계 시각화, 아코디언 섹션 카드, 코드 블록, 강사 팁, 인터랙티브 퀴즈 카드, 탭 전환.
3. 대시보드 모달 리팩토링: "AI로 강의 초안 생성하기" 원클릭 트리거 → sessionStorage로 데이터 전달 → `/teacher/lecture-draft` 리다이렉트.

- Result:
강사가 제목과 난이도만 설정하면 AI가 강의 전체 초안(목차+내용+문제)을 자동 생성하여 제작 진입 장벽 대폭 감소.

- User Intervention:
No (project-overview.md T-02 명세에 따라 자율 구현).

- Improvement Insight:
향후 강사가 초안의 각 섹션을 인라인 편집할 수 있는 ContentEditable 기능을 추가하면 검토·수정 워크플로우가 더욱 완성됨.

---

### Session: 2026-04-12 (05:11 ~ 05:55) — API 최적화

#### Skill: Gemini API 호출 구조 감사 및 단일 호출 최적화
- Timestamp: 2026-04-12T05:11:00+09:00
- Task Description:
전체 API 호출 지점을 grep으로 전수 확인하고, 가장 큰 병목인 Multi-step Chain의 불필요한 연속 호출을 제거.

- Reason for Using This Skill:
API Quota 초과로 서비스가 자주 중단되어, 근본적인 호출 횟수 절감이 필요.

- Execution Summary:
1. `api/teacher/generate-lecture`: 목차/설명/퀴즈 3개 스키마를 단일 `lectureSchema`로 통합, 3회 호출 → 1회.
2. `lib/cache.ts` 신규 생성: `global.apiCache` 기반 TTL In-Memory 캐시 모듈.
3. `api/teacher/generate-lecture`, `api/onboarding` 양쪽에 `ApiCache.get / set` 래핑.

- Result:
강의 초안 생성 시 API 호출 66% 절감. 동일 요청 재시도 시 0회 호출.

- User Intervention:
No (쿼터 초과 상황 보고 후 자율 분석 및 개선).

#### Skill: 코드 유지보수성 향상 및 전방위 API 절감 리팩토링
- Timestamp: 2026-04-12T05:50:00+09:00
- Task Description:
`docs/API_OPTIMIZATION_PLAN.md`에 전략을 수립하고, 계획의 모든 항목을 순차 구현.

- Reason for Using This Skill:
하드코딩된 프롬프트와 단일 모델 설정이 유지보수성을 저해하고, 챗봇 대화 API가 세션당 3회 호출되는 구조적 낭비 해소 필요.

- Execution Summary:
1. `lib/gemini.ts` 리팩토링: `MODELS = { LITE, STANDARD, PRO }` 3단계 분리, `DEFAULT_MODEL` deprecated 처리.
2. `lib/prompts.ts` 신규 생성: `SYSTEM_ROLES`, `COMMON_RULES`, `buildCurriculumPrompt()`, `buildOnboardingQuestionPrompt()`, `buildPrefetchQuestionsPrompt()` 빌더 함수 중앙화.
3. `api/curriculum/chat` 리팩토링: `prefetch` 액션 추가(질문 3개 일괄 생성), `generate` 액션에 캐싱 적용, 각 모델에 MODELS 티어 명시.
4. `app/chatbot/page.tsx` 리팩토링: `questionQueue` 상태 도입, prefetch 응답을 Queue에 저장 후 API 0회로 순차 표시.
5. `api/onboarding` 리팩토링: `MODELS.STANDARD` + `buildOnboardingQuestionPrompt()` 적용으로 하드코딩 프롬프트 제거.
6. `docs/API_OPTIMIZATION_PLAN.md` 저장 및 체크리스트 전체 완료 처리.

- Result:
챗봇 상담 세션 API 호출 3회→1회, 커리큘럼/온보딩/강의 초안 재요청 0회 달성.
프롬프트 수정 시 `lib/prompts.ts` 1개 파일만 편집하면 전체 AI 동작 일괄 조정 가능.

- User Intervention:
Yes (계획 수립 후 승인 요청 → 전체 실행 지시).

- Improvement Insight:
`api/analytics/blind-point`와 `api/chat`에도 동일한 MODELS 티어 및 캐싱 패턴을 적용하면 나머지 미적용 구간도 최적화 완성됨.

---

### Session: 2026-04-12 (16:23 ~ 16:34) — v3 구조 전환

#### Skill: v3 Gap Analysis 및 구조 전환 계획 수립
- Timestamp: 2026-04-12T16:23:00+09:00
- Task Description:
project-overview.md v3 확정 구조와 현재 코드베이스 간의 차이를 전수 분석하고, 5단계 작업 계획(Phase 1~5)을 수립.

- Reason for Using This Skill:
v2→v3 구조 변경 범위가 DB 스키마부터 Teacher/Student UI 전면 재구축까지 포괄하므로, 체계적인 Gap 분석 없이는 작업 누락 위험이 높음.

- Execution Summary:
1. project-overview.md diff 분석: 커리큘럼 주체 역전(학생→강사), 수요 예측 제거, 오답노트 신규 등 7가지 핵심 변경사항 도출.
2. 현재 코드베이스 전수 조사: `app/`, `components/`, `lib/`, `prisma/`, `data/` 전체 파일 검토.
3. 영역별 변경 사항 정리: DB 스키마, Teacher 영역, Student 영역, 프롬프트 시스템, 유지 가능 부분.
4. 작업 우선순위 Phase 1~5 정의.
5. Claude API → Gemini API 유지 확인 및 문서 수정 포인트 명시.

- Result:
Gap 분석 아티팩트 문서 생성 (`v3_gap_analysis.md`). 전체 변경 범위와 우선순위가 명확히 정의됨.

- User Intervention:
Yes (v3 문서 제공, Claude→Gemini 유지 지시).

#### Skill: Phase 1 — Prisma 스키마 전면 재설계
- Timestamp: 2026-04-12T16:27:00+09:00
- Task Description:
v3 구조에 맞게 Prisma 데이터베이스 스키마를 전면 재설계하고 인프라를 정비.

- Reason for Using This Skill:
기존 `Curriculum` (학생 소유, phases JSON) 구조가 v3의 "강사 설계 + 학생 Join" 패러다임과 근본적으로 불일치.

- Execution Summary:
1. `prisma/schema.prisma` 전면 교체:
   - `Curriculum` → `Series` (강사 소유, 상태/공개 설정 포함)
   - `Lecture`: Series 종속, `order`, `learningObjective`, `conceptTags` 필드 추가
   - `Enrollment`: 학생-Series Join 관계, 진도 추적
   - `Quiz`: Lecture 종속, 선택지 JSON, 개념 태그
   - `CodingTest`: Lecture 종속, 입출력 예시, 정답코드, 채점기준
   - `Submission`: 최대 3회 제출, 코드 스냅샷, 에러 분류, AI 힌트 저장
   - `ErrorNote`: 퀴즈 오답/코딩 3회 실패 시 자동 생성, 보충 학습 연결
   - `ActivityLog`, `BlindPoint`: 기존 유지
2. Prisma 5.22 설치 (`devDependencies`).
3. `.env` 파일 생성 (Prisma CLI용 DATABASE_URL 분리).
4. `.gitignore`에 `.env` 추가.
5. `prisma validate` → `prisma generate` → `prisma format` 모두 통과.

- Result:
v3 구조를 지원하는 10개 모델의 관계형 스키마 확정. Prisma Client 생성 완료.

- User Intervention:
No (Phase 1 진행 지시에 따라 자율 실행).

- Improvement Insight:
실제 PostgreSQL 연결 후 `prisma migrate dev`로 마이그레이션 수행 필요. 현재는 placeholder URL이므로 스킵.

