import { Fragment, defineComponent, ref, computed, Ref, ComputedRef, RendererElement } from 'vue';
import { useStore, Store } from 'vuex';
import { Button, Divider, Modal, Alert, Progress } from 'ant-design-vue';
import { CloudDownloadOutlined as IconCloudDownloadOutlined } from '@ant-design/icons-vue';
import style from './index.sass';
import downloadFiles from './downloadFiles';
import Content from '../../components/Content/Content';
import type { StepStatus, DownloadProgressItem } from './types';

interface SetupReturn {
  step: ComputedRef<StepStatus>;
  downloadProgress: ComputedRef<DownloadProgressItem>;
  visible: Ref<boolean>;
  handleDownloadOpenModalClick(event: MouseEvent): void;
  handleDownloadCloseModalClick(event: MouseEvent): void;
  handleDownloadJarFilesClick(deleteOldFiles: boolean, event: MouseEvent): void;
  downloadProgressRender(downloadProgress: Array<DownloadProgressItem>): RendererElement;
}

/* 下载mirai文件 */
function setup(): SetupReturn {
  const store: Store<any> = useStore();
  const visible: Ref<boolean> = ref(false); // 弹出层

  // 打开弹出层
  function handleDownloadOpenModalClick(event: MouseEvent): void {
    visible.value = true;
  }

  // 取消下载
  function handleDownloadCloseModalClick(event: MouseEvent): void {
    visible.value = false;
  }

  // 下载jar文件
  function handleDownloadJarFilesClick(deleteOldFiles: boolean, event: MouseEvent): void {
    visible.value = false;
    downloadFiles(deleteOldFiles);
  }

  // 渲染进度
  function downloadProgressRender(downloadProgress: Array<DownloadProgressItem> = []): RendererElement {
    return downloadProgress.map((item: DownloadProgressItem, index: number): RendererElement => {
      return (
        <li key={ item.name }>
          <div class={ style.marginBottom8 }>
            正在从<a>{ item.url }</a>
            下载<b>{ item.base }</b>
          </div>
          <Progress percent={ Number(parseInt(`${ item.percent }`)) }
            status={ item.percent >= 100 ? 'success' : 'active' }
          />
        </li>
      );
    });
  }

  return {
    step: computed(store.getters['download/getStep']),
    downloadProgress: computed(store.getters['download/getDownloadProgress']),
    visible,
    handleDownloadOpenModalClick,
    handleDownloadCloseModalClick,
    handleDownloadJarFilesClick,
    downloadProgressRender
  };
}

export default defineComponent({
  setup,
  render(): RendererElement {
    const step1: boolean = this.step === 1;

    return (
      <Fragment>
        <Content>
          <div>
            <router-link to="/">
              <Button type="danger">返回</Button>
            </router-link>
          </div>
          <Divider />
          <Button type="primary"
            loading={ step1 }
            icon={ <IconCloudDownloadOutlined /> }
            onClick={ this.handleDownloadOpenModalClick }
          >
            下载mirai
          </Button>
          <div class={ style.paddingTop }>
            { step1 ? <Alert class={ style.marginBottom } type="info" message="正在下载mirai相关文件。" /> : null }
            { this.step === 2 ? <Alert class={ style.marginBottom } type="success" message="mirai相关文件下载完毕。" /> : null }
            <ul class={ style.downloadList }>{ this.downloadProgressRender(this.downloadProgress) }</ul>
          </div>
        </Content>
        <Modal title="下载mirai"
          visible={ this.visible }
          width={ 450 }
          centered={ true }
          closable={ false }
          footer={
            <Fragment>
              <Button onClick={ this.handleDownloadCloseModalClick }>取消下载</Button>
              <Button type="primary"
                onClick={ (event: MouseEvent): void => this.handleDownloadJarFilesClick(false, event) }
              >
                保留
              </Button>
              <Button type="danger"
                onClick={ (event: MouseEvent): void => this.handleDownloadJarFilesClick(true, event) }
              >
                删除
              </Button>
            </Fragment>
          }
        >
          <p>下载完毕后是否删除旧的相关文件？</p>
        </Modal>
      </Fragment>
    );
  }
});