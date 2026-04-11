import { NextRequest, NextResponse } from "next/server"
import { THEME_DEMAND_DATA } from "@/data/theme-demand"

/**
 * GET /api/teacher/demand
 * 교사 대시보드용 테마별 수요 데이터를 반환합니다.
 * 실제 서비스에서는 Prisma를 통해 ActivityLog, BlindPoint를 집계합니다.
 */
export async function GET(req: NextRequest) {
  try {
    // Mock: 정렬된 수요 데이터 반환
    const sorted = [...THEME_DEMAND_DATA].sort((a, b) => b.demandScore - a.demandScore)

    return NextResponse.json({
      data: sorted,
      metadata: {
        totalStudents: sorted.reduce((sum, d) => sum + d.studentCount, 0),
        analysisDate: new Date().toISOString(),
        source: "BlindPoint + ActivityLog 집계 (Mock)"
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
