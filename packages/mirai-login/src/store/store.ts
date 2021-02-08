import Vuex, { Store } from 'vuex';

let store: Store<any>;

/* 创建store */
export function storeFactory(initialState: any = {}): Store<any> {
  if (!store) {
    store = new Vuex.Store({
      state: initialState,
      modules: {}
    });
  }

  return store;
}