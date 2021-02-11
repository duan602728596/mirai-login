import type { Module } from 'vuex';
import { findIndex } from 'lodash-es';
import type { PayloadAction } from '../../../types';
import type { StepStatus, DownloadProgressItem } from '../types';

export interface DownloadInitialState {
  step: StepStatus;
  downloadProgress: Array<DownloadProgressItem>;
}

export interface DownloadGetters {
  getStep(state: DownloadInitialState): () => StepStatus;
  getDownloadProgress(state: DownloadInitialState): () => Array<DownloadProgressItem>;
}

const module: Module<DownloadInitialState, DownloadGetters> = {
  namespaced: true,
  state: {
    step: 0,             // 下载状态
    downloadProgress: [] // 下载进度
  },
  getters: {
    getStep: (state: DownloadInitialState) => (): StepStatus => state.step,
    getDownloadProgress: (state: DownloadInitialState) => (): Array<DownloadProgressItem> => state.downloadProgress
  },
  mutations: {
    // 设置下载状态
    setStep(state: DownloadInitialState, action: PayloadAction<StepStatus>): void {
      state.step = action.payload;
    },

    // 设置下载进度
    setDownloadProgress(state: DownloadInitialState, action: PayloadAction<DownloadProgressItem>): void {
      const index: number = findIndex(state.downloadProgress, {
        name: action.payload.name
      });

      if (index >= 0) {
        state.downloadProgress[index] = action.payload;
        state.downloadProgress = [...state.downloadProgress];
      } else {
        state.downloadProgress.push(action.payload);
      }
    }
  }
};

export default { download: module };