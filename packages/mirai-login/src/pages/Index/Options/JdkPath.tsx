import { remote, OpenDialogReturnValue } from 'electron';
import { Fragment, defineComponent, ref, reactive, Ref, UnwrapRef, RendererElement } from 'vue';
import { Button, Modal, Form, Input, message } from 'ant-design-vue';
import { useForm } from '@ant-design-vue/use';
import { RedditOutlined as IconRedditOutlined } from '@ant-design/icons-vue';
import optionsStyle from './options.sass';

// 表单类型
interface FormValue {
  jdkPath?: string;
}

interface SetupReturn {
  visible: Ref<boolean>;
  formValue: UnwrapRef<FormValue>;
  handleOpenJdkConfigurationClick(event: MouseEvent): void;
  handleCloseModalClick(event: MouseEvent): void;
  handleResetJdkPathClick(event: MouseEvent): void;
  handleSelectJdkPathClick(event: MouseEvent): Promise<void>;
  handleSetJdkConfigurationClick(event: MouseEvent): void;
}

/* jdk目录配置 */
function setup(): SetupReturn {
  const visible: Ref<boolean> = ref(false); // 弹出层的显示隐藏
  const formValue: UnwrapRef<FormValue> = reactive({ // 表单的值
    jdkPath: undefined
  });
  const { resetFields }: any = useForm(formValue, {});

  // 打开配置弹出层
  function handleOpenJdkConfigurationClick(event: MouseEvent): void {
    formValue.jdkPath = localStorage.getItem('JAVA_PATH') ?? undefined;
    visible.value = true;
  }

  // 取消
  function handleCloseModalClick(event: MouseEvent): void {
    visible.value = false;
  }

  // 清除配置和完全关闭
  function handleResetJdkPathClick(event: MouseEvent): void {
    resetFields();
  }

  // 选择jdk文件的位置
  async function handleSelectJdkPathClick(event: MouseEvent): Promise<void> {
    const result: OpenDialogReturnValue = await remote.dialog.showOpenDialog({
      properties: ['openFile']
    });

    if (!(result.canceled || !result.filePaths || result.filePaths.length === 0)) {
      formValue.jdkPath = result.filePaths[0];
    }
  }

  // 确认jdk文件的位置
  function handleSetJdkConfigurationClick(event: MouseEvent): void {
    if (formValue.jdkPath && !/^\s*$/.test(formValue.jdkPath)) {
      localStorage.setItem('JAVA_PATH', formValue.jdkPath);
    } else {
      localStorage.removeItem('JAVA_PATH');
    }

    message.success('配置成功！');
    visible.value = false;
  }

  return {
    visible,
    formValue,
    handleOpenJdkConfigurationClick,
    handleCloseModalClick,
    handleResetJdkPathClick,
    handleSelectJdkPathClick,
    handleSetJdkConfigurationClick
  };
}

export default defineComponent<{}, SetupReturn>({
  setup,
  render(): RendererElement {
    return (
      <Fragment>
        <Button icon={ <IconRedditOutlined /> } onClick={ this.handleOpenJdkConfigurationClick }>配置JDK</Button>
        <Modal title="配置JDK"
          visible={ this.visible }
          width={ 600 }
          centered={ true }
          afterClose={ this.handleResetJdkPathClick }
          onOk={ this.handleSetJdkConfigurationClick }
          onCancel={ this.handleCloseModalClick }
        >
          <Form class={ optionsStyle.form } model={ this.formValue } layout="vertical">
            <Form.Item name="jdkPath" label="JDK的地址">
              <Input v-model={ [this.formValue.jdkPath, 'value'] } />
            </Form.Item>
            <div class={ optionsStyle.textRight }>
              <Button type="danger" onClick={ this.handleResetJdkPathClick }>清除配置</Button>
              <Button class={ optionsStyle.marginLeft } onClick={ this.handleSelectJdkPathClick }>选择文件</Button>
            </div>
          </Form>
        </Modal>
      </Fragment>
    );
  }
});