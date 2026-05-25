import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Shield } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export default function AdminGate({ children }: Props) {
  const { isAdmin, login } = useStore();
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (login(pwd)) {
      setError('');
    } else {
      setError('密码错误');
    }
  };

  if (isAdmin) return <>{children}</>;

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={24} className="text-brand-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">管理员验证</h3>
        <p className="text-sm text-gray-500 mb-4">请输入管理员密码以进入管理模式</p>
        <input
          type="password"
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="请输入密码"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-2"
        />
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
        >
          确认
        </button>
      </div>
    </div>
  );
}
