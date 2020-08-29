import os from 'os';
import path from 'path';
import process from 'process';
import fs from 'fs';
import { remote } from 'electron';

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
  platform === 'darwin' ? 'Contents/Home/bin/java' : 'bin/java.exe'
); // jdk

if (fs.existsSync(java)) {
  console.log(`jdk: ${ java }`);
} else {
  console.warn(`jdk: ${ java } 文件不存在`);
}

// 文件下载地址：https://raw.githubusercontent.com/project-mirai/mirai-repo/master/shadow/mirai-core/mirai-core-1.2.2.jar
const githubUrl = 'https://raw.githubusercontent.com/project-mirai/mirai-repo/master/shadow';

/**
 * 下载文件
 * @param { string } name: 文件名
 * @param { string } filename: 目录名
 */
export function githubDownloadUrl(name, filename) {
  return `${ githubUrl }/${ name }/${ filename }`;
}