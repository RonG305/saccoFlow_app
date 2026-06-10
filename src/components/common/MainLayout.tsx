import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function MainLayout() {
  return (
    <div className="flex min-h-screen px-3 flex-col pb-16">
      <Outlet />
      <BottomNav />
    </div>
  )
}
