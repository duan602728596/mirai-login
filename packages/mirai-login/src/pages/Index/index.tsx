import { defineComponent, RendererElement } from 'vue';
import { Space, Button, Divider } from 'ant-design-vue';
import { QqOutlined as IconQqOutlined } from '@ant-design/icons-vue';
import AppDirPath from './Options/AppDirPath';
import JdkPath from './Options/JdkPath';
import Content from '../../components/Content/Content';

/* 首页 */
export default defineComponent({
  render(): RendererElement {
    return (
      <Content>
        <Space>
          <AppDirPath />
          <JdkPath />
          <router-link to="/Download">
            <Button>下载mirai</Button>
          </router-link>
        </Space>
        <Divider />
        <router-link to="/Login">
          <Button type="primary" icon={ <IconQqOutlined /> }>登陆</Button>
        </router-link>
      </Content>
    );
  }
});