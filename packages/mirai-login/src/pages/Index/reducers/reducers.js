import { createSlice } from '@reduxjs/toolkit';
import { findIndex } from 'lodash';
import dbRedux, { objectStoreName } from '../../../utils/dbInit/dbRedux';

const { actions, reducer } = createSlice({
  name: 'login',
  initialState: {
    miraiChild: undefined, // { child, event }
    optionsList: [] // 登陆账号列表
  },
  reducers: {
    // 登陆进程
    setMiraiChild(state, action) {
      state.miraiChild = action.payload;

      return state;
    },

    // 快速登陆列表
    setOptionsList(state, action) {
      const index = findIndex(state.optionsList, {
        qqNumber: action.payload.result
      });

      if (index < 0) {
        state.optionsList = action.payload.result;
      } else {
        state.optionsList[index] = action.payload.result;
      }

      return state;
    },

    // 保存
    setOptionSaveList(state, action) {
      state.optionsList.push(action.payload.data);

      return state;
    },

    // 删除
    setDeleteOption(state, action) {
      const index = findIndex(state.optionsList, {
        qqNumber: action.payload.query
      });

      state.optionsList.splice(index, 1);

      return state;
    }
  }
});

export const { setMiraiChild, setOptionsList, setOptionSaveList, setDeleteOption } = actions;

// 获取列表
export const queryOptionsList = dbRedux.cursorAction({
  objectStoreName,
  successAction: setOptionsList
});

// 保存数据
export const saveFormData = dbRedux.putAction({
  objectStoreName,
  successAction: setOptionSaveList
});

// 删除
export const deleteOption = dbRedux.deleteAction({
  objectStoreName,
  successAction: setDeleteOption
});

export default { login: reducer };