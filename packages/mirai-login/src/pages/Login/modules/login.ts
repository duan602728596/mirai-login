import type { Module } from 'vuex';
import { findIndex } from 'lodash-es';
import type { PayloadAction, MiraiChild } from '../../../types';
import type { LoginInfo } from '../types';

export interface LoginInitialState {
  miraiChild: MiraiChild;
  loginInfoList: Array<LoginInfo>;
}

export interface LoginGetters {
  getMiraiChild(state: LoginInitialState): () => MiraiChild;
  getLoginInfoList(state: LoginInitialState): () => Array<LoginInfo>;
}

const module: Module<LoginInitialState, LoginGetters> = {
  namespaced: true,
  state: {
    miraiChild: undefined, // mirai进程
    loginInfoList: []      // 账号登陆列表
  },
  getters: {
    getMiraiChild(state: LoginInitialState): () => MiraiChild {
      return (): MiraiChild => state.miraiChild;
    },

    getLoginInfoList(state: LoginInitialState): () => Array<LoginInfo> {
      return (): Array<LoginInfo> => state.loginInfoList;
    }
  },
  mutations: {
    // 设置mirai进程
    setMiraiChild(state: LoginInitialState, action: PayloadAction<MiraiChild>): void {
      state.miraiChild = action.payload;
    },

    // 添加一个账号信息
    setAddLoginInfoList(state: LoginInitialState, action: PayloadAction<LoginInfo>): void {
      const index: number = findIndex(state.loginInfoList, { qqNumber: action.payload.qqNumber });

      if (index >= 0) {
        state.loginInfoList[index] = action.payload;
        state.loginInfoList = [...state.loginInfoList];
      } else {
        state.loginInfoList = state.loginInfoList.concat([action.payload]);
      }
    }
  }
};

export default { login: module };