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

## 🔗 2. 주요 API Route 명세

Syllabix의 API는 역할(Student/Teacher)과 기능별로 체계적으로 분산되어 있습니다.

### 🎓 Student APIs
- `GET /api/student/dashboard`: 개인 수강 현황, 진도율, 수락된 커리큘럼 로드맵 조회
- `POST /api/student/generate-test`: AI 개인화 문제 생성 (전체 목차 및 강의 본문 컨텍스트 주입)
- `POST /api/curriculum/generate`: 학생 프로필 기반 맞춤형 학습 경로 설계
- `GET /api/curriculum/latest`: 가장 최근에 설계된 커리큘럼 프리뷰
- `POST /api/curriculum/accept`: 설계된 커리큘럼을 실제 수강으로 전환 (Enrollment 등록)

### 👨‍🏫 Teacher APIs
- `GET /api/teacher/analytics/analyze`: 수강생 오답 패턴 및 개념적 오해(Misconception) 심층 분석
- `POST /api/teacher/generate-lecture-items`: 강의 제목/목표 기반 퀴즈 및 코딩 테스트 자동 생성
- `PATCH /api/teacher/series/[id]`: 강좌 공개 상태 관리 및 메타데이터 수정

---

## 📑 3. 시스템 문서 체계 (MD Documents)

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

## 💻 5. Quick Start with VS Code (에디터 실행 가이드)

Visual Studio Code 환경에서 프로젝트를 가장 효율적으로 실행하는 방법입니다.

### ① 프로젝트 열기 및 터미널 설정
- VS Code에서 `공모전` 폴더를 엽니다. (`File > Open Folder...`)
- `Ctrl + \`` (백틱)를 눌러 **통합 터미널**을 엽니다.

### ② 환경 변수 설정
- 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 정보를 입력합니다:
  ```env
  GEMINI_API_KEY=your_google_gemini_api_key_here
  DATABASE_URL="file:./dev.db" # 로컬 SQLite 기준
  ```

### ③ 패키지 설치 및 실행
통합 터미널에서 다음 명령어를 순서대로 입력합니다:
```powershell
# 1. 의존성 설치 (pnpm 권장)
pnpm install

# 2. 로컬 데이터베이스 스키마 반영
npx prisma db push

# 3. 개발 서버 실행
npm run dev
```

### ④ 브라우저 확인
- 터미널에 나타난 `http://localhost:3000` 링크를 `Ctrl + 클릭` 하여 브라우저에서 플랫폼을 확인합니다.

---

## ⚙️ 실행 방법 (CLI)

```bash
# 1. 패키지 설치
pnpm install

# 2. DB 마이그레이션 (Prisma)
npx prisma db push

# 3. 로컬 서버 실행
npm run dev
```
