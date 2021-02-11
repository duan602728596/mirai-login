import { defineComponent, RendererElement } from 'vue';
import { Button, Divider } from 'ant-design-vue';
import { CloudDownloadOutlined as IconCloudDownloadOutlined } from '@ant-design/icons-vue';
import style from './index.sass';
import { requestMiraiDownloadInfo } from './services/download';

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
        <Divider />
        <Button type="primary" icon={ <IconCloudDownloadOutlined /> }>下载mirai</Button>
      </div>
    );
  }
});