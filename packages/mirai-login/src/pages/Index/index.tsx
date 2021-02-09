import { defineComponent, RendererElement } from 'vue';
import { Space, Button } from 'ant-design-vue';
import AppDirPath from './Options/AppDirPath';
import JdkPath from './Options/JdkPath';
import style from './index.sass';

/* 首页 */
export default defineComponent({
  render(): RendererElement {
    return (
      <div class={ style.content }>
        <Space>
          <AppDirPath />
          <JdkPath />
          <router-link to="/Download">
            <Button>下载mirai</Button>
          </router-link>
        </Space>
      </div>
    );
  }
});