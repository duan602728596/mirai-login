import { Space } from 'antd';
import style from './index.sass';
import Login from './Login';
import Download from './Download';

/* 首页 */
function Index(props) {
  return (
    <Space className={ style.content }>
      <Login />
      <Download />
    </Space>
  );
}

export default Index;