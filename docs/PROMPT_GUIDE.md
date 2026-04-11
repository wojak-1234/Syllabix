# AI 프롬프트 엔지니어링 가이드

본 문서는 CodeMentor AI의 주요 기능별 AI 행동 모델을 제어하기 위한 프롬프트 전략을 정의합니다.

## 1. 소크라테스식 페어 프로그래머 (튜터링 모드)
**위치**: `app/api/chat/route.ts`  
**전략**: 역할극(Role-playing) + 엄격한 부정 제약(Strict Negative Constraints)

### 핵심 지침
- "절대로 직접적인 코드 솔루션을 제공하지 말 것."
- "질문을 좁혀가며 학습자가 에러가 발생한 지점을 스스로 찾도록 유도할 것."
- "학습자가 완전히 길을 잃었을 경우 개념적 설명은 제공하되, 구현은 학습자의 몫으로 남길 것."

---

## 2. 커리큘럼 역설계 엔진
**위치**: `app/api/curriculum/generate/route.ts`  
**전략**: 구조화된 출력(JSON Schema) + 목표 분해(Goal Decomposition)

### 핵심 지침
- "사용자의 최종 목표를 주차별 체크포인트로 분해할 것."
- "주제별 난이도에 기반하여 학습 이탈 위험도(Risk Level)를 평가할 것."

---

## 3. 취약점(Blind Point) 탐지 에이전트
**위치**: `app/api/analytics/blind-point/route.ts`  
**전략**: 제로샷 사고 사슬(Zero-shot Chain of Thought) + 행동 예측

### 핵심 지침
- "퀴즈 오답, 비디오 반복 시청 등 행동 로그를 분석하여 암묵적 지식 공백을 식별할 것."
- "탐지된 각 취약점에 대해 분석 근거와 함께 신뢰 점수(Confidence Score)를 부여할 것."

---
*개발 팀과 AI 에이전트에 의해 유지보수됨*
