import { Card, Button, CircularProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Dexie from "dexie";
import axios from "axios";

const db = new Dexie("usersDatabase");
db.version(1).stores({ users: "++id,name,email" });

function Hero() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function setUsers() {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://randomuser.me/api/?results=50"
        );
        const data = response.data.results;
        setUsers(data);
        db.use.bulkAdd(data);
        setTotal(data.length);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    setUsers();
  }, []);

  async function handleDelete(id) {
    await db.use.delete(id);
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setTotal(updatedUsers.length);
  }

  async function handleRefresh() {
    setLoading(true);
    await db.use.clear();
    setUsers();
    setLoading(false);
  }


return (
  <div>
    {loading ? (
      <CircularProgress />
    ) : (
      <>
        <Button onClick={handleRefresh}>Refresh</Button>
        <p>Total: {total}</p>
        <div>
          {users.map((user) => (
            <Card key={user.id}>
              <img src={user.picture.large} alt={user.name.first} />
              <p>{`${user.name.first} ${user.name.last}`}</p>
              <Button onClick={() => handleDelete(user.id)}>Delete</Button>
            </Card>
          ))}
        </div>
      </>
    )}
  </div>
);}

export default Hero;
