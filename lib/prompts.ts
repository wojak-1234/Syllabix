/**
 * 프롬프트 중앙 관리 모듈
 * AI의 동작 방식을 조정할 때 이 파일만 수정하면 됩니다.
 */

// ── 시스템 역할 정의 ─────────────────────────────────────────────────

export const SYSTEM_ROLES = {
  CURRICULUM_EXPERT:
    "당신은 초개인화 학습 설계 전문가입니다. 학습자의 상담 내용과 진단 결과를 분석하여 맞춤형 커리큘럼을 설계합니다.",

  CHAT_CONSULTANT:
    "당신은 코딩 교육 전문 컨설턴트입니다. 사용자의 목표에 최적화된 맞춤형 질문 하나만 생성하세요.",

  LECTURER:
    "당신은 실력 있는 IT 강사입니다. 학생에게 설명하듯 친절하고 구체적으로 강의 내용을 작성합니다.",

  EVALUATOR:
    "당신은 교육 평가 설계 전문가입니다. 개념 이해도를 정확히 평가하는 문제를 설계합니다.",

  SENIOR_ENGINEER:
    "당신은 핵심을 짚어내는 엄격하지만 세심한 시니어 엔지니어(면접관)입니다.",
} as const


// ── 공통 지침 ──────────────────────────────────────────────────────

export const COMMON_RULES = {
  LANGUAGE: "모든 내용은 한국어로 응답하세요.",
  JSON_ONLY: "반드시 JSON 형식으로만 응답하세요.",
  NO_LABEL_ABCD: "선택지의 label에는 'A', 'B', 'C', 'D' 같은 기호가 아니라 실제 내용을 작성하세요.",
} as const


// ── 대화 상담 (Chatbot) 관련 프롬프트 빌더 ───────────────────────────

export function buildChatTurnGuidance(answeredCount: number, goal: string): string {
  if (answeredCount === 0) {
    return `첫 번째 질문: 사용자가 입력한 학습 목표("${goal}")를 바탕으로, 이를 달성하기 위해 사용자가 염두에 두고 있는 구체적인 기술 스택이나 도구(예: 언어, 프레임워크, 엔진 등)를 특정하도록 유도하는 질문을 하세요. 상황에 맞는 적절한 2~3가지 선택지를 예시로 제시해주세요.`
  } else if (answeredCount === 1) {
    return `두 번째 질문: 이전에 답한 내용을 바탕으로, 앞으로의 학습을 진행할 때 선호하는 학습 방식(이론 중심, 프로젝트 중심, 인강, 도서, 클론 코딩 등)에 대해 물어보세요.`
  } else {
    return `세 번째 질문: 과거에 무언가를 학습하며 가장 포기하고 싶었거나 어려웠던 경험, 또는 이번 학습에서 가장 걱정되는 병목 포인트(예: 알고리즘 설계, 에러 핸들링, 환경 설정 등)가 무엇인지 물어보세요.`
  }
}

/**
 * 챗봇 상담 질문을 여러 개 한 번에 생성하는 프롬프트
 * API 호출 횟수를 줄이기 위해 대화 시작 시점에 전체 질문을 사전 생성합니다.
 */
export function buildPrefetchQuestionsPrompt(goal: string, currentLevel: string): string {
  return `${SYSTEM_ROLES.CHAT_CONSULTANT}

[초기 진단 정보]
- 목표: ${goal}
- 현재 수준: ${currentLevel}

아래 3가지 질문을 순서대로 JSON 배열로 생성하세요. 각 질문은 친절하고 부드러운 톤, 1~2문장으로 작성하세요.

1. 첫 번째 질문: 학습 목표("${goal}")를 달성하기 위해 사용자가 염두에 두고 있는 구체적인 기술 스택이나 도구(예: 언어, 프레임워크, 엔진 등)를 특정하도록 유도. 상황에 맞는 2~3가지 선택지 예시 포함.
2. 두 번째 질문: 선호하는 학습 방식(이론 중심, 프로젝트 중심, 인강, 도서, 클론 코딩 등)에 대해 질문.
3. 세 번째 질문: 과거 학습에서 가장 어려웠던 부분, 또는 이번 학습에서 가장 걱정되는 병목 포인트에 대해 질문.

${COMMON_RULES.LANGUAGE} ${COMMON_RULES.JSON_ONLY}
응답 형식: { "questions": ["질문1", "질문2", "질문3"] }`
}


// ── 커리큘럼 설계 프롬프트 빌더 ────────────────────────────────────

export function buildCurriculumPrompt(params: {
  goal: string
  currentLevel: string
  hoursPerWeek: number
  excludes?: string
  conversationSummary: string
  onboardingResult: any
  coursesContext: string
}): string {
  const { goal, currentLevel, hoursPerWeek, excludes, conversationSummary, onboardingResult, coursesContext } = params

  return `${SYSTEM_ROLES.CURRICULUM_EXPERT}
아래의 학습자 상담 내용과 실제 진단 테스트 결과를 종합하여 완벽한 커리큘럼을 JSON으로 설계해주세요.

[1. 기본 정보]
- 최종 목표: ${goal}
- 자가진단 수준: ${currentLevel}
- 주당 학습 시간: ${hoursPerWeek}시간
- 제외 희망 기술: ${excludes || '없음'}

[2. 상담 내용 (성향/방법론)]
${conversationSummary}

[3. 실제 진단 결과 (AI 분석)]
- 판정 수준: ${onboardingResult?.level || 'N/A'}
- 강점: ${onboardingResult?.strengths?.join(', ') || 'N/A'}
- 약점: ${onboardingResult?.weaknesses?.join(', ') || 'N/A'}
- 분석 내용: ${onboardingResult?.analysis || 'N/A'}

[설계 지침]
1. 상담에서 파악된 학습 성향에 맞춰 주차별 주제를 선정하세요.
2. 진단 결과의 '약점' 부분은 초반 주차에 보강하거나 더 긴 시간을 할당하세요.
3. 판정 수준(${onboardingResult?.level})에 맞는 난이도의 학습 과제를 목표로 삼으세요.
4. 각 단계별로 가장 적합한 실제 학습 자료를 아래 [가용 강의 지식 베이스]에서 검색하여 'linkedCourseIds' 배열에 넣으세요.
5. JSON 스키마를 엄격히 준수하여 응답하세요.

[가용 강의 지식 베이스 (강의/자료 RAG 인덱스)]
${coursesContext}`
}


// ── 온보딩 진단 프롬프트 빌더 ───────────────────────────────────────

export function buildOnboardingQuestionPrompt(params: {
  targetGoal: string
  currentLevel: string
  contextSummary: string
}): string {
  const { targetGoal, currentLevel, contextSummary } = params
  const isBeginner = currentLevel === 'beginner'

  return `${SYSTEM_ROLES.SENIOR_ENGINEER}
사용자는 챗봇 상담을 통해 자신의 학습 목표와 방법론, 어려워했던 부분을 공유했습니다.
이 정보를 철저히 분석하여 사용자의 현재 수준을 파악할 수 있는 가장 굵은 맥락과 필수 지식을 묻는 5개의 객관식(4지선다형) 질문을 생성하세요.

[사용자 정보]
- 학습 목표: "${targetGoal}"
- 현재 숙련도: "${isBeginner ? '입문자 (기초 지식 필요)' : currentLevel}"
- 상담 내용(성향/약점): "${contextSummary}"

[문제 출제 지침]
1. ${isBeginner
  ? "사용자가 '입문자'이므로, 해당 기술이 '왜 필요한지', '가장 기초적인 개념이 무엇인지'를 묻는 근본적이고 쉬운 문제로 구성하세요."
  : "사용자가 취약하다고 한 부분이나 목표 기술 스택의 '핵심 개념/원리'를 날카롭게 파고드는 질문이어야 합니다."
}
2. 단순 암기(문법)가 아닌, 동작 원리나 개념의 이유를 생각해야 풀 수 있는 문제로 구성하세요.
3. 난이도를 점진적으로 높이되, 사용자의 숙련도를 반드시 반영하세요.
4. ${COMMON_RULES.NO_LABEL_ABCD}
${COMMON_RULES.LANGUAGE}`
}

// ── Teacher 출제용 프롬프트 빌더 (v3) ─────────────────────────────

export function buildGenerateQuizPrompt(params: {
  lectureTitle: string
  learningObjective: string
  conceptTags: string[]
  count: number
}): string {
  return `${SYSTEM_ROLES.EVALUATOR}

강좌 정보에 맞춰 객관식 퀴즈 ${params.count}개를 생성하세요.

[강좌 정보]
- 강좌명: ${params.lectureTitle}
- 학습 목표: ${params.learningObjective}
- 핵심 개념 태그: ${params.conceptTags.join(', ')}

[출제 지침]
1. 단순 암기보다는 원리를 이해했는지 묻는 문제를 출제하세요.
2. 각 문제는 4개의 선택지를 가져야 합니다.
3. 정답이 여러 개이거나 전혀 없는 문제가 없도록 명확히 하세요.
4. 각 문제에 대한 명확한 해설과 어떤 개념 태그를 평가하는지 명시하세요.
5. ${COMMON_RULES.NO_LABEL_ABCD}

${COMMON_RULES.LANGUAGE} ${COMMON_RULES.JSON_ONLY}
응답 형식: { "quizzes": [{ "question": "...", "choices": [{ "label": "...", "isCorrect": true/false }], "explanation": "...", "conceptTag": "..." }] }`
}

export function buildGenerateCodingTestPrompt(params: {
  lectureTitle: string
  learningObjective: string
  conceptTags: string[]
}): string {
  return `${SYSTEM_ROLES.SENIOR_ENGINEER}

강좌 정보에 맞는 실전 코딩테스트 문제를 1개 출제하세요.

[강좌 정보]
- 강좌명: ${params.lectureTitle}
- 학습 목표: ${params.learningObjective}
- 핵심 개념 태그: ${params.conceptTags.join(', ')}

[출제 지침]
1. 해당 강좌의 개념을 체화할 수 있는 문제여야 합니다.
2. 보일러플레이트 코드(starterCode)를 제공하여 학생이 핵심 로직만 짤 수 있게 하세요.
3. 채점를 위한 테스트케이스 2~3개와 정답 코드(solutionCode)를 포함하세요.
4. '코딩테스트' 형식이지만 백준/프로그래머스 같은 형식적인 입출력이 아니라 함수의 구현 부분만 완성하는 형식(Solution 클래스 등)을 권장합니다.

${COMMON_RULES.LANGUAGE} ${COMMON_RULES.JSON_ONLY}
응답 형식: {
  "title": "...",
  "description": "문제 상세 설명...",
  "starterCode": "def solution(arr):\\n    pass",
  "testCases": [{ "input": "...", "expectedOutput": "..." }],
  "solutionCode": "...",
  "gradingCriteria": "...",
  "conceptTag": "..."
}`
}
