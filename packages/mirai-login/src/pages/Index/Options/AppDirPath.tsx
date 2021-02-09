import { remote, OpenDialogReturnValue } from 'electron';
import { Fragment, defineComponent, ref, reactive, Ref, UnwrapRef, RendererElement } from 'vue';
import { Button, Modal, Form, Input, Alert, message } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import classNames from 'classnames';
import optionsStyle from './options.sass';

const msg: string = '根据mac系统的安全策略，从磁盘映像，归档文件或"下载"目录运行新下载的应用程序，无法获取真实路径。所以需要用户手动配置软件路径。';

// 表单类型
interface FormValue {
  appDir?: string;
}

interface SetupReturn {
  visible: Ref<boolean>;
  formValue: UnwrapRef<FormValue>;
  handleOpenAppDirConfigurationClick(event: MouseEvent): void;
  handleCloseModalClick(event: MouseEvent): void;
  handleResetAppDirClick(event: MouseEvent): void;
  handleSelectAppDirClick(event: MouseEvent): Promise<void>;
  handleSetAppDirConfigurationClick(event: MouseEvent): void;
}

function setup(): SetupReturn {
  const visible: Ref<boolean> = ref(false); // 弹出层的显示隐藏
  const formValue: UnwrapRef<FormValue> = reactive({ // 表单的值
    appDir: undefined
  });
  const { resetFields }: any = useForm(formValue, {});

  // 打开配置弹出层
  function handleOpenAppDirConfigurationClick(event: MouseEvent): void {
    formValue.appDir = localStorage.getItem('APP_DIR') ?? undefined;
    visible.value = true;
  }

  // 取消
  function handleCloseModalClick(event: MouseEvent): void {
    visible.value = false;
  }

  // 清除配置和完全关闭
  function handleResetAppDirClick(event: MouseEvent): void {
    resetFields();
  }

  // 选择jdk文件的位置
  async function handleSelectAppDirClick(event: MouseEvent): Promise<void> {
    const result: OpenDialogReturnValue = await remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) return;

    formValue.appDir = result.filePaths[0];
  }

  // 确认jdk文件的位置
  function handleSetAppDirConfigurationClick(event: MouseEvent): void {
    if (formValue.appDir && !/^\s*$/.test(formValue.appDir)) {
      localStorage.setItem('APP_DIR', formValue.appDir);
    } else {
      localStorage.removeItem('APP_DIR');
    }

    message.success('配置成功！');
    visible.value = false;
  }

  return {
    visible,
    formValue,
    handleOpenAppDirConfigurationClick,
    handleCloseModalClick,
    handleResetAppDirClick,
    handleSelectAppDirClick,
    handleSetAppDirConfigurationClick
  };
}

/* 配置软件目录 */
export default defineComponent<{}, SetupReturn>({
  setup,
  render(): RendererElement {
    return (
      <Fragment>
        <Button onClick={ this.handleOpenAppDirConfigurationClick }>配置软件目录</Button>
        <Modal title="配置可执行文件的目录"
          visible={ this.visible }
          width={ 600 }
          centered={ true }
          afterClose={ this.handleResetAppDirClick }
          onOk={ this.handleSetAppDirConfigurationClick }
          onCancel={ this.handleCloseModalClick }
        >
          <Form class={ optionsStyle.form } model={ this.formValue } layout="vertical">
            <Form.Item name="appDir">
              <Input v-model={ [this.formValue.appDir, 'value'] } />
            </Form.Item>
            <div class={ classNames(optionsStyle.textRight, optionsStyle.marginBottom) }>
              <Button type="danger" onClick={ this.handleResetAppDirClick }>清除配置</Button>
              <Button class={ optionsStyle.marginLeft } onClick={ this.handleSelectAppDirClick }>选择文件夹</Button>
            </div>
            <Alert type="warning" message={ msg } />
          </Form>
        </Modal>
      </Fragment>
    );
  }
});