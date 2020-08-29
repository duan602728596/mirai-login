import IndexedDBRedux from 'indexeddb-tools-redux';
import dbConfig from './dbConfig';

/* indexeddb redux */
const db = new IndexedDBRedux(dbConfig.name, dbConfig.version);

export const objectStoreName = dbConfig.objectStore[0].name;
export default db;