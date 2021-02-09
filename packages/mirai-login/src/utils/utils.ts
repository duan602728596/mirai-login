import * as os from 'os';
import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs';
import { remote } from 'electron';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';
const platform: NodeJS.Platform = os.platform(); // 获取操作系统

/* 获取可执行文件的路径 */
export function getApp(): string {
  if (isDevelopment) {
    return path.join(process.cwd(), '../..');
  }

  // TODO: 由于mac系统的安全限制，electron无法获取可执行文件的位置，所以需要人工配置
  if (platform === 'darwin') {
    const APP_DIR: string | null = localStorage.getItem('APP_DIR');

    if (APP_DIR) return APP_DIR;
  }

  const exePath: string = remote.app.getPath('exe'); // 获取可执行文件的路径
  let dir: string = path.dirname(exePath);                  // 获取目录

  // TODO: mac系统需要获取'*.app'文件的位置
  if (platform === 'darwin') {
    const dirArr: string[] = dir.split(/\//).filter((o: string) => o !== '');
    const newDir: string[] = [];

    for (const item of dirArr) {
      if (/\.app$/i.test(item)) {
        break;
      } else {
        newDir.push(item);
      }
    }

    dir = `/${ newDir.join('/') }`;
  }

  return dir;
}

/* 获取mirai的文件夹路径 */
export function getMirai(): string {
  return path.join(getApp(), 'mirai');
}

/* 获取jdk的路径 */
export function getContent(): string {
  return path.join(getMirai(), 'content');
}

/* 获取java的文件地址 */
export function getJava(): string {
  return path.join(
    getApp(),
    `jdk-${ platform }`,
    platform === 'darwin' ? 'Contents/Home/bin/java' : 'bin/java.exe'
  );
}

/* 获取java的可执行文件的地址 */
export function getJavaPath(): string {
  const javaPath: string | null = localStorage.getItem('JAVA_PATH'); // 本机配置

  if (javaPath) return javaPath;

  const java: string = getJava();

  if (fs.existsSync(java)) return java;

  return 'java';
}

// 文件下载地址：https://dl.bintray.com/him188moe/mirai/net/mamoe/mirai-console/1.1.0/mirai-console-1.1.0.jar
const bintrayUrl: string = 'https://dl.bintray.com/him188moe/mirai/net/mamoe/';

/**
 * 下载文件
 * @param { string } name: 文件名
 * @param { string } version: 版本号
 * @param { string } filename: 目录名
 */
export function bintrayDownloadUrl(name: string, version: string, filename: string): string {
  return `${ bintrayUrl }/${ name }/${ version }/${ filename }`;
}