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

/* 查询依赖列表 */
export async function requestMiraiDependencies() {
  const res = await got.get('https://raw.githubusercontent.com/duan602728596/mirai-login/master/package.json', {
    responseType: 'json'
  });

  return res.body;
}