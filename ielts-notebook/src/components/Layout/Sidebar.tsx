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
  StickyNote,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/speaking', icon: MessageSquare, label: '串题板块' },
  { to: '/topics', icon: Library, label: '主题素材' },
  { to: '/expressions', icon: Sparkles, label: '词汇表达' },
  { to: '/pronunciation', icon: Volume2, label: '发音本' },
  { to: '/quick-notes', icon: StickyNote, label: '快捷笔记' },
]

const aiItems = [
  { to: '/ai/answer', icon: Brain, label: 'AI 生成答案' },
  { to: '/ai/upgrade', icon: RefreshCw, label: 'AI 词汇升级' },
]

export default function Sidebar() {
  const location = useLocation()

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.9375rem] transition-all ${
      isActive
        ? 'bg-white text-brand-600 font-semibold shadow-sm'
        : 'text-slate-700/50 hover:bg-white/60 hover:text-slate-700'
    }`

  const sectionClass = 'px-3 text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-wider mb-1.5'

  return (
    <aside
      className="w-60 h-screen flex flex-col fixed left-0 top-0 z-10 border-r border-slate-100"
      style={{ background: 'linear-gradient(180deg, #f8f7fb 0%, #faf9fb 50%, #f5f3f8 100%)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-700 tracking-tight">
          雅思口语笔记本
        </h1>
        <p className="text-xs text-slate-400 mt-1">IELTS Speaking Notebook</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className={sectionClass}>板块</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => linkClass(isActive)}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

        <p className={`${sectionClass} pt-4`}>AI 工具</p>
        {aiItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => linkClass(isActive)}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

        <p className={`${sectionClass} pt-4`}>系统</p>
        <NavLink to="/settings" className={({ isActive }) => linkClass(isActive)}>
          <Settings size={20} />
          设置
        </NavLink>
      </nav>
    </aside>
  )
}
