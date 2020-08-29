import { spawn } from 'child_process';
import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { Button, Form, Modal, Input, Checkbox, message } from 'antd';
import classNames from 'classnames';
import style from './useLogin.sass';
import { java, mirai, content } from '../../../utils/utils';
import { setMiriaChild } from '../reducers/reducers';

/* state */
const state = createStructuredSelector({
  miriaChild: createSelector(
    ({ login }) => login.miriaChild,
    (data) => data
  )
});

/* 登陆 */
function UseLogin() {
  const { miriaChild } = useSelector(state);
  const dispatch = useDispatch();
  const [loginVisible, setLoginVisible] = useState(false); // 登陆
  const [loginLoading, setLoginLoading] = useState(false); // loading状态
  const [form] = Form.useForm();
  const { validateFields, resetFields } = form;

  // 打开登陆弹窗
  function handleLoginOpenClick(event) {
    setLoginVisible(true);
  }

  // 关闭登陆弹窗
  function handleLoginCloseClick(event) {
    setLoginVisible(false);
    resetFields();
  }

  // 关闭child进程
  function handleMiriaChildCloseClick(event) {
    miriaChild?.child.kill();
  }

  // 开启child进程
  function createChild() {
    if (!miriaChild) {
      const child = spawn(java, [
        '-cp',
        `${ content }/*`,
        'net.mamoe.mirai.console.pure.MiraiConsolePureLoader'
      ], { cwd: mirai });
      const event = new Event('miriaChildStdoutEvent');

      child.stdout.on('data', function(data) {
        const text = data.toString();

        event.data = text;
        document.dispatchEvent(event);
        console.log(text);
      });

      child.stderr.on('data', function(data) {
        console.log(data.toString());
      });

      child.on('close', function() {
        undefined |> setMiriaChild |> dispatch;
        console.log('miria已关闭');
        message.error('miria已关闭');
      });

      child.on('error', function(err) {
        console.err(err);
      });

      const data = { child, event };

      data |> setMiriaChild |> dispatch;

      return data;
    } else {
      return miriaChild;
    }
  }

  // 登陆
  function login(formValue, successCallback) {
    try {
      const child = miriaChild ?? createChild();
      let isLogin = miriaChild ? true : false;
      const handleStdout = (event) => {
        const text = event.data;

        if (/Login successful/i.test(text) && text.includes(formValue.username)) {
          // 登陆成功
          successCallback();
          document.removeEventListener(child.event.type, handleStdout, false);
          message.success('登陆成功！');
        } else if (/UseLogin failed/i.test(text)) {
          // 登陆失败
          const error = text.match(/Error\(.*\)/i);
          const errText = error[0].replace('Error\(', '')
            .replace(/\)/, '')
            .split(/\s*,\s*/);
          const msg = errText.filter((o) => /message/.test(o));

          document.removeEventListener(child.event.type, handleStdout, false);
          message.error(msg[0]);
        } else if (/^\>/.test(text)) {
          // 首次启动时需要监听启动完毕后才能登陆
          if (isLogin === false) {
            isLogin = true;
            child.child.stdin.write(`login ${ formValue.username } ${ formValue.password } \n`);
          }
        }
      };

      document.addEventListener(child.event.type, handleStdout, false);

      // 进程存在时直接写入命令
      if (miriaChild) {
        child.child.stdin.write(`login ${ formValue.username } ${ formValue.password } \n`);
      }
    } catch (err) {
      console.error(err);
      message.error('登陆失败！');
    }
  }

  // 登陆
  async function handleLoginClick(event) {
    let formValue = null;

    try {
      formValue = await validateFields();
    } catch (err) {
      console.error(err);
    }

    setLoginLoading(true);
    await login(formValue, function() {
      handleLoginCloseClick();
    });
    setLoginLoading(false);
  }

  return {
    login,
    element: (
      (
        <Fragment>
          <Button type="primary" onClick={ handleLoginOpenClick }>登陆</Button>
          <div className={ classNames(style.statusText, miriaChild ? style.successStatus : style.faildStatus) }>
            { miriaChild ? 'miria已启动' : 'miria未启动' }
            <Button className={ style.killChildBtn }
              type="primary"
              size="small"
              danger={ true }
              disabled={ miriaChild ? undefined : true }
              onClick={ handleMiriaChildCloseClick }
            >
              关闭miria进程
            </Button>
          </div>
          <Modal visible={ loginVisible }
            title="账号登陆"
            destroyOnClose={ true }
            centered={ true }
            maskClosable={ false }
            okText="登陆"
            confirmLoading={ loginLoading }
            onOk={ handleLoginClick }
            onCancel={ handleLoginCloseClick }
          >
            <Form className={ style.form } form={ form } labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Form.Item name="username" label="用户名" rules={ [{ required: true, message: '请输入用户名', whitespace: true }] }>
                <Input />
              </Form.Item>
              <Form.Item name="password" label="密码" rules={ [{ required: true, message: '请输入密码' }] }>
                <Input.Password />
              </Form.Item>
              <Form.Item name="rememberPwd" label="记住密码" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Form>
          </Modal>
        </Fragment>
      )
    )
  };
}

export default UseLogin;