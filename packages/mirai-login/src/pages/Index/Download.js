import { Fragment, useState, useRef } from 'react';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import glob from 'glob';
import { Button, Alert, message } from 'antd';
import { DownloadOutlined as IconDownloadOutlined } from '@ant-design/icons';
import style from './download.sass';
import {
  content,
  miraiVersion,
  githubCoreUrl,
  githubCoreQQAndroidUrl,
  githubConsoleUrl,
  githubConsolePureUrl
} from '../../utils/utils';
import { requestDownloadJar } from './services/download';

const globPromise = promisify(glob);

/* 更新 */
function Download(props) {
  const messageRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);

  // 下载mirai-core
  async function downloadJar(jar, githubJarUrl, fileRegExp, filename) {
    if (jar.includes(filename)) return;

    // 下载新文件
    const file = path.join(content, filename);
    const text = `正在从 ${ githubJarUrl } 下载 ${ filename } `;

    console.log(text);

    await requestDownloadJar(githubJarUrl, file, (progress) => {
      if (messageRef.current) {
        const num = Math.round(progress.percent * 100);

        messageRef.current.innerHTML = `${ text }。已下载${ num > 100 ? 100 : num }%`;
      }
    });

    // 删除旧文件
    for (const item of jar) {
      if (fileRegExp.test(item)) {
        fse.remove(path.join(content, item));
      }
    }
  }

  // 点击下载mirai
  async function handleDownloadMirai(event) {
    setAlertVisible(true);

    let jar = []; // 获取jar文件

    // 如果目录不存在，则创建
    if (!fs.existsSync(content)) {
      await fse.ensureDir(content);
    } else {
      jar = await globPromise('**/*.jar', { cwd: content });
    }

    // 下载文件
    await downloadJar(
      jar,
      githubCoreUrl(),
      /^mirai-core-(?!qqandroid)/i,
      `mirai-core-${ miraiVersion.core }.jar`
    );

    await downloadJar(
      jar,
      githubCoreQQAndroidUrl(),
      /^mirai-core-qqandroid/i,
      `mirai-core-qqandroid-${ miraiVersion['core-qqandroid'] }.jar`
    );

    await downloadJar(
      jar,
      githubConsoleUrl(),
      /^mirai-console-(?!pure)/i,
      `mirai-console-${ miraiVersion.console }.jar`
    );

    await downloadJar(
      jar,
      githubConsolePureUrl(),
      /^mirai-console-pure/i,
      `mirai-console-pure-${ miraiVersion['console-pure'] }.jar`
    );

    setAlertVisible(false);
    message.success('下载完成！');
  }

  return (
    <Fragment>
      <Button icon={ <IconDownloadOutlined /> } onClick={ handleDownloadMirai }>下载mirai</Button>
      {
        alertVisible && (
          <Alert className={ style.alert }
            type="warning"
            message={ <div ref={ messageRef }>正在下载mirai相关jar文件</div> }
          />
        )
      }
    </Fragment>
  );
}

export default Download;