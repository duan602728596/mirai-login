import type { ChildProcessWithoutNullStreams } from 'child_process';

/* vuex action */
export interface PayloadAction<T = any> {
  type: string;
  payload: T;
}

/* 进度条信息 */
export interface ProgressEventData {
  percent: number;
  transferred: number;
  total: number;
}

/* mirai child */
export interface MiraiChildProcess {
  event: Event;
  child: ChildProcessWithoutNullStreams;
}

export type MiraiChild = MiraiChildProcess | undefined;