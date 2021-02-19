import { promisify } from 'util';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as glob from 'glob';
import type { IOptions } from 'glob';
import type { Store } from 'vuex';
import { message } from 'ant-design-vue';
import { store } from '../../store/store';
import { getContent, getJavaPath, getMirai } from '../../utils/utils';
import type { MiraiChild, MiraiChildProcess } from '../../types';

const globP: (pattern: string, options?: IOptions) => Promise<Array<string>> = promisify(glob);

// 获取mirai的ChildProcess
export async function getMiraiChildProcess(): Promise<MiraiChildProcess> {
  const { getters, commit }: Store<any> = store;
  const miraiChild: MiraiChildProcess = getters['login/getMiraiChild'];

  if (miraiChild) {
    return miraiChild;
  }

  const content: string = getContent();
  const jar: Array<string> = await globP('**/*.jar', { cwd: content }); // 查找jar包
  let jarEntryName: string = 'net.mamoe.mirai.console.terminal.MiraiConsoleTerminalLoader'; // 入口

  // 如果有mirai-console-pure插件，则修改入口
  for (const item of jar) {
    if (/pure/i.test(item)) {
      jarEntryName = 'net.mamoe.mirai.console.pure.MiraiConsolePureLoader';
      break;
    }
  }

  const child: ChildProcessWithoutNullStreams = spawn(
    getJavaPath(),
    ['-cp', `${ content }/*`, jarEntryName],
    { cwd: getMirai() }
  );
  const event: Event = new Event('miraiChildStdoutEvent');

  child.stdout.on('data', function(data: Buffer): void {
    const text: string = data.toString();

    event['child'] = text;
    document.dispatchEvent(event);
    console.log(text);
  });

  child.stderr.on('data', function(data: Buffer): void {
    console.log(data.toString());
  });

  child.on('close', function(): void {
    commit({
      type: 'login/setMiraiChild',
      payload: undefined
    });
    console.log('mirai已关闭');
    message.error('mirai已关闭');
  });

  const data: MiraiChildProcess = { child, event };

  commit({
    type: 'login/setMiraiChild',
    payload: data
  });

  child.on('error', function(err: Error) {
    console.error(err);
  });

  return data;
}

export function qqLogin(): void {
  //
}