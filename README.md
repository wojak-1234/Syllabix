# 🚀 Syllabix: AI-Powered Personalized Learning Platform

Syllabix는 학습자의 수준과 목표에 맞춰 AI가 최적의 커리큘럼을 즉시 설계하고, 데이터를 기반으로 학습 성과를 분석하는 **차세대 교육 솔루션**입니다.

---

## 🏗️ 1. 기술 스택 (Tech Stack)

Syllabix는 최신 웹 표준과 고성능 AI 모델을 결합하여 견고한 풀스택 아키텍처를 구축했습니다.

*   **Core Framework**: Next.js 14+ (App Router), React, TypeScript
*   **Styling**: Vanilla CSS + Tailwind CSS (Modern Glassmorphism UI)
*   **Database**: PostgreSQL (Prisma ORM)
*   **AI Engine**: 
    *   **Gemini 3.1 Pro**: 심층 데이터 분석 및 복잡한 커리큘럼 설계용
    *   **Gemini 3.1 Flash-Lite**: 실시간 챗봇 상담 및 빠른 문제 생성용
*   **Context Management**: 
    *   **Vector RAG**: 강의 교안 기반 정밀 응답 (추후 확장)
    *   **Semantic Batching**: 토큰 효율을 위한 일괄 생성 기법
*   **Infrastructure**: pnpm (Package Manager), Vercel (Deployment)

---

## 📂 2. 프로젝트 폴더 구조 (Project Structure)

Syllabix는 대규모 AI 애플리케이션의 확장성과 유지보수성을 고려하여 구조화되었습니다.

```text
/
├── app/                    # Next.js App Router (페이지 및 API)
│   ├── api/                # 백엔드 API 엔드포인트 (AI, DB 트랜잭션 등)
│   ├── teacher/            # 교수자용 대시보드 및 강좌 관리 페이지
│   ├── student/            # 학습자용 학습 대시보드 및 수강 페이지
│   ├── curriculum/         # 커리큘럼 생성 및 프리뷰 플로우
│   └── (공통)/             # Onboarding, Chatbot 등 공통 서비스
├── components/             # 재사용 가능한 UI 컴포넌트 (Shadcn UI 기반)
├── lib/                    # 핵심 비즈니스 로직 및 유틸리티
│   ├── gemini.ts           # Google Gemini AI 연동 모듈
│   ├── prisma.ts           # Prisma ORM 인스턴스 관리
│   ├── prompts.ts          # AI 프롬프트 템플릿 중앙 관리
│   └── cache.ts            # API 결과 캐싱 및 성능 최적화
├── prisma/                 # DB 스키마 설계 및 마이그레이션 파일
├── public/                 # 이미지, 아이콘 등 정적 자산
├── scratch/                # 개발/디버깅용 임시 스크립트 (DB 검증 등)
├── docs/                   # 아키텍처 및 시스템 상세 문서
└── styles/                 # 글로벌 스타일 및 테마 정의
```

---

## 🔗 3. 상세 API 엔드포인트 명세

Syllabix의 API는 역할별 권한 및 기능에 따라 계층적으로 설계되었습니다.

### 🎓 Student Endpoints (학습자 전용)
- `GET /api/student/dashboard`: 학생의 전반적인 수강 현황 및 진도율 요약 정보.
- `GET /api/student/enrollments`: 현재 수강 중인 모든 강좌 리스트 조회.
- `POST /api/student/enrollment/[seriesId]`: 특정 강좌 시리즈 수강 신청 처리.
- `POST /api/student/evaluate`: 학습자의 제출 답안(퀴즈/코딩)에 대한 AI 자동 채점에서 분석.
- `POST /api/student/generate-test`: 강의 내용을 반영한 개인화 문항(Test) 생성.
- `POST /api/student/tutor-chat`: 특정 강의 컨텍스트 기반의 AI 튜터 1:1 상담.

### 👨‍🏫 Teacher Endpoints (교수자 전용)
- `GET /api/teacher/analytics/analyze`: 수강생들의 평균 정답률, 주요 오답 포인트, 개념 부족 영역 심층 분석.
- `GET /api/teacher/series`: 교수자가 생성한 강좌 시리즈 목록 조회.
- `POST /api/teacher/series/generate`: AI를 활용한 강좌 시리즈(제목, 설명, 커리큘럼 아웃라인) 자동 생성.
- `POST /api/teacher/generate-lecture`: 개별 강의의 본문 및 학습 자료 자동 생성.
- `POST /api/teacher/quiz/generate`: 강의 주제에 부합하는 다지선다형 퀴즈 자동 생성.
- `POST /api/teacher/coding-test/generate`: 실습이 필요한 경우 코딩 테스트 문제 및 자동 채점 코드 생성.

### 🛠️ Core & Utility Endpoints
- `POST /api/curriculum/generate`: 페르소나 및 목표 기반 맞춤형 커리큘럼 설계 엔진.
- `GET /api/curriculum/latest`: 사용자가 가장 최근에 생성한 커리큘럼의 임시 저장 상태 조회.
- `POST /api/curriculum/accept`: 설계된 커리큘럼을 확정하고 정식 코스로 등록.
- `POST /api/chat`: 일반적인 학습 상담 및 프로젝트 안내 챗봇.
- `POST /api/upload`: 강의 자료 및 썸네일 이미지 업로드 처리.

---

## 📑 4. 시스템 문서 체계 (MD Documents)

프로젝트 유지보수를 위해 관리되는 핵심 문서들입니다.

- **[AI 전략 보고서](file:///docs/ai_strategy_report.md)**: AI 모델의 페르소나, 그라운딩(Grounding) 전략, 토큰 최적화 방안 기술.
- **[시스템 설계 가이드](file:///docs/system_documentation.md)**: 지수 백오프 기반 Retry 로직, ID 관리 전략 등 인프라 설계 결정 사항 기술.
- **[MVP 상세 규격서](file:///mvp_specification.md)**: 초기 서비스 목표 및 핵심 기능 요구사항 정의.

---

## 💡 5. 개발 및 IDE 접근법 (Developer Guide)

Syllabix는 **'데이터 정밀도'**와 **'개발 생산성'**을 동시에 잡기 위해 다음의 접근법을 사용합니다.

### 🧪 스크래치 스크립트 기반 DB 검증 (`scratch/`)
- 새로운 기능을 배포하기 전, `scratch/` 디렉토리 내의 TypeScript 스크립트를 사용하여 실제 유저 시뮬레이션 및 데이터 정합성을 선제적으로 체크합니다.
- 예: `check_db.ts` (데이터 관계 검증), `seed_analytics_demo.ts` (분석 데이터 시뮬레이션)

### 🛡️ AI 안정성 확보 (Resilience Engine)
- **지능형 재시도(Retry)**: Gemini 서버 부하(503) 발생 시 자동으로 대기 후 재요청하여 사용자 끊김 방지.
- **Temperature 제어**: 평가 문항과 같은 정밀 데이터 생성 시 온도를 0.2 이하로 낮춰 재현성(Reproducibility) 확보.

### 🎨 고도화된 학습 인터페이스 (UX/UI)
- **Markdown-to-Cell**: `react-markdown`을 커스텀하여 강의 본문을 주피터 노트북(Jupyter Notebook)의 인터랙티브 코드 셀 형태로 렌더링.
- **Spotlight Navigation**: 학습자가 다음에 무엇을 해야 할지 즉각 인지하도록 진도 데이터 기반의 시각적 위계 부여.


