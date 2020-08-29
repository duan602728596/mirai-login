import { spawn } from 'child_process';
import fs from 'fs';
import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { Button, Form, Modal, Input, Checkbox, message } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import style from './useLogin.sass';
import { java, mirai, content } from '../../../utils/utils';
import { setMiraiChild, saveFormData } from '../reducers/reducers';

/* state */
const state = createStructuredSelector({
  miraiChild: createSelector(
    ({ login }) => login.miraiChild,
    (data) => data
  )
});

/* 登陆 */
function UseLogin() {
  const { miraiChild } = useSelector(state);
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
    setLoginLoading(false);
    resetFields();
  }

  // 关闭child进程
  function handleMiraiChildCloseClick(event) {
    miraiChild?.child.kill();
  }

  // 开启child进程
  function createChild() {
    if (!miraiChild) {
      const child = spawn(fs.existsSync(java) ? java : 'java', [
        '-cp',
        `${ content }/*`,
        'net.mamoe.mirai.console.pure.MiraiConsolePureLoader'
      ], { cwd: mirai });
      const event = new Event('miraiChildStdoutEvent');

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
        undefined |> setMiraiChild |> dispatch;
        console.log('mirai已关闭');
        message.error('mirai已关闭');
      });

      child.on('error', function(err) {
        console.err(err);
      });

      const data = { child, event };

      data |> setMiraiChild |> dispatch;

      return data;
    } else {
      return miraiChild;
    }
  }

  // 登陆
  function login(formValue, successCallback) {
    return new Promise((resolve, reject) => {
      try {
        const child = miraiChild ?? createChild();
        let isLogin = miraiChild ? true : false;
        const handleStdout = (event) => {
          const text = event.data;

          if (/Login successful/i.test(text) && text.includes(formValue.username)) {
            // 登陆成功
            successCallback?.();
            resolve();
            document.removeEventListener(child.event.type, handleStdout, false);
            message.success('登陆成功！');
          } else if (/UseLogin failed/i.test(text)) {
            // 登陆失败
            const error = text.match(/Error\(.*\)/i);
            const errText = error[0].replace('Error\(', '')
              .replace(/\)/, '')
              .split(/\s*,\s*/);
            const msg = errText.filter((o) => /message/.test(o));

            resolve();
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
        if (miraiChild) {
          child.child.stdin.write(`login ${ formValue.username } ${ formValue.password } \n`);
        }
      } catch (err) {
        console.error(err);
        resolve();
        message.error('登陆失败！');
      }
    });
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
      // 记住密码
      if (formValue.rememberPwd) {
        ({
          data: {
            qqNumber: formValue.username,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            value: { password: formValue.password }
          }
        }) |> saveFormData |> dispatch;
      }

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
          <div className={ classNames(style.statusText, miraiChild ? style.successStatus : style.faildStatus) }>
            { miraiChild ? 'mirai已启动' : 'mirai未启动' }
            <Button className={ style.killChildBtn }
              type="primary"
              size="small"
              danger={ true }
              disabled={ miraiChild ? undefined : true }
              onClick={ handleMiraiChildCloseClick }
            >
              关闭mirai进程
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
                <Checkbox>允许快速登陆</Checkbox>
              </Form.Item>
            </Form>
          </Modal>
        </Fragment>
      )
    )
  };
}

export default UseLogin;