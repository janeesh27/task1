import { Card, Button, CircularProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Dexie from "dexie";


const db = new Dexie("usersDatabase");
db.version(1).stores({ users: "++id,name,profile_pic" });

function Hero() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // API fuction
  useEffect(() => {
    setLoading(true);
    fetch('https://randomuser.me/api/?results=50')
      .then(response => response.json())
      .then(data => {
        setUsers(data.results);

        // Save the results to indexedDB

        db.transaction("rw", db.users, async () => {
          for (const user of data.results) {
            await db.users.add({
              name: `${user.name.first} ${user.name.last}`,
              profile_pic: user.picture.large,
            });
          }
        });
      })
      .finally(() => {
        setLoading(false);
        setTotal(users.length);
      });
  },[]);
  // Function to delete a user from indexedDB and update the UI
  const handleDelete = async (id) => {
    await db.users.delete(id);
    setUsers(users.filter((user) => user.id !== id));
    setTotal(total - 1);
  };

  // Refresh button event
  const handleRefresh = async () => {
    setLoading(true);
    await db.users.clear();
    fetch("https://randomuser.me/api/?results=50")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.results);
        // Save the results to indexedDB
        db.transaction("rw", db.users, async () => {
          for (const user of data.results) {
            await db.users.add({
              name: `${user.name.first} ${user.name.last}`,
              profile_pic: user.picture.large,
            });
          }
        });
      })
      .finally(() => {
        setLoading(false);
        setTotal(users.length);
      });
  };

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
  );
}

export default Hero;
