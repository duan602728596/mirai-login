import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import type { ParsedPath } from 'path';
import * as fse from 'fs-extra';
import * as glob from 'glob';
import type { IOptions } from 'glob';
import type { Store } from 'vuex';
import { store } from '../../store/store';
import { getContent } from '../../utils/utils';
import { requestMiraiDownloadInfo, requestFileDownload } from './services/download';
import type { MiraiDownloadInfoItem } from './services/interface';
import type { ProgressEventData } from '../../types';

const globP: (pattern: string, options?: IOptions) => Promise<Array<string>> = promisify(glob);

/**
 * 下载jar文件
 * @param { boolean } deleteOldFiles: 下载完毕后是否删除旧的文件
 */
async function download(deleteOldFiles: boolean): Promise<void> {
  const { commit }: Store<any> = store;

  commit({
    type: 'download/setStep',
    payload: 1
  });

  // 获取旧的文件
  const content: string = getContent();
  let jar: string[] = []; // 获取旧的jar文件

  // 如果目录不存在，则创建
  if (!fs.existsSync(content)) {
    await fse.ensureDir(content);
  } else {
    jar = await globP('**/*.jar', { cwd: content });
  }

  // 下载的地址
  const res: Array<MiraiDownloadInfoItem> = process.env.NODE_ENV === 'development'
    ? require('../../../../../mirai.json').download
    : await requestMiraiDownloadInfo();

  for (const item of res) {
    const { base }: ParsedPath = path.parse(item.url);
    const file: string = path.join(content, base);

    await requestFileDownload(item.url, file, function(e: ProgressEventData): void {
      commit({
        type: 'download/setDownloadProgress',
        payload: Object.assign(item, {
          percent: e.percent * 100,
          base
        })
      });
    });
  }

  if (deleteOldFiles && jar.length) {
    for (const item of jar) {
      await fse.remove(item);
    }
  }

  commit({
    type: 'download/setStep',
    payload: 2
  });
}

export default download;