import { promisify } from 'util';
import { pipeline } from 'stream';
import * as fs from 'fs';
import type { WriteStream } from 'fs';
import got, { Response as GotResponse } from 'got';
import type { ProgressEventData } from '../../../types';
import type { MiraiDownloadInfo, MiraiDownloadInfoItem } from './interface';

const pipelineP: (stream1: NodeJS.ReadableStream, stream2: WriteStream) => Promise<void> = promisify(pipeline);

// 获取mirai的下载地址
export async function requestMiraiDownloadInfo(): Promise<Array<MiraiDownloadInfoItem>> {
  const uri: string = 'https://raw.githubusercontent.com/duan602728596/mirai-login/next/mirai.json';
  const res: GotResponse<MiraiDownloadInfo> = await got.get(uri, {
    responseType: 'json'
  });

  return res.body.download;
}

/**
 * 下载文件
 * @param { string } uri: 文件地址
 * @param { string } file: 文件位置
 * @param { (e: ProgressEventData) => void } onProgress: 下载进度
 */
export async function requestFileDownload(uri: string, file: string, onProgress: (e: ProgressEventData) => void): Promise<void> {
  return await pipelineP(
    got.stream(uri).on('downloadProgress', onProgress),
    fs.createWriteStream(file)
  );
}