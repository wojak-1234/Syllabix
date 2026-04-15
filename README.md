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

## 📂 2. 프로젝트 구조 (Directory Structure)

```text
syllabix/
├── app/                    # Next.js App Router (Pages & APIs)
│   ├── api/                # API Endpoints
│   ├── student/            # 학생 전용 대시보드 및 학습 화면
│   ├── teacher/            # 강사 전용 분석 및 강좌 관리 화면
│   ├── curriculum/         # AI 커리큘럼 생성 및 조회
│   ├── learn/              # 실제 인터랙티브 학습 환경
│   └── chatbot/            # 메인 AI 튜터 시스템
├── components/             # 재사용 가능한 UI 컴포넌트
│   └── ui/                 # Shadcn/UI 및 기초 디자인 컴포넌트
├── lib/                    # 유틸리티 함수, DB 클라이언트, AI 로직
├── prisma/                 # 데이터베이스 스키마 및 마이그레이션
├── public/                 # 정적 에셋 (이미지, 폰트)
├── scratch/                # 개발/디버깅용 임시 스크립트
├── docs/                   # 상세 설계 및 전략 문서
└── styles/                 # 글로벌 CSS 및 테마 설정
```

---

## 🔗 3. API 엔드포인트 상세 명세

### 🎓 Student Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/student/dashboard` | 대시보드 요약 및 학습 현황 |
| `GET` | `/api/student/enrollments` | 수강 중인 강좌 목록 조회 |
| `GET` | `/api/student/enrollment/[id]` | 개별 강좌 세부 진행 상황 |
| `POST` | `/api/student/evaluate` | 강의 파트 완료 후 이해도 평가 |
| `POST` | `/api/student/generate-test` | 개인화된 연습 문제 생성 |
| `POST` | `/api/student/tutor-chat` | 강의 기반 실시간 튜터링 (Context 주입) |

### 👨‍🏫 Teacher Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/teacher/analytics/analyze` | 전반적인 학생 성취도 데이터 분석 |
| `POST` | `/api/teacher/series/generate` | AI 기반 새로운 강좌 시리즈 구성 설계 |
| `POST` | `/api/teacher/generate-lecture` | 단일 강의 본문 및 교안 자동 생성 |
| `POST` | `/api/teacher/generate-lecture-items` | 강의 내 포함될 퀴즈/코딩 테스트 생성 |
| `PATCH` | `/api/teacher/series/[id]` | 강좌 정보 수정 및 배포 상태(Draft/Published) 관리 |

### 🤖 AI & Curriculum Core
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/curriculum/generate` | 개인화 커리큘럼 로드맵 생성 |
| `POST` | `/api/curriculum/accept` | 생성된 로드맵을 확정 및 수강 등록 |
| `POST` | `/api/curriculum/chat` | 커리큘럼 설계 단계에서의 AI 상담 |
| `GET` | `/api/curriculum/latest` | 설계 중인 최신 커리큘럼 임시 저장 데이터 |

---

## 📑 4. 시스템 문서 체계 (MD Documents)

프로젝트 유지보수를 위해 관리되는 핵심 문서들입니다.

- **[AI 전략 보고서](file:///docs/ai_strategy_report.md)**: AI 모델의 페르소나, 그라운딩(Grounding) 전략, 토큰 최적화 방안 기술.
- **[시스템 설계 가이드](file:///docs/system_documentation.md)**: 지수 백오프 기반 Retry 로직, ID 관리 전략 등 인프라 설계 결정 사항 기술.
- **[MVP 상세 규격서](file:///mvp_specification.md)**: 초기 서비스 목표 및 핵심 기능 요구사항 정의.

---

## 💡 4. 개발 및 IDE 접근법 (Developer Guide)

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


