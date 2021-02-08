import { defineComponent, RendererElement } from 'vue';
import { Space } from 'ant-design-vue';
import AppDirPath from './components/AppDirPath';
import style from './index.sass';

export default defineComponent({
  render(): RendererElement {
    return (
      <div class={ style.content }>
        <Space>
          <AppDirPath />
        </Space>
      </div>
    );
  }
});