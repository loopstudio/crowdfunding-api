## Description

Crowdfunding API.

---

## Prerequisites
You need [Node.js](https://nodejs.org/en/) installed on your local machine. You can also do it using [nvm](https://github.com/nvm-sh/nvm).

If you want to use Docker and Docker Compose, you have to install Docker Desktop first, check [this link](https://docs.docker.com/desktop/install/mac-install).

---

## Installation
We are using `yarn`, so you will install all the libs with the following command:
```bash
$ yarn install
```

---

## Define .env variables
You can pick `.env.template` as a template file to create a new `.env` file. Template file has just mock data and you have to change those values.

PS: If you are using Docker, be sure all the env vars with prefix `MONGO_...` are defined properly. If not, you just need to define `MONGO_URI_CONNECTION` which will point at your MongoDB instance.

🚨 `MONGO_URI_CONNECTION`: If you are using Docker, take care about the values you assign. They should be `"mongodb://MONGO_USERNAME:MONGO_PASSWORD@MONGO_CONTAINER_NAME:MONGO_PORT/MONGO_DATABASE"`

🚨 Only when using Docker: Check `database/mongo-init.js` file, you has to modify the values of the file:
```javascript
db.createUser({
  user: 'DB_USER', // Same value as MONGO_USERNAME
  pwd: 'DB_USER_PASS', // Same value as MONGO_PASSWORD
  roles: [
    {
      role: 'readWrite',
      db: 'DB_NAME', // Same value as MONGO_DATABASE
    },
  ],
});

```

---

## Running the app

- Using Docker

```bash
# watch mode
docker-compose up
```

- Without Docker (IMPORTANT: You have to have a MongoDB up and running)


```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

## Testing

🕵🏼‍♂️ In progress
