import { defineComponent, RendererElement } from 'vue';
import { Button } from 'ant-design-vue';
import style from './index.sass';

/* 下载mirai文件 */
export default defineComponent({
  render(): RendererElement {
    return (
      <div class={ style.content }>
        <div>
          <router-link to="/">
            <Button type="danger">返回</Button>
          </router-link>
        </div>
      </div>
    );
  }
});