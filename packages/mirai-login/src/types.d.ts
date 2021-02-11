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