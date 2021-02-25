import { Fragment, defineComponent, ref, reactive, Ref, UnwrapRef, RendererElement } from 'vue';
import { Button, Modal, Form, Input, Checkbox } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import style from './index.sass';
import Content from '../../components/Content/Content';
import type { FormValue } from './types';

interface SetupReturn {
  visible: Ref<boolean>;
  formValue: UnwrapRef<FormValue>;
  formRules: UnwrapRef<object>;
  handleOpenLoginModalClick(event: MouseEvent): void;
  handleCloseLoginModalClick(event: MouseEvent): void;
  afterClose(): void;
}

/* 账号登陆 */
function setup(): SetupReturn {
  const visible: Ref<boolean> = ref(false); // 弹出层的显示隐藏
  const formValue: UnwrapRef<FormValue> = reactive({}); // 表单的值

  // 表单验证
  const formRules: UnwrapRef<object> = reactive({
    username: [{ required: true, whitespace: true, message: '必须填写用户名' }],
    password: [{ required: true, whitespace: true, message: '必须填写密码' }]
  });
  const { resetFields }: any = useForm(formValue, formRules);

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

  return {
    visible,
    formValue,
    formRules,
    handleOpenLoginModalClick,
    handleCloseLoginModalClick,
    afterClose
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
          </header>
        </Content>
        <Modal visible={ this.visible }
          title="账号登陆"
          width={ 500 }
          destroyOnClose={ true }
          centered={ true }
          maskClosable={ false }
          afterClose={ this.afterClose }
          onCancel={ this.handleCloseLoginModalClick }
        >
          <Form model={ this.formValue } rules={ this.formRules } labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item name="username" label="用户名">
              <Input v-model={ [this.formValue.username, 'value'] } />
            </Form.Item>
            <Form.Item name="password" label="密码">
              <Input v-model={ [this.formValue.password, 'value'] } />
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