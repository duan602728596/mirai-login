import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'login',
  initialState: {
    miriaChild: undefined // { child, event }
  },
  reducers: {
    // 登陆列表
    setMiriaChild(state, action) {
      state.miriaChild = action.payload;

      return state;
    }
  }
});

export const { setMiriaChild } = actions;
export default { login: reducer };