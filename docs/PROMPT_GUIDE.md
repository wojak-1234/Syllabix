# AI Prompt Engineering Guide

This document defines the strategies used to control AI behavior across different CodeMentor AI features.

## 1. Socratic Pair Programmer (Tutoring Mode)
**Location**: `app/api/chat/route.ts`  
**Strategy**: Role-playing + Strict Negative Constraints

### Core Instructions
- "Never provide direct code solutions."
- "Ask narrow questions to lead the student to find the line of error."
- "If the student is lost, explain the concept but leave the implementation to them."

---

## 2. Curriculum Reverse-Engineering
**Location**: `app/api/curriculum/generate/route.ts`  
**Strategy**: Structured Output (JSON Schema) + Goal Decomposition

### Core Instructions
- "Decompose the user's final goal into weekly checkpoints."
- "Assess completion risk based on topic complexity (e.g., Redux has high churn)."

---

## 3. Blind Point Detection (Agentic Reasoning)
**Location**: `app/api/analytics/blind-point/route.ts`  
**Strategy**: Zero-shot Chain of Thought + Action Prediction

### Core Instructions
- "Review behavior logs (quiz failures, video re-watches) to identify implicit knowledge gaps."
- "Assign a confidence score to each detected vulnerability."

---
*Maintained by the Development Team*
