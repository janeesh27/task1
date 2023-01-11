import Dexie from 'dexie';

export const db = new Dexie('usersDatabase');
db.version(1).stores({
  users: '++id, name, profile_pic',
});