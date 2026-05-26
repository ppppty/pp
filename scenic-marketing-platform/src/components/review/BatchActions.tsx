import { CheckCheck, XCircle } from 'lucide-react';

interface Props {
  selected: string[];
  onApproveAll: () => void;
  onRejectAll: () => void;
  total: number;
}

export default function BatchActions({ selected, onApproveAll, onRejectAll, total }: Props) {
  if (selected.length === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
      <span className="text-sm text-blue-700 font-medium">
        已选 {selected.length} / {total} 条提报
      </span>
      <div className="flex-1" />
      <button
        onClick={onApproveAll}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
      >
        <CheckCheck size={16} />
        全部通过
      </button>
      <button
        onClick={onRejectAll}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
      >
        <XCircle size={16} />
        全部拒绝
      </button>
    </div>
  );
}
