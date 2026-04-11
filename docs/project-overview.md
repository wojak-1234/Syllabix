# CodeMentor AI — MVP 기획 문서

> AI 기반 코딩 교육 플랫폼 | 공모전 제출용 기획 문서  
> 작성일: 2026-04-12 | AI 협업 기획

---

## 1. 서비스 개요

### 한 줄 정의
코딩을 배우는 학습자가 **"어디서 막혔는지 스스로 모르는 상태"** 를 AI가 먼저 발견하고, 자력으로 해결하도록 유도하는 코딩 교육 플랫폼.

### 핵심 가치
- 강사 → AI가 학습자 Blind Point를 먼저 발견해 강의 개선 인사이트 제공
- 학습자 → AI가 답을 주는 게 아니라, 스스로 깨닫도록 유도
- 단순 LMS가 아닌, **AI가 플랫폼의 두뇌** 역할을 하는 구조

### 타겟
- **Student**: 코딩을 처음 배우거나 독학 중인 학습자
- **Teacher**: 코딩 강의를 제작·운영하는 강사

---

## 2. 핵심 문제 (Pain Point)

| 대상 | 문제 |
|------|------|
| 학습자 | 어디서 막혔는지 모른 채 중도 이탈 |
| 학습자 | AI에게 코드를 받아 복붙 → 학습 효과 없음 |
| 강사 | 어느 개념에서 학생들이 막히는지 알 방법 없음 |
| 강사 | 강의 제작 초기 진입 장벽이 높음 |

---

## 3. MVP 핵심 기능

### 3-1. Student Side

#### 00. 온보딩 진단 테스트 `최초 1회`
- 5문제로 현재 코딩 수준 자동 파악
- 결과 기반으로 커리큘럼 생성 정밀도 향상
- 기술: Structured Output (수준 분류 JSON 반환)

---

#### 01. AI 커리큘럼 생성 `핵심`
- 목표(예: "3개월 안에 React로 포트폴리오 완성") + 현재 수준 + 주당 학습 시간 입력
- AI가 역산 설계 → 주차별 로드맵 자동 생성
- 관련 강의 자동 매핑 (RAG 기반)
- **이탈 위험 구간 예측** 포함 ("8주차 Redux 구간에서 유사 학습자 41% 이탈")
- 기술: Claude API Structured Output + RAG (pgvector)

```
입력 폼 → Claude 역설계 → JSON 커리큘럼 → 주차별 로드맵 렌더링
```

---

#### 02. 강의 추천 & 수강
- 커리큘럼 주차 클릭 → 관련 강의 자동 추천
- 강의 수강 완료 시 자동으로 다음 단계 진입 (끊김 없는 흐름)

---

#### 03. 개념 확인 퀴즈
- 강의 내용 기반 AI 자동 출제
- 단, 강의 생성자가 설정한 내용이 있다면 그 내용으로 출제
- 강의 스크립트를 RAG로 검색 → 핵심 개념 퀴즈 생성

---

#### 04. Dynamic IDE + AI 페어 프로그래머 `핵심 차별화`
- Monaco Editor 기반 코드 실행 환경
- AI가 **직접 코드를 수정해주지 않음**
- 소크라테스식 질문으로 자력 해결 유도
  - "이 변수가 어떤 타입인지 확인해봤어?"
  - "종료 조건이 뭔지 설명해줄 수 있어?"
  - "에러 메시지 3번째 줄이 뭘 말하는 것 같아?"
- 힌트 단계: 방향 힌트 → 개념 힌트 → 코드 구조 힌트 (직접 답은 마지막까지 안 줌)
- 시도 히스토리 타임라인 저장 (Blind Point 분석용)
- 기술: Claude API Multi-turn Agent + Streaming + Monaco Editor

---

#### 05. Blind Point 리포트 & 커리큘럼 자동 리셋 `핵심 차별화`
- 행동 데이터 수집: 퀴즈 오답 패턴 + IDE 시도 히스토리 + 영상 반복 재생 구간
- LangChain Agent가 자율적으로 분석:
  1. 행동 로그 조회
  2. 오답 패턴 분석
  3. 취약 개념 탐지 ("모르는 줄 모르는" 개념 발견)
  4. 커리큘럼 리셋 필요 여부 판단
  5. 학생에게 보강 알림 발송
- 취약 개념 발견 → 해당 강의 구간으로 자동 복귀 → 재도전 루프
- 기술: LangChain Agent + Tool Calling + 스케줄 트리거

---

### 3-2. Teacher Side

#### T-01. 수요 대시보드
- 학습자들이 많이 검색하는 주제·키워드 트렌드 시각화
- "지금 React Hooks 수요가 급증 중" 형태로 강의 제작 방향 제안

---

#### T-02. AI 강의 초안 생성 `Teacher 핵심`
- 수요 키워드 클릭 → 원클릭으로 강의 목차·설명·문제 세트 AI 자동 초안 생성
- 강사는 검토·수정만 → 강의 제작 진입 장벽 대폭 감소
- 기술: LangChain Multi-step Chain (목차 생성 → 설명 작성 → 문제 출제 순차 실행)

---

#### T-03. Blind Point 대시보드 `Teacher 핵심`
- 업로드한 강의의 어느 개념에서 학생들이 집중적으로 막히는지 시각화
- "클로저를 설명한 강의 구간에서 학생 67%가 퀴즈 오답"
- AI가 강의 개선 제안까지 자동 생성
- 기술: LangChain Agent 분석 결과 → Recharts 히트맵

---

#### T-04. Q&A 에스컬레이션 수신함
- 학생 질문 → AI가 강의 콘텐츠 기반 1차 답변 (RAG)
- 답변 불가 시 강사에게 자동 에스컬레이션
- 강사 부담 최소화

---

## 4. 학습 루프 (끊김 없는 UX 흐름)

```
진단 테스트
    ↓
AI 커리큘럼 생성
    ↓
이번 주 강의 추천 → 수강
    ↓
개념 확인 퀴즈
    ↓
Dynamic IDE 실습 (AI 페어 프로그래머)
    ↓
Blind Point 탐지
    ↓ (취약 개념 발견 시)
해당 강의 구간 자동 복귀 ──────→ 재도전
    ↓ (완전 학습 시)
다음 주차 진입
    ↓
목표 달성 → 수료증 발급
```

---

## 5. AI 활용 기술 맵

| 기능 | AI 패턴 | 기술 |
|------|---------|------|
| 온보딩 진단 | Structured Output | Claude API |
| 커리큘럼 생성 | Structured Output + RAG | Claude API + pgvector |
| AI 페어 프로그래머 | Multi-turn Agent + Streaming | Claude API + LangChain |
| 퀴즈 출제 | RAG 기반 생성 | Claude API + pgvector |
| Blind Point 탐지 | **Agentic AI** (자율 도구 호출) | LangChain Agent |
| 커리큘럼 리셋 | Agent 연동 자동 실행 | LangChain Agent |
| 강의 초안 생성 | Multi-step Chain | LangChain LCEL |
| Q&A 1차 답변 | RAG | Claude API + pgvector |

---

## 6. 기술 스택

### Frontend
- Next.js 14 (App Router)
- Monaco Editor (Dynamic IDE)
- Recharts (데이터 시각화)
- Tailwind CSS

### Backend
- Next.js API Routes
- LangChain (Agent, LCEL Chain)
- Claude API (claude-sonnet-4-6)
- PostgreSQL + pgvector (RAG 임베딩 저장)
- Prisma ORM

### Infrastructure
- Vercel (배포)
- Supabase (DB + Storage)
- AWS S3 (강의 파일 저장)
- Whisper API (강의 영상 → 텍스트 변환)

---

## 7. 데이터 흐름

### 강의 업로드 파이프라인 (RAG 구축)
```
강사 파일 업로드 (영상/PDF/슬라이드)
    ↓
텍스트 추출 (Whisper API / PDF 파서)
    ↓
청크 분할 (500 tokens, 50 overlap)
    ↓
임베딩 생성 (Claude Embeddings)
    ↓
pgvector 저장
    ↓
RAG 검색 준비 완료
```

### Blind Point 탐지 Agent 흐름
```
트리거 (퀴즈 오답 3회 누적 / 일일 배치)
    ↓
LangChain Agent 실행
    ↓
[Tool 1] 행동 로그 조회
[Tool 2] 오답 패턴 분석
[Tool 3] 취약 개념 판단
    ↓
[Tool 4] 커리큘럼 리셋 (필요 시)
[Tool 5] 학생·강사 동시 알림
    ↓
완료
```

---

## 8. MVP 범위 (공모전 제출 기준)

### 반드시 구현
- [ ] 온보딩 진단 테스트
- [ ] AI 커리큘럼 생성 (Structured Output)
- [ ] Dynamic IDE + AI 페어 프로그래머 (소크라테스 모드)
- [ ] Blind Point 탐지 Agent (LangChain)
- [ ] Teacher Blind Point 대시보드
- [ ] 강의 업로드 RAG 파이프라인

### 시간 되면 추가
- [ ] 강의 초안 AI 생성 (Multi-step Chain)
- [ ] 시도 히스토리 타임라인
- [ ] 학습 패턴 뱃지 시스템
- [ ] AI 다중 풀이 비교

---

## 9. AI 협업 문서 구조 (GitHub)

```
/docs
  /ai-sessions
    2026-04-12_ideation.md       ← 오늘 기획 대화 스냅샷
    2026-04-13_implementation.md
  AI_PLANNING.md                 ← 기획 의사결정 과정
  ARCHITECTURE_DECISIONS.md      ← 기능별 AI 패턴 선택 근거
  PROMPT_GUIDE.md                ← 각 기능 프롬프트 설계 전략
  AI_REVIEW_LOG.md               ← AI 제안 → 사람 검토 흔적
```

---

## 10. 핵심 차별화 포인트 (심사 어필)

1. **AI가 답을 주지 않는다** — 소크라테스식 페어 프로그래밍으로 자력 해결 유도
2. **Agentic AI** — 단순 챗봇이 아닌, 스스로 판단하고 행동하는 LangChain Agent
3. **역방향 피드백 루프** — 학습자 데이터가 강사 강의 개선으로 연결
4. **끊김 없는 학습 루프** — 진단 → 커리큘럼 → 강의 → 퀴즈 → IDE → Blind Point → 보강 → 반복
5. **AI 협업 과정 문서화** — 기획부터 구현까지 AI와 협업한 흔적을 GitHub에 체계적으로 보존

---

*본 문서는 Claude AI와의 협업을 통해 기획되었습니다.*  
*AI 협업 세션 로그: `docs/ai-sessions/2026-04-12_ideation.md` 참조*