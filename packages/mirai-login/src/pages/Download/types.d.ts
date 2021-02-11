import type { MiraiDownloadInfoItem } from './services/interface';

export type StepStatus = 0 | 1 | 2; // 下载进度。0 等待下载 1 下载中 2 下载完成

export interface DownloadProgressItem extends MiraiDownloadInfoItem {
  percent: number; // 下载进度
  base: string;    // 文件名
}