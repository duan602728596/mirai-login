import { remote } from 'electron';
import { Fragment, useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { RedditOutlined as IconRedditOutlined } from '@ant-design/icons';
import style from './jdkPath.sass';

/* jdk的配置 */
function JdkPath(props) {
  const [visible, setVisible] = useState(false); // 弹出层
  const [form] = Form.useForm();

  // 打开配置弹出层
  function handleOpenJdkConfigurationClick(event) {
    form.setFieldsValue({
      jdkPath: localStorage.getItem('JAVA_PATH')
    });
    setVisible(true);
  }

  // 取消
  function handleCloseModalClick(event) {
    setVisible(false);
  }

  // 确认
  async function handleSetJdkConfigurationClick(event) {
    let formValue = null;

    try {
      formValue = await form.validateFields();
    } catch (err) {
      return console.error(err);
    }

    if (formValue.jdkPath && !/^\s*$/.test(formValue.jdkPath)) {
      localStorage.setItem('JAVA_PATH', formValue.jdkPath);
    } else {
      localStorage.removeItem('JAVA_PATH');
    }

    message.success('配置成功！');

    handleCloseModalClick();
  }

  // 清除配置和完全关闭
  function handleResetJdkPathClick(event) {
    form.resetFields();
  }

  // 选择jdk文件的位置
  async function handleSelectJdkPathClick(event) {
    const result = await remote.dialog.showOpenDialog({
      properties: ['openFile']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) return;

    form.setFieldsValue({
      jdkPath: result.filePaths[0]
    });
  }

  return (
    <Fragment>
      <Button icon={ <IconRedditOutlined /> } onClick={ handleOpenJdkConfigurationClick }>配置JDK</Button>
      <Modal title="配置JDK"
        visible={ visible }
        width={ 600 }
        centered={ true }
        afterClose={ handleResetJdkPathClick }
        onOk={ handleSetJdkConfigurationClick }
        onCancel={ handleCloseModalClick }
      >
        <Form className={ style.form } form={ form }>
          <Form.Item name="jdkPath" label="JDK的地址">
            <Input />
          </Form.Item>
          <div className={ style.textRight }>
            <Button type="primary" danger={ true } onClick={ handleResetJdkPathClick }>清除配置</Button>
            <Button className={ style.marginLeft } onClick={ handleSelectJdkPathClick }>选择文件</Button>
          </div>
        </Form>
      </Modal>
    </Fragment>
  );
}

export default JdkPath;