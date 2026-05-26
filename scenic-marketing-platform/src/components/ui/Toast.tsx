import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

let toastFn: ((msg: string, type?: ToastType) => void) | null = null;

export function toast(msg: string, type: ToastType = 'success') {
  toastFn?.(msg, type);
}

export default function ToastContainer() {
  const [items, setItems] = useState<{ id: number; msg: string; type: ToastType }[]>([]);

  useEffect(() => {
    toastFn = (msg, type = 'success') => {
      const id = Date.now();
      setItems((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3000);
    };
    return () => { toastFn = null; };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-[slideIn_0.3s_ease] ${
            item.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : item.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          {item.type === 'success' ? <CheckCircle size={16} /> : item.type === 'error' ? <XCircle size={16} /> : <AlertCircle size={16} />}
          {item.msg}
          <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))} className="ml-2">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
