import { createApp, App as VueApp, ConcreteComponent } from 'vue';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { router } from './router/routers';
import { storeFactory } from './store/store';
import dbInit from './utils/dbInit/dbInit';

dayjs.locale('zh-cn');

/* app */
const app: VueApp = createApp((): ConcreteComponent => (
  <div class="app">
    <ConfigProvider locale={ zhCN }>
      <router-view />
    </ConfigProvider>
  </div>
));

app.use(storeFactory());
app.use(router);

app.mount('#app');

dbInit();