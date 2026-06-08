import { useRef, useState, type ReactNode } from 'react'

interface KeepAliveProps {
  active: boolean
  children: ReactNode
}

/** 保持页面 DOM 不销毁，切换回来时保留滚动位置和表单状态 */
export default function KeepAlive({ active, children }: KeepAliveProps) {
  const [hasRendered, setHasRendered] = useState(active)
  const containerRef = useRef<HTMLDivElement>(null)

  if (active && !hasRendered) {
    setHasRendered(true)
  }

  if (!hasRendered) return null

  return (
    <div ref={containerRef} style={{ display: active ? 'block' : 'none' }}>
      {children}
    </div>
  )
}
