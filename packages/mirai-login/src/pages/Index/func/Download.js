import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import glob from 'glob';
import { Fragment, useState, useRef } from 'react';
import { Button, Alert, message } from 'antd';
import { DownloadOutlined as IconDownloadOutlined } from '@ant-design/icons';
import style from './download.sass';
import { content, githubDownloadUrl } from '../../../utils/utils';
import { requestDownloadJar, requestMiraiDependencies } from '../services/download';

const globPromise = promisify(glob);

/* 更新 */
function Download(props) {
  const messageRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);

  // 下载mirai-core
  async function downloadJar(jar, miraiDependencies, name, fileRegExp) {
    const filename = `${ name }-${ miraiDependencies[name] }.jar`; // 文件名

    if (jar.includes(filename)) return; // 文件存在，不需要重新下载

    // 下载新文件
    const githubJarUrl = githubDownloadUrl(name, filename);
    const file = path.join(content, filename);
    const text = `正在从 ${ githubJarUrl } 下载 ${ filename } `;

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

    if (messageRef.current) {
      messageRef.current.innerHTML = '获取版本信息';
    }

    const { miraiDependencies } = await requestMiraiDependencies(); // 获取依赖信息

    // 下载文件
    await downloadJar(jar, miraiDependencies, 'mirai-core-qqandroid', /^mirai-core-qqandroid/i);
    await downloadJar(jar, miraiDependencies, 'mirai-console', /^mirai-console-(?!pure)/i);
    await downloadJar(jar, miraiDependencies, 'mirai-console-terminal', /^mirai-console-terminal/i);

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