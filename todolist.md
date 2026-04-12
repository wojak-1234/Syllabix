# 🚀 Syllabix v3 개발 To-Do List

## ✅ 완료된 과제
- [x] **[IDE]** 학생용 실시간 IDE 내 AI 소크라테스 힌트 에이전트 구현 (동적 오류 감지 및 방향성 제시)
- [x] **[모델 최적화]** 프로젝트 전반의 AI 모델을 `gemini-3.1-flash-lite-preview`로 통합 및 전환
- [x] **[교사 대시보드]** 강의 생성 후 리다이렉션 오류 수정 및 실시간 데이터 페칭 연동

## 🛠️ 향후 구현 과제 (Phase 5+ & 배포 준비)

1. **[Vercel 배포 단계]** 이미지 첨부 및 첨부파일 업로드 기능 완전 구현 (S3/Cloudinary/Vercel Blob 등 저장소 연동)
2. **[인증/보안]** NextAuth 기반 실제 로그인 세션 연동 및 역할별(Teacher/Student) API 접근 권한 고도화
3. **[데이터베이스]** Mock 데이터를 Prisma/PostgreSQL 실제 DB 스키마로 완전 마이그레이션
4. **[검색/RAG]** 수강생 오답과 강의 스크립트 간의 정교한 Vector Embedding 매칭 로직 강화 (LangChain + Pinecone 등)
5. **[UI/UX]** 모바일 반응형 상세 레이아웃 최적화 및 접근성(A11y) 체크포인트 준수

---
*본 파일은 개발 진행 상황에 따라 수시로 업데이트됩니다.*
