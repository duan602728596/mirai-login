import IndexedDB from 'indexeddb-tools';
import dbConfig from './dbConfig';

/* 初始化数据库 */
function dbInit() {
  // 初始化数据库
  function handleDbUpgradeneeded(event) {
    const objectStore = dbConfig.objectStore;

    for (let i = 0, j = objectStore.length; i < j; i++) {
      const { name, key, data } = objectStore[i];

      if (!this.hasObjectStore(name)) {
        const indexArray = data.map((item, index) => ({
          name: item, index: item
        }));

        this.createObjectStore(name, key, indexArray);
      }
    }
    this.close();
  }

  // 数据库打开成功
  function handleDbOpenSuccess(event) {
    this.close();
  }

  IndexedDB(dbConfig.name, dbConfig.version, {
    upgradeneeded: handleDbUpgradeneeded,
    success: handleDbOpenSuccess
  });
}

export default dbInit;