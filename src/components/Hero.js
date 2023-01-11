import { Card, Button, CircularProgress, Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Dexie from "dexie";

const db = new Dexie("usersDatabase");
db.version(1).stores({ users: "++id,name,profile_pic" });

function Hero() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(50);

  // API fuction

  useEffect(() => {
    setLoading(true);
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
        setTotal(50);
      });
  }, []);

  // Function to delete a user from indexedDB and update the UI

  const handleDelete = async (id) => {
    await db.users.delete(id);
    const newUsers = await db.users.toArray();
    
    setUsers(prevUsers => prevUsers.filter(user => user.login.uuid !== id));
    setTotal(total - 1);
  };

  // Refresh button event
  const handleRefresh = async () => {
    setLoading(true);
    const previousUsers = await db.users.toArray();
    fetch("https://randomuser.me/api/?results=50")
      .then((response) => response.json())
      .then( async (data) => {
        let newUsers = data.results;
        if (previousUsers.length !== 0) {
          newUsers = [...previousUsers, ...newUsers];
        }
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
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                <Card>
                  <img src={user.picture.large} alt={user.name.first} />
                  <p>{`${user.name.first} ${user.name.last}`}</p>
                  <Button onClick={() => handleDelete(user.login.uuid)}>
                    Delete
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}

export default Hero;
