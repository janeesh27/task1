import React from 'react'
import { Spinner, Card, Button } from '@material-ui/core';

const Hero = () => {
  return (
    <div>
    {loading ? (
      <Spinner />
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
  )
}

export default Hero