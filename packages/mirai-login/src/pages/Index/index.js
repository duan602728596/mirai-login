import { Space } from 'antd';
import style from './index.sass';
import useLogin from './Login/useLogin';
import Download from './Download';

/* 首页 */
function Index(props) {
  const login = useLogin();

  return (
    <div className={ style.content }>
      <Space className={ style.tools }>
        { login.element }
        <Download />
      </Space>
    </div>
  );
}

export default Index;