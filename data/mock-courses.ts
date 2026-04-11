export interface Course {
  id: string;
  title: string;
  provider: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  description: string;
  url: string;
}

export const MOCK_KNOWLEDGE_BASE: Course[] = [
  {
    id: "course_react_001",
    title: "리액트 완벽 가이드: 기초부터 Next.js까지",
    provider: "유데미(Udemy)",
    difficulty: "beginner",
    tags: ["React", "Next.js", "Javascript", "프론트엔드"],
    description: "리액트의 핵심 동작원리(Virtual DOM)부터 훅(Hooks), 상태관리, 그리고 Next.js 기초까지 다루는 입문자용 필수 강의입니다.",
    url: "#"
  },
  {
    id: "course_js_deep_001",
    title: "모던 자바스크립트 Deep Dive",
    provider: "도서",
    difficulty: "intermediate",
    tags: ["Javascript", "원리", "코어", "이론"],
    description: "자바스크립트 코어 엔진의 동작 원리(호이스팅, 클로저, 실행 컨텍스트)를 깊게 파고드는 도서 기반 심화 학습입니다.",
    url: "#"
  },
  {
    id: "course_unity_001",
    title: "유니티(Unity) 입문자를 위한 2D/3D 게임 개발",
    provider: "인프런",
    difficulty: "beginner",
    tags: ["Unity", "C#", "게임개발", "인디게임"],
    description: "유니티 엔진 인터페이스 조작부터 C# 스크립팅 기초, 물리 엔진을 활용한 간단한 2D 플랫포머 제작까지 배우는 실습 강의입니다.",
    url: "#"
  },
  {
    id: "course_algo_001",
    title: "파이썬 알고리즘 마스터 클래스",
    provider: "코드트리",
    difficulty: "intermediate",
    tags: ["Python", "알고리즘", "자료구조", "코딩테스트"],
    description: "BFS/DFS, 동적 계획법(DP), 그리디 알고리즘 등 코딩테스트 핵심 유형을 파이썬으로 격파하는 실전 예제 풀이 과정입니다.",
    url: "#"
  },
  {
    id: "course_spring_002",
    title: "스프링 부트와 JPA 활용: 웹 애플리케이션 개발",
    provider: "김영한",
    difficulty: "intermediate",
    tags: ["Spring Boot", "JPA", "Java", "백엔드"],
    description: "강력한 백엔드 프레임워크인 스프링 부트와 영속성 프레임워크 JPA를 결합하여 실제 동작하는 게시판/쇼핑몰을 설계하는 과정.",
    url: "#"
  },
  {
    id: "course_ai_001",
    title: "LangChain과 에이전틱 AI 개발 실전",
    provider: "오픈튜토리얼스",
    difficulty: "advanced",
    tags: ["AI", "LLM", "Python", "프롬프트엔지니어링"],
    description: "단순 API 호출을 넘어, RAG 아키텍처와 ReAct 에이전트를 구축하여 능동적으로 행동하는 AI를 훈련하는 고급 방법론.",
    url: "#"
  }
];

export function formatCoursesForPrompt(): string {
  return MOCK_KNOWLEDGE_BASE.map(
    c => `- [ID: ${c.id}] ${c.title} (난이도: ${c.difficulty}, 태그: ${c.tags.join(', ')}) / ${c.description}`
  ).join('\n');
}
