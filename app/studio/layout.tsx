import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Cascais Volley Cup — Studio'
}

export default function StudioLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
