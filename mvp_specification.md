# 맞춤형 학습 플랫폼 MVP 기획서

## 1. 프로젝트 개요
사용자의 입력 및 학습 데이터를 바탕으로 개인화된 커리큘럼을 생성하고, 코드 리뷰 및 취약점 분석을 통해 학습 효율을 극대화하는 교육 플랫폼입니다.

## 2. 주요 대상자 (Target Audience)
- **학습자 (Learners)**: 자신에게 맞는 학습 경로를 찾고 프로그래밍 실력을 개선하고자 하는 입문자 및 숙련자
- **교사 (Teachers)**: 학생의 학습 상태를 모니터링하고 최적화된 교육 콘텐츠를 제공하고자 하는 교육자

## 3. 핵심 기능 (MVP Scope)

### 3.1 학습자 기능 (Learners Side)
- **맞춤형 커리큘럼 생성 (Custom Curriculum Generation)**
  - 사용자의 현재 수준, 학습 목표, 관심 분야를 입력받아 AI 기반 커리큘럼 자동 생성
- **다빈도 실수 관리 (Frequent Blunder List)**
  - 코드 제출 및 검토 과정에서 자주 발생하는 오류 유형을 자동 분류하여 리스트화
- **AI 코드 리뷰어 (Code Reviewer)**
  - 제출한 코드에 대해 AI가 로직 개선점, 컨벤션, 잠재적 버그를 피드백
- **약점 보고서 및 커리큘럼 동적 재설정 (Blind Point Report & Dynamic Reset)**
  - 학습 과정에서 반복적으로 틀리는 영역(Blind Point)을 식별하여 보고서 제공
  - 성취도에 따라 기존 커리큘럼을 자동으로 조정하거나 보완 과제 할당

### 3.2 교사 기능 (Teachers Side)
- **강의 콘텐츠 업로드 (Course Management)**
  - 텍스트, 코드 파일, 미디어 등을 포함한 학습 자료 업로드 및 관리
- **학습 취약점 모니터링 (Blind Point Visibility)**
  - 수강생들이 공통적으로 어려워하는 개념이나 문제 유형(Blind Point) 대시보드 제공
- **학생별 실패 지점 분석 (Failing Point Tracker)**
  - 특정 학생이 진도를 나가지 못하거나 반복해서 실패하는 지점을 파악하여 개별 지도 지원

## 4. 기술 스택 (제안)
- **Frontend**: Next.js (TailwindCSS)
- **Backend**: Node.js (Express/Prisma) 또는 Python (FastAPI)
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API (GPT-4o)

## 5. 단계별 개발 로드맵
1. **1단계**: 서비스 구조 설계 및 교사용 강의 업로드 기능 구현
2. **2단계**: AI 연동을 통한 커리큘럼 생성 및 코드 리뷰 초기 버전 구현
3. **3단계**: 사용자 데이터 기반 실수 관리 및 약점 보고서(Blind Point) 대시보드 구축
4. **4단계**: 데이터 피드백을 통한 커리큘럼 동적 재설정 고도화
