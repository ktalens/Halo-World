# Express Auth Boilerplate

---
## How to set up:

1. Fork & Clone

2. Install dependencies
```
npm i
```

3. Create a `config.json` with the following code:
```json
{
  "development": {
    "database": "halo_world_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "database": "halo_world_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "database": "halo_world_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

**Note:** If your database requires a username and password, you'll need to include these fields as well.

4. Create a database
```
sequelize db:create halo_world_dev
```
```
sequelize model:create --name user --attributes gamertag:string,email:string,password:string
```
```
```
sequelize model:create --name weapon --attributes id:integer,type:string,name:string,description:text,smallIconImageUrl:string
```

5. Migrate the `user` model to your database
```
sequelize db:migrate
```

6. Add `SESSION_SECRET` and `PORT`environment variableS in a `.env` file

7. Run `nodemon` to start up app