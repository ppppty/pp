import { useMemo, useState, type ReactNode } from 'react';
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Link as LinkIcon,
  LogIn,
  LogOut,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react';

type Tab = 'calendar' | 'submit' | 'submissions' | 'guide';
type PositionType = 'top' | 'middle' | 'popup' | 'sidebar';
type SubmissionStatus = 'pending' | 'approved' | 'rejected';

interface Schedule {
  id: string;
  positionType: PositionType;
  activityName: string;
  region: string;
  startDate: string;
  endDate: string;
  remark?: string;
}

interface Submission {
  id: string;
  activityName: string;
  positionType: PositionType;
  region: string;
  startDate: string;
  endDate: string;
  misId: string;
  status: SubmissionStatus;
  description: string;
}

const positions = [
  { key: 'top', label: '顶通', dot: 'bg-rose-300', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  { key: 'middle', label: '中通', dot: 'bg-sky-300', text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  { key: 'popup', label: '弹窗', dot: 'bg-violet-300', text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { key: 'sidebar', label: '侧边栏', dot: 'bg-emerald-300', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
] as const;

const seedSchedules: Schedule[] = [
  { id: 's1', positionType: 'top', activityName: '北京环球影城春季特惠', region: '全国', startDate: '2026-04-02', endDate: '2026-04-08', remark: '重点营销活动' },
  { id: 's2', positionType: 'middle', activityName: '上海迪士尼乐园奇妙夜', region: '江浙沪', startDate: '2026-04-06', endDate: '2026-04-12' },
  { id: 's3', positionType: 'popup', activityName: '广州长隆亲子季', region: '广东', startDate: '2026-04-11', endDate: '2026-04-16' },
  { id: 's4', positionType: 'sidebar', activityName: '杭州西湖踏青榜单', region: '江浙沪', startDate: '2026-04-14', endDate: '2026-04-21' },
  { id: 's5', positionType: 'top', activityName: '五一提前订景区门票', region: '全国', startDate: '2026-04-22', endDate: '2026-04-30' },
  { id: 's6', positionType: 'middle', activityName: '成都熊猫基地热卖', region: '四川', startDate: '2026-04-25', endDate: '2026-05-03' },
];

const seedSubmissions: Submission[] = [
  { id: 'sub1', activityName: '张家界天门山云海季', positionType: 'top', region: '华中', startDate: '2026-04-18', endDate: '2026-04-24', misId: 'zhangsan', status: 'pending', description: '配合春季旅游高峰，申请顶部通栏露出。' },
  { id: 'sub2', activityName: '桂林漓江竹筏票促销', positionType: 'popup', region: '广西', startDate: '2026-04-10', endDate: '2026-04-13', misId: 'lisi', status: 'approved', description: '弱干扰弹窗提醒，承接周末转化。' },
  { id: 'sub3', activityName: '三亚亚龙湾度假季', positionType: 'sidebar', region: '海南', startDate: '2026-04-26', endDate: '2026-05-05', misId: 'wangwu', status: 'rejected', description: '同档期资源已满，建议调整时间。' },
];

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function typeStyle(type: PositionType) {
  return positions.find((item) => item.key === type) ?? positions[0];
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function schedulesForDay(schedules: Schedule[], date: Date) {
  const key = dateKey(date);
  return schedules.filter((item) => item.startDate <= key && item.endDate >= key);
}

export default function App() {
  const [tab, setTab] = useState<Tab>('calendar');
  const [month, setMonth] = useState(new Date(2026, 3, 1));
  const [schedules] = useState(seedSchedules);
  const [submissions, setSubmissions] = useState(seedSubmissions);
  const [admin, setAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedSchedules = useMemo(() => (selectedDate ? schedulesForDay(schedules, selectedDate) : []), [selectedDate, schedules]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-40 border-b border-[#F5D5E0] bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#E57895]">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">景点频道页资源位排期</h1>
              <p className="text-xs text-gray-500">可视化排期管理系统</p>
            </div>
          </div>
          {admin ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-[#FFF0F4] px-3 py-1.5 text-sm font-medium text-[#D45F7A]">
                <ShieldCheck className="h-4 w-4" />
                管理员模式
              </span>
              <button onClick={() => setAdmin(false)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                <LogOut className="h-4 w-4" />
                退出
              </button>
            </div>
          ) : (
            <button onClick={() => setLoginOpen(true)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
              <LogIn className="h-4 w-4" />
              管理员登录
            </button>
          )}
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 px-4">
          <NavButton active={tab === 'calendar'} onClick={() => setTab('calendar')} icon={<Calendar className="h-4 w-4" />}>排期日历</NavButton>
          {!admin && <NavButton active={tab === 'submit'} onClick={() => setTab('submit')} icon={<Plus className="h-4 w-4" />}>排期提报</NavButton>}
          <NavButton active={tab === 'submissions'} onClick={() => setTab('submissions')} icon={<ClipboardList className="h-4 w-4" />}>提报清单</NavButton>
          <NavButton active={tab === 'guide'} onClick={() => setTab('guide')} icon={<BookOpen className="h-4 w-4" />}>配置指南</NavButton>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {tab === 'calendar' && <CalendarPanel month={month} setMonth={setMonth} schedules={schedules} admin={admin} onDay={setSelectedDate} />}
        {tab === 'submit' && <SubmitPanel onSubmit={(item) => { setSubmissions([{ ...item, id: `sub-${Date.now()}`, status: 'pending' }, ...submissions]); setTab('submissions'); }} />}
        {tab === 'submissions' && <SubmissionPanel submissions={submissions} admin={admin} setSubmissions={setSubmissions} />}
        {tab === 'guide' && <GuidePanel />}
      </main>

      {selectedDate && <DayDialog date={selectedDate} schedules={selectedSchedules} onClose={() => setSelectedDate(null)} />}
      {loginOpen && <LoginDialog onClose={() => setLoginOpen(false)} onSuccess={() => { setAdmin(true); setLoginOpen(false); }} />}
    </div>
  );
}

function NavButton({ active, icon, children, onClick }: { active: boolean; icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${active ? 'border-[#E57895] text-[#D45F7A]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
      {icon}
      {children}
    </button>
  );
}

function CalendarPanel({ month, setMonth, schedules, admin, onDay }: { month: Date; setMonth: (date: Date) => void; schedules: Schedule[]; admin: boolean; onDay: (date: Date) => void }) {
  const [filter, setFilter] = useState<PositionType | 'all'>('all');
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#F5D5E0] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F5D5E0] px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMonth(new Date(year, monthIndex - 1, 1))} className="rounded-lg p-1.5 hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
          <h2 className="text-xl font-bold">{month.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}</h2>
          <button onClick={() => setMonth(new Date(year, monthIndex + 1, 1))} className="rounded-lg p-1.5 hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {positions.map((item) => <span key={item.key} className="flex items-center gap-1.5 text-xs text-gray-600"><span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />{item.label}</span>)}
          {admin && <button className="rounded-lg bg-[#E57895] px-3 py-1.5 text-sm font-medium text-white">添加排期</button>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-[#F5D5E0] px-6 py-3">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>全部</FilterButton>
        {positions.map((item) => <FilterButton key={item.key} active={filter === item.key} onClick={() => setFilter(item.key)}>{item.label}</FilterButton>)}
      </div>
      <div className="grid grid-cols-7 border-b border-[#F5D5E0]">
        {weekdays.map((day) => <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500">{day}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="min-h-[100px] border-b border-r border-[#FAE8EF]" />;
          const date = new Date(year, monthIndex, day);
          const list = schedulesForDay(schedules, date).filter((item) => filter === 'all' || item.positionType === filter);
          return (
            <button key={day} onClick={() => onDay(date)} className="min-h-[100px] border-b border-r border-[#F5D5E0] bg-white p-1.5 text-left transition-colors hover:bg-[#FFF0F4]/60">
              <span className="mb-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-gray-700">{day}</span>
              <div className="space-y-0.5">
                {list.slice(0, 3).map((item) => {
                  const style = typeStyle(item.positionType);
                  return <div key={item.id} className={`truncate rounded px-1.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}><span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${style.dot}`} />{item.activityName} ({item.region})</div>;
                })}
                {list.length > 3 && <div className="px-1.5 text-xs text-gray-400">+{list.length - 3} 更多</div>}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-full px-4 py-1.5 text-sm font-medium ${active ? 'bg-[#E57895] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{children}</button>;
}

function DayDialog({ date, schedules, onClose }: { date: Date; schedules: Schedule[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="font-semibold">{date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</h2>
            <p className="text-xs text-gray-500">共 {schedules.length} 个排期</p>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-400" /></button>
        </div>
        <div className="space-y-3 overflow-y-auto p-6">
          {schedules.length === 0 ? <div className="py-12 text-center text-gray-400">当天暂无排期</div> : schedules.map((item) => {
            const style = typeStyle(item.positionType);
            return <div key={item.id} className={`rounded-xl border p-3 ${style.bg} ${style.border}`}><p className={`text-sm font-medium ${style.text}`}>{item.activityName}</p><p className="mt-1 text-xs text-gray-500">{item.region} · {item.startDate} - {item.endDate}</p>{item.remark && <p className="mt-1 text-xs text-gray-400">备注：{item.remark}</p>}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

function SubmitPanel({ onSubmit }: { onSubmit: (item: Omit<Submission, 'id' | 'status'>) => void }) {
  const [value, setValue] = useState<Omit<Submission, 'id' | 'status'>>({ activityName: '', positionType: 'top', region: '全国', startDate: '', endDate: '', misId: '', description: '' });
  const update = (key: keyof typeof value, next: string) => setValue((current) => ({ ...current, [key]: next }));
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <Title title="排期提报" />
      <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); if (value.activityName && value.misId && value.startDate && value.endDate) onSubmit(value); }}>
        <Field label="排期名称"><input className="field" value={value.activityName} onChange={(event) => update('activityName', event.target.value)} /></Field>
        <Field label="资源位类型"><select className="field" value={value.positionType} onChange={(event) => update('positionType', event.target.value)}>{positions.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="开始日期"><input className="field" type="date" value={value.startDate} onChange={(event) => update('startDate', event.target.value)} /></Field><Field label="结束日期"><input className="field" type="date" value={value.endDate} onChange={(event) => update('endDate', event.target.value)} /></Field></div>
        <div className="grid grid-cols-2 gap-3"><Field label="投放地区"><input className="field" value={value.region} onChange={(event) => update('region', event.target.value)} /></Field><Field label="提报人 MIS"><input className="field" value={value.misId} onChange={(event) => update('misId', event.target.value)} /></Field></div>
        <Field label="提报说明"><textarea className="field min-h-24 resize-none" value={value.description} onChange={(event) => update('description', event.target.value)} /></Field>
        <button className="w-full rounded-lg bg-[#E57895] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#D45F7A]">提交提报</button>
      </form>
    </section>
  );
}

function SubmissionPanel({ submissions, admin, setSubmissions }: { submissions: Submission[]; admin: boolean; setSubmissions: (items: Submission[]) => void }) {
  const statusText = { pending: '待审核', approved: '已通过', rejected: '已拒绝' };
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4"><h2 className="text-lg font-bold">提报清单</h2><p className="text-sm text-gray-500">共 {submissions.length} 条提报</p></div>
      <div className="divide-y divide-gray-50">
        {submissions.map((item) => {
          const style = typeStyle(item.positionType);
          return <div key={item.id} className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-gray-50/50"><div><div className="mb-1.5 flex gap-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>{style.label}</span><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{statusText[item.status]}</span></div><p className="text-sm font-semibold">{item.activityName}</p><p className="mt-1 text-xs text-gray-500">{item.region} · {item.startDate} - {item.endDate} · {item.misId}</p><p className="mt-1 text-xs text-gray-400">{item.description}</p></div>{admin && item.status === 'pending' && <div className="flex gap-2"><button onClick={() => setSubmissions(submissions.map((sub) => sub.id === item.id ? { ...sub, status: 'approved' } : sub))} className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white">通过</button><button onClick={() => setSubmissions(submissions.map((sub) => sub.id === item.id ? { ...sub, status: 'rejected' } : sub))} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white">拒绝</button></div>}</div>;
        })}
      </div>
    </section>
  );
}

function GuidePanel() {
  const links = ['侧边栏配置', '弹窗配置', '顶通配置', '中通配置', '弹窗 SOP', '侧边栏 SOP', '顶通 SOP', '中通 SOP', '数据看板'];
  return <section className="mx-auto max-w-3xl space-y-5">{links.map((item) => <a key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-[#F5D5E0] hover:bg-[#FFF8FA]"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#FFF0F4] text-[#E57895]"><LinkIcon className="h-4 w-4" /></div><span className="flex-1 text-sm font-medium text-gray-700">{item}</span><ExternalLink className="h-3.5 w-3.5 text-gray-300" /></a>)}</section>;
}

function LoginDialog({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><form className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onSubmit={(event) => { event.preventDefault(); if (password === '123') onSuccess(); }}><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">管理员验证</h2><button type="button" onClick={onClose}><X className="h-5 w-5 text-gray-400" /></button></div><input className="field mb-4" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入密码" autoFocus /><div className="flex gap-2"><button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600">取消</button><button className="flex-1 rounded-lg bg-[#E57895] px-4 py-2.5 text-sm font-medium text-white">确认</button></div></form></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>{children}</label>;
}

function Title({ title }: { title: string }) {
  return <div className="mb-5 flex items-center gap-2"><div className="h-5 w-1 rounded-full bg-[#E57895]" /><h2 className="text-base font-bold">{title}</h2></div>;
}
