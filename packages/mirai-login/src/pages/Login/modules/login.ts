import type { Module } from 'vuex';
import type { PayloadAction, MiraiChild } from '../../../types';

export interface LoginInitialState {
  miraiChild: MiraiChild;
}

export interface LoginGetters {
  getMiraiChild(state: LoginInitialState): () => MiraiChild;
}

const module: Module<LoginInitialState, LoginGetters> = {
  namespaced: true,
  state: {
    miraiChild: undefined // mirai进程
  },
  getters: {
    getMiraiChild(state: LoginInitialState): () => MiraiChild {
      return (): MiraiChild => state.miraiChild;
    }
  },
  mutations: {
    // 设置mirai进程
    setMiraiChild(state: LoginInitialState, action: PayloadAction<MiraiChild>): void {
      state.miraiChild = action.payload;
    }
  }
};

export default { login: module };