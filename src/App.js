import React, { useState, useEffect } from 'react';

import Dexie from 'dexie';
import axios from 'axios';
import Hero from './components/Hero';

const db = new Dexie('usersDatabase');
db.version(1).stores({ users: '++id,name,email                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ' });

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function setUsers() {
      try {
        setLoading(true);
        const response = await axios.get('https://randomuser.me/api/?results=50');
        const data = response.data.results;
        setUsers(data);
        db.users.bulkAdd(data);
        setTotal(data.length);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    setUsers();
  }, []);

  async function handleDelete(id) {
    await db.users.delete(id);
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setTotal(updatedUsers.length);
  }

  async function handleRefresh() {
    setLoading(true);
    await db.users.clear();
    await setUsers();
    setLoading(false);
  }

  return (
    <div className="App">
     <Hero />

    </div>
  
  );
}

export default App;
