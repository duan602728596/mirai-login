import {
  Fragment,
  defineComponent,
  ref,
  reactive,
  Ref,
  UnwrapRef,
  RendererElement
} from 'vue';
import { Button, Modal, Form, Input } from 'ant-design-vue';

// 表单类型
interface FormValue {
  appDir?: string;
}

interface SetupReturn {
  visible: Ref<boolean>;
  formValue: UnwrapRef<FormValue>;
  handleOpenAppDirConfigurationClick(event: MouseEvent): void;
}

function setup(): SetupReturn {
  const visible: Ref<boolean> = ref(false); // 弹出层的显示隐藏
  const formValue: UnwrapRef<FormValue> = reactive({ // 表单的值
    appDir: undefined
  });

  // 打开配置弹出层
  function handleOpenAppDirConfigurationClick(event: MouseEvent): void {
    formValue.appDir = localStorage.getItem('APP_DIR') ?? undefined;
    visible.value = true;
  }

  return {
    visible,
    formValue,
    handleOpenAppDirConfigurationClick
  };
}

/* 配置软件目录 */
export default defineComponent({
  setup,
  render(): RendererElement {
    return (
      <Fragment>
        <Button onClick={ this.handleOpenAppDirConfigurationClick }>配置软件目录</Button>
        <Modal title="配置可执行文件的目录" visible={ this.visible } width={ 600 } centered={ true }>
          <Form model={ this.formValue }>
            <Input v-model={ [this.formValue.appDir, 'value'] } />
          </Form>
        </Modal>
      </Fragment>
    );
  }
});