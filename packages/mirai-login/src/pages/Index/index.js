import { Space } from 'antd';
import style from './index.sass';
import Login from './Login';
import Download from './Download';

/* 首页 */
function Index(props) {
  return (
    <div className={ style.content }>
      <Space className={ style.tools }>
        <Login />
        <Download />
      </Space>
    </div>
  );
}

export default Index;