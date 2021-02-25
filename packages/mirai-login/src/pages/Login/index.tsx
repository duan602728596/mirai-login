import { Fragment, defineComponent, ref, reactive, toRaw, computed, Ref, UnwrapRef, ComputedRef, RendererElement } from 'vue';
import { useStore, Store } from 'vuex';
import { Button, Modal, Form, Input, Checkbox, message } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import * as dayjs from 'dayjs';
import IndexedDB from 'indexeddb-tools';
import style from './index.sass';
import Content from '../../components/Content/Content';
import { qqLogin } from './login';
import dbConfig from '../../utils/dbInit/dbConfig';
import type { MiraiChild } from '../../types';
import type { FormValue, LoginInfo } from './types';

interface SetupReturn {
  visible: Ref<boolean>;
  formValue: UnwrapRef<FormValue>;
  formRules: UnwrapRef<object>;
  miraiChild: ComputedRef<MiraiChild>;
  handleOpenLoginModalClick(event: MouseEvent): void;
  handleCloseLoginModalClick(event: MouseEvent): void;
  afterClose(): void;
  handleLoginSubmitClick(event: MouseEvent): Promise<void>;
  handleKillChildClick(event: MouseEvent): void;
}

/* 账号登陆 */
function setup(): SetupReturn {
  const store: Store<any> = useStore();
  const visible: Ref<boolean> = ref(false); // 弹出层的显示隐藏
  const formValue: UnwrapRef<FormValue> = reactive({
    username: '',
    password: ''
  }); // 表单的值

  // 表单验证
  const formRules: UnwrapRef<object> = reactive({
    username: [{ required: true, whitespace: true, message: '必须填写用户名' }],
    password: [{ required: true, whitespace: true, message: '必须填写密码' }]
  });
  const { resetFields, validate }: any = useForm(formValue, formRules);

  // 打开登陆窗口
  function handleOpenLoginModalClick(event: MouseEvent): void {
    visible.value = true;
  }

  // 关闭登陆窗口
  function handleCloseLoginModalClick(event: MouseEvent): void {
    visible.value = false;
  }

  // 清除配置和完全关闭
  function afterClose(): void {
    resetFields();
  }

  // 登陆
  async function handleLoginSubmitClick(event: MouseEvent): Promise<void> {
    try {
      await validate();

      const formValueRaw: FormValue = toRaw(formValue);

      await qqLogin(formValueRaw, function(): void {
        // 添加到数据库
        function handleDbOpenSuccess(event: IDBVersionChangeEvent): void {
          const store: any = this.getObjectStore(dbConfig.objectStore[0].name, true);
          const data: LoginInfo = {
            qqNumber: formValue.username,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            value: { password: formValue.password }
          };

          store.put({
            data: {
              qqNumber: formValue.username,
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              value: { password: formValue.password }
            }
          });
          store.commit({
            type: 'login/setAddLoginInfoList',
            payload: data
          });
        }

        if (formValueRaw.rememberPwd) {
          IndexedDB(dbConfig.name, dbConfig.version, {
            success: handleDbOpenSuccess
          });
        }
      });
    } catch (err) {
      console.error(err);
      message.error(err.errorFields[0].errors[0]);
    }
  }

  // 关闭进程
  function handleKillChildClick(event: MouseEvent): void {
    const miraiChild: MiraiChild = store.getters['login/getMiraiChild']();

    miraiChild?.child.kill();
  }

  return {
    visible,
    formValue,
    formRules,
    miraiChild: computed(store.getters['login/getMiraiChild']),
    handleOpenLoginModalClick,
    handleCloseLoginModalClick,
    afterClose,
    handleLoginSubmitClick,
    handleKillChildClick
  };
}

export default defineComponent<{}, SetupReturn>({
  setup,
  render(): RendererElement {
    return (
      <Fragment>
        <Content>
          <header>
            <router-link to="/">
              <Button type="danger">返回</Button>
            </router-link>
            <Button.Group class={ style.marginLeft }>
              <Button type="primary" onClick={ this.handleOpenLoginModalClick }>账号登陆</Button>
            </Button.Group>
            {
              this.miraiChild
                ? <Button type="danger" onClick={ this.handleKillChildClick }>关闭进程</Button>
                : <Button>一键登陆</Button>
            }
          </header>
        </Content>
        <Modal visible={ this.visible }
          title="账号登陆"
          width={ 500 }
          destroyOnClose={ true }
          centered={ true }
          maskClosable={ false }
          afterClose={ this.afterClose }
          onOk={ this.handleLoginSubmitClick }
          onCancel={ this.handleCloseLoginModalClick }
        >
          <Form model={ this.formValue } rules={ this.formRules } labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item name="username" label="用户名">
              <Input v-model={ [this.formValue.username, 'value'] } />
            </Form.Item>
            <Form.Item name="password" label="密码">
              <Input.Password v-model={ [this.formValue.password, 'value'] } />
            </Form.Item>
            <Form.Item name="rememberPwd" label="记住密码">
              <Checkbox v-model={ [this.formValue.rememberPwd, 'checked'] } />
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
});