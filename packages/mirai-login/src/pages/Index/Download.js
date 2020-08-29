import { Fragment, useState, useRef } from 'react';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import glob from 'glob';
import cheerio from 'cheerio';
import { Button, Alert, message } from 'antd';
import { DownloadOutlined as IconDownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { orderBy } from 'lodash';
import style from './download.sass';
import { content, githubDownloadUrl } from '../../utils/utils';
import { requestDownloadJar, requestJarList } from './services/download';

const globPromise = promisify(glob);

/* 解析list */
function formatList(html) {
  const $ = cheerio.load(html);
  const $list = $('.Box.mb-3 .js-navigation-item.position-relative');

  const result = [];

  $list.each(function(index, element) {
    const text = $(element).find('a').first().text();
    const timeAgo = $(element).find('time-ago').attr('datetime');

    result.push({
      text,
      time: timeAgo,
      timeNumber: timeAgo ? moment(timeAgo).valueOf() : undefined
    });
  });

  return orderBy(result.filter((o) => o.timeNumber), ['timeNumber'], ['desc']);
}

/* 更新 */
function Download(props) {
  const messageRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);

  // 下载mirai-core
  async function downloadJar(jar, name, fileRegExp) {
    if (messageRef.current) {
      messageRef.current.innerHTML = `获取${ name }的版本信息`;
    }

    const filenameList = await requestJarList(name);
    const filename = formatList(filenameList)?.[0]?.text;

    if (!filename || (filename && jar.includes(filename))) return;

    // 下载新文件
    const githubJarUrl = githubDownloadUrl(name, filename);
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
    await downloadJar(jar, 'mirai-core', /^mirai-core-(?!qqandroid)/i);
    await downloadJar(jar, 'mirai-core-qqandroid', /^mirai-core-qqandroid/i);
    await downloadJar(jar, 'mirai-console', /^mirai-console-(?!pure)/i);
    await downloadJar(jar, 'mirai-console-pure', /^mirai-console-pure/i);

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