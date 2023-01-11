import Dexie from 'dexie';

export const db = new Dexie('usersDatabase');
db.version(1).stores({
  friends: '++id, name, email',
});