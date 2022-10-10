db.createUser({
  user: 'DB_USER',
  pwd: 'DB_USER_PASS',
  roles: [
    {
      role: 'readWrite',
      db: 'DB_NAME',
    },
  ],
});
