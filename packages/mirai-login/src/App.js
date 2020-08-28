import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { hot } from '@sweet-milktea/milktea/react-hot-loader/root';
import { storeFactory } from './store/store';
import Index from './pages/Index/index';

/* App */
function App(props) {
  return (
    <Provider store={ storeFactory() }>
      <ConfigProvider locale={ zhCN }>
        <Index />
      </ConfigProvider>
    </Provider>
  );
}

export default hot(App);