import { Search, Plus, X } from 'lucide-react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  onQuickNote: () => void
  title?: string
}

export default function Header({ searchQuery, onSearchChange, onQuickNote, title }: HeaderProps) {

  return (
    <header className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        {title && (
          <h2 className="text-[1.0625rem] font-semibold text-slate-700">{title}</h2>
        )}

        {/* 始终可见的搜索框 */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="搜索题目、表达、素材..."
            className="w-full pl-9 pr-8 py-1.5 text-[0.9375rem] border border-slate-200 rounded-lg outline-none bg-white text-slate-900 placeholder-slate-300 focus:border-brand-300 focus:shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-400"
              onClick={() => onSearchChange('')}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onQuickNote}
        className="btn btn-primary btn-sm ml-4 shrink-0"
        title="快捷笔记"
      >
        <Plus size={17} />
        快捷笔记
      </button>
    </header>
  )
}
