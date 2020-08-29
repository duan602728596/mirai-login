import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'login',
  initialState: {
    miraiChild: undefined // { child, event }
  },
  reducers: {
    // 登陆列表
    setMiraiChild(state, action) {
      state.miraiChild = action.payload;

      return state;
    }
  }
});

export const { setMiraiChild } = actions;
export default { login: reducer };