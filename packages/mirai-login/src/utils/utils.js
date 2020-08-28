import os from 'os';
import path from 'path';
import process from 'process';
import { remote } from 'electron';
import { mirai as _miraiVersion } from '../../package.json';

export const miraiVersion = _miraiVersion;

const isDev = process.env.NODE_ENV === 'development';
const exePath = remote.app.getPath('exe'); // 获取可执行文件的路径
const dir = path.dirname(exePath);               // 获取目录
const platform = os.platform();                  // 获取操作系统

let _app = '';

if (isDev) {
  // 开发环境
  _app = path.join(process.cwd(), '../..');
} else {
  // 生产环境
  _app = dir;

  if (platform === 'darwin') {
    const dirArr = dir.split(/\//).filter((o) => o !== '');
    const newDir = [];

    for (const item of dirArr) {
      if (/\.app$/i.test(item)) {
        break;
      } else {
        newDir.push(item);
      }
    }

    _app = `/${ newDir.join('/') }`;
  }
}

export const app = _app;                       // 可执行文件的路径
export const mirai = path.join(_app, 'mirai'); // mirai
export const content = path.join(mirai, 'content'); // mirai
export const java = path.join(
  _app,
  `jdk-${ platform }`,
  platform === 'darwin' ? 'Contents/Home/bin' : 'bin',
  'java'
); // jdk

// 文件下载地址：https://github.com/project-mirai/mirai-repo/blob/master/shadow/mirai-core/mirai-core-1.2.2.jar
const githubUrl = 'https://github.com/project-mirai/mirai-repo/blob/master/shadow/';

export const githubCoreUrl = (v) => `${ githubUrl }/mirai-core/mirai-core-${ v ?? miraiVersion.core }.jar`;
export const githubCoreQQAndroidUrl
  = (v) => `${ githubUrl }/mirai-core-qqandroid/mirai-core-qqandroid-${ v ?? miraiVersion['core-qqandroid'] }.jar`;
export const githubConsoleUrl = (v) => `${ githubUrl }/mirai-console/mirai-console-${ v ?? miraiVersion.console }.jar`;
export const githubConsolePureUrl
  = (v) => `${ githubUrl }/mirai-console-pure/mirai-console-pure-${ v ?? miraiVersion['console-pure'] }.jar`;