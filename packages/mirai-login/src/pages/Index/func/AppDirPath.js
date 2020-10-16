import { remote } from 'electron';
import { Fragment, useState } from 'react';
import { Form, Button, Modal, Input, message, Alert } from 'antd';
import { CodeSandboxOutlined as IconCodeSandboxOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import jdkPathStyle from './jdkPath.sass';

const msg = '根据mac系统的安全策略，从磁盘映像，归档文件或"下载"目录运行新下载的应用程序，无法获取真实路径。所以需要用户手动配置软件路径。';

/* appdir的配置 */
function AppDirPath(props) {
  const [visible, setVisible] = useState(false); // 弹出层
  const [form] = Form.useForm();

  // 打开配置弹出层
  function handleOpenAppDirConfigurationClick(event) {
    form.setFieldsValue({
      appDir: localStorage.getItem('APP_DIR')
    });
    setVisible(true);
  }

  // 取消
  function handleCloseModalClick(event) {
    setVisible(false);
  }

  // 确认
  async function handleSetAppDirConfigurationClick(event) {
    let formValue = null;

    try {
      formValue = await form.validateFields();
    } catch (err) {
      return console.error(err);
    }

    if (formValue.appDir && !/^\s*$/.test(formValue.appDir)) {
      localStorage.setItem('APP_DIR', formValue.appDir);
    } else {
      localStorage.removeItem('APP_DIR');
    }

    message.success('配置成功！');

    handleCloseModalClick();
  }

  // 清除配置和完全关闭
  function handleResetAppDirClick(event) {
    form.resetFields();
  }

  // 选择jdk文件的位置
  async function handleSelectAppDirClick(event) {
    const result = await remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) return;

    form.setFieldsValue({
      appDir: result.filePaths[0]
    });
  }

  return (
    <Fragment>
      <Button icon={ <IconCodeSandboxOutlined /> } onClick={ handleOpenAppDirConfigurationClick }>配置软件目录</Button>
      <Modal title="配置可执行文件的目录"
        visible={ visible }
        width={ 600 }
        centered={ true }
        afterClose={ handleResetAppDirClick }
        onOk={ handleSetAppDirConfigurationClick }
        onCancel={ handleCloseModalClick }
      >
        <Form className={ jdkPathStyle.form } form={ form }>
          <Form.Item name="appDir" label="可执行文件的目录">
            <Input />
          </Form.Item>
          <div className={ classNames(jdkPathStyle.textRight, jdkPathStyle.marginBottom) }>
            <Button type="primary" danger={ true } onClick={ handleResetAppDirClick }>清除配置</Button>
            <Button className={ jdkPathStyle.marginLeft } onClick={ handleSelectAppDirClick }>选择文件夹</Button>
          </div>
          <Alert type="warning" message={ msg } />
        </Form>
      </Modal>
    </Fragment>
  );
}

export default AppDirPath;