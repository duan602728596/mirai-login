import Vuex, { Store } from 'vuex';
import downloadModule from '../pages/Download/modules/download';

export let store: Store<any>;

/* 创建store */
export function storeFactory(initialState: any = {}): Store<any> {
  if (!store) {
    store = new Vuex.Store<any>({
      state: initialState,
      modules: Object.assign({},
        downloadModule
      )
    });
  }

  return store;
}