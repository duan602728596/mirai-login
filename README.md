# mirai-login

一个 [mirai](https://github.com/mamoe/mirai) 的带gui的登陆器。使用Electron开发。

## 开始使用

* 安装jar包

  * 第一次运行时，请点击`下载mirai`，下载mirai的jar包，或者自行下载jar包，放到程序目录下的`<mirai_path>/mirai/content下`。（手动点击下载，避免由于墙的原因下载失败。也可以下载完拷贝到目录）

  * 以后点击`下载mirai`，会自动获取最新版本并下载。
  
* 软件可以配置jdk文件的路径（java）；可以拷贝jdk文件到软件内，然后自动寻找jdk文件的路径；或者直接使用系统环境变量配置的jdk。

* 当你使用苹果系统时，需要配置软件目录，保证能够正常安装和运行软件。这是由于苹果系统的安全性的性质导致的（[参考](https://discuss.as3lang.org/t/nativepath-points-to-private-var-folders-on-osx-after-download-instead-of-users-username-why/1679)）。

* 登陆时选择**记住密码**，可以保存账号信息并可以快速登陆。

## jdk

下载jdk文件并放在目录下，mac环境下的目录是`<mirai_path>/jdk-darwin`，window环境下的目录是`<mirai_path>/jdk-win32`。

## 如何编译

1. 编译@mirai-login/mirai-login、@mirai-login/main项目
2. 运行scripts文件夹内的脚本打包软件
