export type SlotType = '顶通' | '中通' | '弹窗' | '侧边栏';

export interface Schedule {
  id: string;
  activityName: string;
  slotType: SlotType;
  region: string;
  startDate: string;
  endDate: string;
  remark: string;
  createdAt: string;
}

export type SubmitStatus = '待审核' | '已通过' | '已拒绝';

export interface Position {
  slotType: SlotType;
  region: string;
}

export interface Submission {
  id: string;
  name: string;
  misId: string;
  description: string;
  positions: Position[];
  status: SubmitStatus;
  rejectReason?: string;
  createdAt: string;
  scheduleId?: string;
}

export interface SlotConfig {
  type: SlotType;
  configUrl: string;
  sopUrl: string;
}

export type PageTab = '顶通' | '中通' | '弹窗' | '侧边栏';
