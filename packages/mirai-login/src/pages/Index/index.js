import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { Space, List, Button } from 'antd';
import { ToolFilled as IconToolFilled } from '@ant-design/icons';
import style from './index.sass';
import useLogin from './useLogin/useLogin';
import Download from './func/Download';
import JdkPath from './func/JdkPath';
import { queryOptionsList, deleteOption } from './reducers/reducers';
import dbConfig from '../../utils/dbInit/dbConfig';

/* state */
const state = createStructuredSelector({
  optionsList: createSelector(
    ({ login }) => login.optionsList,
    (data) => data
  )
});

/* 首页 */
function Index(props) {
  const { optionsList } = useSelector(state);
  const dispatch = useDispatch();
  const login = useLogin();

  // 打开开发者工具
  function handleOpenDeveloperToolsClick(event) {
    ipcRenderer.send('developer-tools');
  }

  // 登陆
  function handleLoginClick(item, event) {
    login.login({
      username: item.qqNumber,
      password: item.value.password
    });
  }

  // 删除
  function handleDeleteClick(item, event) {
    ({ query: item.qqNumber }) |> deleteOption |> dispatch;
  }

  // 渲染账号列表
  function listItemRender(item) {
    return (
      <List.Item key={ item.qqNumber }
        actions={
          [
            <Button key="login"
              type="text"
              onClick={ (event) => handleLoginClick(item, event) }
            >
              登陆
            </Button>,
            <Button key="delete"
              type="text"
              danger={ true }
              onClick={ (event) => handleDeleteClick(item, event) }
            >
              删除
            </Button>
          ]
        }
      >
        <List.Item.Meta title={ item.qqNumber } description={ item.time } />
      </List.Item>
    );
  }

  useEffect(function() {
    setTimeout(function() {
      dispatch(queryOptionsList({
        query: { indexName: dbConfig.objectStore[0].data[0] }
      }));
    }, 0);
  }, []);

  return (
    <div className={ style.content }>
      <Space className={ style.tools }>
        { login.element }
        <Download />
        <JdkPath />
        <Button type="text" icon={ <IconToolFilled /> } onClick={ handleOpenDeveloperToolsClick } />
      </Space>
      {/* 快速登陆 */}
      <div className={ style.list }>
        <List size="small" dataSource={ optionsList } renderItem={ listItemRender } bordered={ true } />
      </div>
    </div>
  );
}

export default Index;