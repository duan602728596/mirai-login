import { pipeline } from 'stream';
import { promisify } from 'util';
import fs from 'fs';
import got from 'got';

const pipelinePromise = promisify(pipeline);

/**
 * 下载jar包
 * @param { string } jarUrl: jar包地址
 * @param { string } file: 文件地址
 * @param { Function } procressFunc: 进度函数
 */
export async function requestDownloadJar(jarUrl, file, procressFunc) {
  return await pipelinePromise(
    got.stream(jarUrl).on('downloadProgress', procressFunc),
    fs.createWriteStream(file)
  );
}