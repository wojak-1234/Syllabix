/**
 * 프롬프트 중앙 관리 모듈
 * AI의 동작 방식을 조정할 때 이 파일만 수정하면 됩니다.
 */

// ── 시스템 역할 정의 ─────────────────────────────────────────────────

export const SYSTEM_ROLES = {
  CURRICULUM_EXPERT:
    "당신은 초개인화 학습 설계 전문가입니다. 상담과 진단 결과를 분석해 맞춤형 커리큘럼을 설계합니다.",

  CHAT_CONSULTANT:
    "당신은 코딩 전담 컨설턴트입니다. 사용자의 목표에 최적화된 맞춤형 질문 하나를 생성하세요.",

  LECTURER:
    "당신은 IT 강사입니다. 학생에게 설명하듯 친절하고 구체적으로 강의 내용을 작성하세요.",

  EVALUATOR:
    "당신은 교육 평가 전문가입니다. 개념 이해도를 정확히 측정하는 문제를 설계합니다.",

  SENIOR_ENGINEER:
    "당신은 핵심을 짚어내는 엄격하고 세심한 시니어 엔지니어입니다.",
} as const


// ── 공통 지침 ──────────────────────────────────────────────────────

export const COMMON_RULES = {
  LANGUAGE: "한국어로 응답하세요.",
  JSON_ONLY: "JSON 형식으로만 응답하세요.",
  NO_LABEL_ABCD: "선택지 label에 기호(A,B,C,D) 대신 실제 내용을 작성하세요.",
} as const


// ── 대화 상담 (Chatbot) 관련 프롬프트 빌더 ───────────────────────────

export function buildChatTurnGuidance(answeredCount: number, goal: string): string {
  if (answeredCount === 0) {
    return `Q1: 목표("${goal}") 달성을 위한 기술 스택(언어, 프레임워크 등)을 묻고 2~3가지 선택지를 예시로 주며 유도하세요.`
  } else if (answeredCount === 1) {
    return `Q2: 이전 답변을 참고해 선호하는 학습 방식(이론, 프로젝트, 인강, 도서 등)을 물어보세요.`
  } else {
    return `Q3: 학습 중 포기하고 싶었던 경험이나 이번 학습에서 우려되는 병목 포인트를 물어보세요.`
  }
}

export function buildPrefetchQuestionsPrompt(goal: string, currentLevel: string): string {
  return `${SYSTEM_ROLES.CHAT_CONSULTANT}

[진단 정보] 목표: ${goal}, 수준: ${currentLevel}

아래 3가지 질문을 JSON 배열로 생성하세요 (친절한 톤, 1~2문장).
1. Q1: 목표 달성용 기술 스택 유도 및 2~3개 예시 제시.
2. Q2: 선호하는 학습 방식 질문.
3. Q3: 과거의 학습 고비나 현재 걱정되는 병목 질문.

${COMMON_RULES.LANGUAGE} ${COMMON_RULES.JSON_ONLY}
형식: { "questions": ["질문1", "질문2", "질문3"] }`
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
상담 내용과 진단 결과를 종합해 커리큘럼을 JSON으로 설계하세요.

[정규 정보] 목표:${goal}, 수준:${currentLevel}, 가용:${hoursPerWeek}h, 제외:${excludes || '없음'}
[컨텍스트]
- 상담: ${conversationSummary}
- 진단: ${onboardingResult?.level}, 강점:${onboardingResult?.strengths?.join(',')}, 약점:${onboardingResult?.weaknesses?.join(',')}

[지침]
1. 성향에 맞는 주차 주제 선정.
2. '약점'은 초반에 보완하거나 시간을 더 할당.
3. 진단 수준(${onboardingResult?.level})에 맞는 난이도 설정.
4. 아래 [지식 베이스]에서 강좌를 찾아 'linkedCourseIds'에 매칭.
5. JSON 스키마를 엄격히 준수하세요.

[지식 베이스]
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
학습 목표와 상담 내용을 분석해 수준을 파악할 수 있는 핵심 맥락의 객관식(4지선다) 5문제를 생성하세요.

[정보] 목표:"${targetGoal}", 수준:"${isBeginner ? '입문' : currentLevel}", 요약:"${contextSummary}"

[지침]
1. ${isBeginner ? "기초 개념과 필요성 위주의 쉬운 문제" : "취약 부분과 핵심 원리를 파고드는 날카로운 문제"}로 구성.
2. 단순 암기보다 동작 원리와 이유를 묻는 문제.
3. 난이도를 점진적으로 높여 숙련도 반영.
4. ${COMMON_RULES.NO_LABEL_ABCD}
${COMMON_RULES.LANGUAGE}`
}

// ── Teacher 출제용 프롬프트 빌더 ─────────────────────────────

export function buildGenerateSeriesPrompt(params: {
  title: string
  description: string
  targetLevel: string
}): string {
  return `${SYSTEM_ROLES.CURRICULUM_EXPERT}
제목, 설명, 수준을 바탕으로 시리즈 구조와 소속 강좌(3~6개)를 설계하세요.

[요청] 제목: ${params.title}, 설명: ${params.description}, 수준: ${params.targetLevel}

[지침] 
1. 순서대로 강좌 설계 및 title, learningObjective, conceptTags 포함.
2. 유용한 보충영상(유튜브 링크 또는 검색어 URL)을 'attachmentUrl'에 기재.
3. 전문적 어조 유지 및 JSON 형식 준수.

응답 형식: { "title": "...", "description": "...", "lectures": [{ "title": "...", "learningObjective": "...", "conceptTags": [], "attachmentUrl": "..." }] }`
}

export function buildGenerateQuizPrompt(params: {
  lectureTitle: string
  learningObjective: string
  conceptTags: string[]
  count: number
}): string {
  return `${SYSTEM_ROLES.EVALUATOR}
강좌 정보에 맞춰 객관식 퀴즈 ${params.count}개를 생성하세요. 

[정보] ${params.lectureTitle}, ${params.learningObjective}, 태그: ${params.conceptTags.join(', ')}

[지침] 원리 이해도 측정, 4개 선택지, 명확한 정답과 해설 포함. ${COMMON_RULES.NO_LABEL_ABCD}

형식: { "quizzes": [{ "question": "...", "choices": [{ "label": "...", "isCorrect": true/false }], "explanation": "...", "conceptTag": "..." }] }`
}

export function buildGenerateCodingTestPrompt(params: {
  lectureTitle: string
  learningObjective: string
  conceptTags: string[]
}): string {
  return `${SYSTEM_ROLES.SENIOR_ENGINEER}
강좌 정보 기반 실전 코딩테스트 1문제를 생성하세요.

[정보] ${params.lectureTitle}, 목표: ${params.learningObjective}, 태그: ${params.conceptTags.join(', ')}

[지침] 개념 체화용 문제, starterCode 제공(핵심 로직만 작성), 테스트케이스 2~3개와 solutionCode 필수.

형식: { "title": "...", "description": "...", "starterCode": "...", "testCases": [{ "input": "...", "expectedOutput": "..." }], "solutionCode": "...", "gradingCriteria": "...", "conceptTag": "..." }`
}
