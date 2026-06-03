import { useState } from 'react'
import { Search, Plus, X } from 'lucide-react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  onQuickNote: () => void
  title?: string
}

export default function Header({ searchQuery, onSearchChange, onQuickNote, title }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {title && (
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        )}

        {/* 搜索 */}
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="搜索题目、表达、素材..."
              className="w-64 text-sm border-none outline-none bg-transparent"
              autoFocus
            />
            {searchQuery && (
              <button
                className="text-slate-400 hover:text-slate-600"
                onClick={() => { onSearchChange(''); setSearchOpen(false) }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <button
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={16} />
            <span>搜索</span>
          </button>
        )}
      </div>

      <button
        onClick={onQuickNote}
        className="btn btn-primary btn-sm"
        title="快速笔记"
      >
        <Plus size={16} />
        快捷笔记
      </button>
    </header>
  )
}
