/* 数据库配置 */
const dbConfig = {
  name: 'mirai-login',
  version: 1,
  objectStore: [
    // 存储配置
    {
      name: 'login-cache',
      key: 'qqNumber',
      data: ['time', 'value']
    }
  ]
};

export default dbConfig;