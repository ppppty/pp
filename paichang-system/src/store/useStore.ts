import { create } from 'zustand';
import { Schedule, Submission, SlotConfig, SlotType } from '../types';
import { defaultSchedules, defaultSubmissions, defaultConfigs } from '../data/mockData';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

interface Store {
  // data
  schedules: Schedule[];
  submissions: Submission[];
  configs: SlotConfig[];
  activeSlot: SlotType;

  // admin
  isAdmin: boolean;

  // schedule crud
  addSchedule: (s: Schedule) => void;
  updateSchedule: (s: Schedule) => void;
  deleteSchedule: (id: string) => void;
  setActiveSlot: (t: SlotType) => void;

  // submission
  addSubmission: (s: Submission) => void;
  approveSubmission: (id: string, scheduleId?: string) => void;
  rejectSubmission: (id: string, reason: string) => void;
  batchApprove: (ids: string[]) => void;
  batchReject: (ids: string[]) => void;

  // admin
  login: (pwd: string) => boolean;
  logout: () => void;

  // config
  updateConfig: (c: SlotConfig) => void;
}

export const useStore = create<Store>((set, get) => ({
  schedules: load<Schedules[]>('paichang-schedules', defaultSchedules),
  submissions: load<Submission[]>('paichang-submissions', defaultSubmissions),
  configs: load<SlotConfig[]>('paichang-configs', defaultConfigs),
  activeSlot: '顶通',
  isAdmin: false,

  addSchedule: (s) => {
    const schedules = [s, ...get().schedules];
    save('paichang-schedules', schedules);
    set({ schedules });
  },
  updateSchedule: (s) => {
    const schedules = get().schedules.map((x) => (x.id === s.id ? s : x));
    save('paichang-schedules', schedules);
    set({ schedules });
  },
  deleteSchedule: (id) => {
    const schedules = get().schedules.filter((x) => x.id !== id);
    save('paichang-schedules', schedules);
    set({ schedules });
  },
  setActiveSlot: (t) => set({ activeSlot: t }),

  addSubmission: (sub) => {
    const submissions = [sub, ...get().submissions];
    save('paichang-submissions', submissions);
    set({ submissions });
  },

  approveSubmission: (id, scheduleId) => {
    const submissions = get().submissions.map((s) => {
      if (s.id !== id) return s;
      const approved = { ...s, status: '已通过' as const, scheduleId };
      if (scheduleId) {
        const existing = get().schedules.find((sch) => sch.id === scheduleId);
        if (!existing) {
          const sub = s;
          const newSchedule: Schedule = {
            id: scheduleId,
            activityName: sub.name,
            slotType: sub.positions[0]?.slotType || '顶通',
            region: sub.positions[0]?.region || '全国',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            remark: sub.description,
            createdAt: new Date().toISOString().split('T')[0],
          };
          const schedules = [newSchedule, ...get().schedules];
          save('paichang-schedules', schedules);
          set({ schedules });
        }
      }
      return approved;
    });
    save('paichang-submissions', submissions);
    set({ submissions });
  },

  rejectSubmission: (id, reason) => {
    const submissions = get().submissions.map((s) =>
      s.id === id ? { ...s, status: '已拒绝' as const, rejectReason: reason } : s
    );
    save('paichang-submissions', submissions);
    set({ submissions });
  },

  batchApprove: (ids) => {
    const { submissions, schedules } = get();
    let newSchedules = [...schedules];
    const updatedSubmissions = submissions.map((s) => {
      if (!ids.includes(s.id)) return s;
      const scheduleId = `sch-${Date.now()}-${s.id}`;
      const newSchedule: Schedule = {
        id: scheduleId,
        activityName: s.name,
        slotType: s.positions[0]?.slotType || '顶通',
        region: s.positions[0]?.region || '全国',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        remark: s.description,
        createdAt: new Date().toISOString().split('T')[0],
      };
      newSchedules = [newSchedule, ...newSchedules];
      return { ...s, status: '已通过' as const, scheduleId };
    });
    save('paichang-schedules', newSchedules);
    save('paichang-submissions', updatedSubmissions);
    set({ schedules: newSchedules, submissions: updatedSubmissions });
  },

  batchReject: (ids) => {
    const submissions = get().submissions.map((s) =>
      ids.includes(s.id) ? { ...s, status: '已拒绝' as const, rejectReason: '' } : s
    );
    save('paichang-submissions', submissions);
    set({ submissions });
  },

  login: (pwd) => {
    if (pwd === 'admin123') {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAdmin: false }),

  updateConfig: (c) => {
    const configs = get().configs.map((x) => (x.type === c.type ? c : x));
    save('paichang-configs', configs);
    set({ configs });
  },
}));
