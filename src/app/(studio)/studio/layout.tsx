import { TopBar } from '@/components/studio'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <main className="max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
