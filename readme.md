# Halo World

## Concept:

This app is for users who want to access their Halo 5 & Halo MCC online gaming stats, see detailed stats about how variables in the Halo gaming-world affect their performance, and gain insight into how to improve their gameplay. Gaming variables include factors such as: the map your game is played on, the gamemode your game is played in, the weapons available to you within each map/mode, and the stats of your fellow teammates. While the APIs used for this app don't provide much detail other then surface-level description, there are many outside analyses done by fellow-gamers, which could ideally be added into the app's data manually (right now, by entering strategies in through text feilds and linking these posts to map/weapon combos). 

As a user, you are able to view game data provided by the APIs, save maps and weapons, and add your own posts. You can look at other player's stats in limited detail, and (soon-to-be-built-in) you can also add your friends/teammates in with your account to access deeper stats on their gameplay and yours.


----------------------------------------------------------
### ERD
https://lucid.app/invitations/accept/f87be229-ba54-4ae7-9276-c9dab5913677

----------------------------------------------------------
### User Stories
As a gamer, I want to look at the details about each weapon available on the map in each of the game modes in Halo so I can compare differences and decide which weapons are best to use.
As a gamer, I want to be able to compare my strengths & weaknesses with my teammates and my opponents so I can plan a better strategy against other teams.
As a gamer, I want to know how to win each match depending on the combination of the game mode, the map, and the available weapons. Added bonus if I can get the locations of each weapon's spawn-point on the maps. 
As a gamer, I want to save, edit, and delete specific map & weapon combos so I can test out the variations in gameplay.

----------------------------------------------------------
### Wireframes
https://www.canva.com/design/DAENJo6NsvA/z1F9cY3Rwfa6nmQh9287mA/view?utm_content=DAENJo6NsvA&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink
----------------------------------------------------------
### APIs and other outside tech

Halo Waypoint API(official): https://developer.haloapi.com/
  - this does require an API key, which is free when you sign up with your email
Halo MCC API(user-made): https://autocode.com/lib/halo/mcc/#stats

----------------------------------------------------------

## Technologies Used:

* passport & passport-local, bcrypt, and express-session node-packages are used for user authentication
* connect-flash node package and custom middle-ware is used for user authentication alerts
* axios node-package is used for API calls
* sequelize & pg are used for storing and accessing accounts and user-saved data
* ejs, express-ejs layouts, and serve-static are used for formatting and styling the pages
* method-override is used for RESTful-routing/CRUD abilities


-------------------------------------------------------------
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
create the one-to-many associations to the maps, weapons, and strategies tables that will be created:
      models.user.hasMany(models.weapon)
      models.user.hasMany(models.map)
      models.user.hasMany(models.strategy)
```
sequelize model:create --name weapon --attributes weapId:bigint,type:string,name:string,description:text,smallIconImageUrl:text,userId:integer
```
create one-to-many association to users and many-to-many association to strategies:
      models.weapon.belongsTo(models.user)
      models.weapon.belongsToMany(models.strategy, {through: 'weapStrategy'})

```
sequelize model:create --name map --attributes mapId:string,type:string,name:string,description:text,smallIconImageUrl:text,userId:integer
```
create one-to-many association to users and many-to-many association to strategies:
models.map.belongsTo(models.user)
      models.map.belongsToMany(models.strategy, {through: 'mapStrategy'})

```
sequelize model:create --name strategy --attributes description:text,mapId:string,weapId:bigint,userId:integer
```
define the one-to-many association with users inside the strategy model:
      models.strategy.belongsTo(models.user)
create many-to-many maps-association in strategy model:
      models.strategy.belongsToMany(models.map, {through: 'mapStrategy'})
create many-to-many weapons-association in strategy model: 
      models.strategy.belongsToMany(models.weapon, {through: 'weapStrategy'})

and create the following join-tables: 

```
sequelize model:create --name weapStrategy --attributes mapId:bigint,strategyId:integer
```

```
sequelize model:create --name mapStrategy --attributes mapId:string,strategyId:integer
```

create association:

5. Migrate the `halo_world` model to your database
```
sequelize db:migrate
```

6. Add `SESSION_SECRET`, `PORT`, and `API_KEY` environment variables in a `.env` file

7. Run `nodemon` to start up app