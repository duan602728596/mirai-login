import type { Module } from 'vuex';
import type { StepStatus, DownloadProgressItem } from '../types';

export interface DownloadInitialState {
  step: StepStatus;
  downloadProgress: Array<DownloadProgressItem>;
}

export interface DownloadGetters {
  getStep(state: DownloadInitialState): () => StepStatus;
}

const module: Module<DownloadInitialState, DownloadGetters> = {
  namespaced: true,
  state: {
    step: 0,             // 下载状态
    downloadProgress: [] // 下载进度
  },
  getters: {
    getStep: (state: DownloadInitialState) => (): StepStatus => state.step
  }
};

export default { download: module };