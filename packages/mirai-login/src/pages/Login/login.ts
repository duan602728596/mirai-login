import { promisify } from 'util';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as glob from 'glob';
import type { IOptions } from 'glob';
import type { Store } from 'vuex';
import { message } from 'ant-design-vue';
import { store } from '../../store/store';
import { getContent, getJavaPath, getMirai } from '../../utils/utils';
import type { MiraiChild, MiraiChildProcess } from '../../types';
import type { FormValue } from './types';

const globP: (pattern: string, options?: IOptions) => Promise<Array<string>> = promisify(glob);

// 获取mirai的ChildProcess
export async function getMiraiChildProcess(): Promise<MiraiChildProcess> {
  const { commit }: Store<any> = store;
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

    event['data'] = text;
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

/**
 * 账号登陆
 * @param { FormValue } formValue: 账号信息
 * @param { Function } successCallback: 执行成功后的回调函数
 */
export function qqLogin(formValue: FormValue, successCallback?: Function): Promise<void> {
  return new Promise(async (resolve: Function, reject: Function): Promise<void> => {
    try {
      const { getters }: Store<any> = store;
      const miraiChild: MiraiChild = getters['login/getMiraiChild']();
      const child: MiraiChildProcess = miraiChild ?? await getMiraiChildProcess();
      let isLogin: boolean = miraiChild ? true : false; // 判断是否启动

      const handleStdout: (event: Event) => void = function(event: Event): void {
        const text: string = event['data'];

        if (/Login successful/i.test(text) && text.includes(formValue.username)) {
          // 登陆成功
          successCallback?.();
          document.removeEventListener(child.event.type, handleStdout, false);
          message.success(`[${ formValue.username }] 登陆成功！`);
          resolve();
        } else if (/UseLogin failed/i.test(text)) {
          // 登陆失败
          const error: Array<string> = text.match(/Error\(.*\)/i)!;
          const errText: Array<string> = error[0].replace('Error\(', '')
            .replace(/\)/, '')
            .split(/\s*,\s*/);
          const msg: Array<string> = errText.filter((o: string): boolean => /message/.test(o));

          document.removeEventListener(child.event.type, handleStdout, false);
          message.error(`[${ formValue.username }]${ msg[0] }`);
          resolve();
        } else if (/^\>/.test(text)) {
          // 首次启动时需要监听启动完毕后才能登陆
          if (isLogin === false) {
            isLogin = true;
            child.child.stdin.write(`login ${ formValue.username } ${ formValue.password } \n`);
          }
        }
      };

      document.addEventListener(child.event.type, handleStdout, false);

      // 进程存在时直接写入命令
      if (miraiChild) {
        child.child.stdin.write(`login ${ formValue.username } ${ formValue.password } \n`);
      }
    } catch (err) {
      console.error(err);
      resolve();
      message.error('登陆失败！');
    }
  });
}