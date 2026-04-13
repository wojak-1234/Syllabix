import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 파일 이름 생성
    const ext = file.name.split('.').pop()
    const fileName = `${randomUUID()}.${ext}`
    
    // 저장 경로 설정 (프로젝트 루트의 public/uploads)
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    // 디렉토리 생성 (없을 경우)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // already exists
    }

    const path = join(uploadDir, fileName)
    await writeFile(path, buffer)

    // 접속 가능한 URL 반환
    const url = `/uploads/${fileName}`

    return NextResponse.json({ url })
  } catch (error: any) {
    console.error('File Upload Error:', error)
    return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 })
  }
}
