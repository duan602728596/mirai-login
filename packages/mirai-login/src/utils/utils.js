import os from 'os';
import path from 'path';
import process from 'process';
import fs from 'fs';
import { remote } from 'electron';

const isDev = process.env.NODE_ENV === 'development';
const platform = os.platform(); // 获取操作系统

/* 获取可执行文件的路径 */
export function getApp() {
  if (isDev) {
    return path.join(process.cwd(), '../..');
  }

  // TODO: 由于mac系统的安全限制，electron无法获取可执行文件的位置，所以需要人工配置
  if (platform === 'darwin') {
    const APP_DIR = localStorage.getItem('APP_DIR');

    if (APP_DIR) return APP_DIR;
  }

  const exePath = remote.app.getPath('exe'); // 获取可执行文件的路径
  let dir = path.dirname(exePath);                  // 获取目录

  // TODO: mac系统需要获取'*.app'文件的位置
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

    dir = `/${ newDir.join('/') }`;
  }

  return dir;
}

/* 获取mirai的文件夹路径 */
export function getMirai() {
  return path.join(getApp(), 'mirai');
}

/* 获取jdk的路径 */
export function getContent() {
  return path.join(getMirai(), 'content');
}

/* 获取java的文件地址 */
export function getJava() {
  return path.join(
    getApp(),
    `jdk-${ platform }`,
    platform === 'darwin' ? 'Contents/Home/bin/java' : 'bin/java.exe'
  );
}

/* 获取java的可执行文件的地址 */
export function getJavaPath() {
  const javaPath = localStorage.getItem('JAVA_PATH'); // 本机配置

  if (javaPath) return javaPath;

  const java = getJava();

  if (fs.existsSync(java)) return java;

  return 'java';
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