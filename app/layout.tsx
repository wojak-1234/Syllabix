import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeManager } from '@/components/theme-manager'
import { Toaster } from "sonner"
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoExpress = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  title: 'Syllabix - AI 기반 교육 플랫폼',
  description: 'Syllabix는 AI 기반 교육 플랫폼으로, 학생과 교사의 학습 경험을 혁신합니다.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoExpress.variable}`}>
      <body className="font-sans antialiased">
        <ThemeManager />
        <Toaster position="top-center" richColors />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
