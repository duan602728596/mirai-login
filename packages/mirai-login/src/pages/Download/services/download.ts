import got, { Response as GotResponse } from 'got';
import type { MiraiDownloadInfo, MiraiDownloadInfoItem } from './interface';

// 获取mirai的下载地址
export async function requestMiraiDownloadInfo(): Promise<Array<MiraiDownloadInfoItem>> {
  const uri: string = 'https://raw.githubusercontent.com/duan602728596/mirai-login/next/mirai.json';
  const res: GotResponse<MiraiDownloadInfo> = await got.get(uri, {
    responseType: 'json'
  });

  return res.body.download;
}