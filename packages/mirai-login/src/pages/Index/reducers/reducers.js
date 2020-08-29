import { createSlice } from '@reduxjs/toolkit';

const { actions, reducer } = createSlice({
  name: 'login',
  initialState: {
    loginList: []
  },
  reducers: {
    // 登陆列表
    setLoginList(state, action) {
      state.loginList = action.payload;

      return state;
    }
  }
});

export const { setLoginList } = actions;
export default { login: reducer };