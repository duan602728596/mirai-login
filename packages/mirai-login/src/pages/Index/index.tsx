import { defineComponent, RendererElement } from 'vue';
import { Space } from 'ant-design-vue';
import AppDirPath from './Options/AppDirPath';
import JdkPath from './Options/JdkPath';
import style from './index.sass';

export default defineComponent({
  render(): RendererElement {
    return (
      <div class={ style.content }>
        <Space>
          <AppDirPath />
          <JdkPath />
        </Space>
      </div>
    );
  }
});