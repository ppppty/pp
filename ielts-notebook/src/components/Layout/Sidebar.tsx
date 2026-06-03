import { NavLink, useLocation } from 'react-router-dom'
import {
  MessageSquare,
  Library,
  Sparkles,
  Volume2,
  Brain,
  RefreshCw,
  Settings,
  LayoutDashboard,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/speaking', icon: MessageSquare, label: '串题板块' },
  { to: '/topics', icon: Library, label: '素材库' },
  { to: '/expressions', icon: Sparkles, label: '表达库' },
  { to: '/pronunciation', icon: Volume2, label: '发音本' },
]

const aiItems = [
  { to: '/ai/answer', icon: Brain, label: 'AI 生成答案' },
  { to: '/ai/upgrade', icon: RefreshCw, label: 'AI 词汇升级' },
]

export default function Sidebar() {
  const location = useLocation()

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700 font-medium'
        : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <aside className="w-60 h-screen bg-sidebar border-r border-slate-200 flex flex-col fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          雅思口语笔记本
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          板块
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => linkClass(isActive)}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <p className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 pt-4">
          AI 工具
        </p>
        {aiItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => linkClass(isActive)}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <p className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 pt-4">
          系统
        </p>
        <NavLink to="/settings" className={({ isActive }) => linkClass(isActive)}>
          <Settings size={18} />
          设置
        </NavLink>
      </nav>
    </aside>
  )
}
