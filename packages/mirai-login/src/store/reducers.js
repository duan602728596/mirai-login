import { combineReducers } from '@reduxjs/toolkit';
import indexReducers from '../pages/Index/reducers/reducers';

/* reducers */
const reducers = Object.assign({}, indexReducers);

/* 创建reducer */
export function createReducer(asyncReducers) {
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}

export const ignoreOptions = {
  ignoredPaths: ['login.miriaChild'],
  ignoredActions: ['login/setMiriaChild']
};