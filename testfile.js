// console.log(__dirname): 
// /Users/ktalens/Desktop/SEIRFX818/unit-2/Halo-World

const db = require("./models");

// relative path: 
//public/css/style.css

// full path: 
//Users/ktalens/Desktop/SEIRFX818/unit-2/Halo-World/public/css/style.css

//console.log(__filename): 
///Users/ktalens/Desktop/SEIRFX818/unit-2/Halo-World/testfile.js


// db.weapon.findOne({
//     where: {id: 8}
// })
// .then(weap=>{
//     db.strategy.update({
//         description: 'UPDATED2'
//     },{
//         where: {id: 22}, 
//         include: [db.weapon, db.map]
//     })
//     .then(lastEntry=>{
//         //console.log(lastEntry.dataValues)
//         lastEntry.setWeapons(weap)
//         .then(associatedWeapons=>{
//             associatedWeapons.forEach(updatedWeapon=>{
//                 console.log(updatedWeapon)
//             })
//             db.strategy.findOne({
//                 where: {id: 22}, 
//                 include: [db.weapon, db.map]
//             })
//             .then(seeNew=>{
//                 console.log(`added ${seeNew.weapons[0].name} (id: ${seeNew.weapons[0].id})`)
//             })
//             .catch(err=>{
//                 console.log('error', err.message)
//             })
//         })
//         .catch(err=>{
//             console.log('error', err.message)
//         })
        
//     })
//     .catch(err=>{
//         console.log('error', err.message)
//     })
// })
// .catch(err=>{
//     console.log('error', err.message)
// })



// db.strategy.findByPk(22, {
//     include: [db.weapon, db.map]
// })
// .then(seeNew=>{
//     console.log(seeNew.dataValues, seeNew.weapons[0].dataValues)
// })
// .catch(err=>{
//     console.log('error', err.message)
// })


// db.strategy.findByPk(22)
// .then(strat=>{
//     db.weapon.findByPk(8)
//     .then(weap=>{
//         strat.setWeapons([weap])
//         .then((joinedWeaps) => {
//           console.log(joinedWeaps)
//           db.strategy.update({
//               description: 'UPDATE 5'
//             },{
//               where: {id: 22}
//             })
//             .then(rowsUpdates=>{
//                 db.strategy.findByPk(22, {
//                     include: [db.weapon, db.map]
//                 })
//                 .then(updated22=>{
//                     console.log(updated22.dataValues,updated22.weapons[0].dataValues)
//                 })
//                 .catch(err=>{
//                     console.log('error', err.message)
//                 })
//             })
//             .catch(err=>{
//                 console.log('error', err.message)
//             })
//         })
//         .catch(err=>{
//             console.log('error', err.message)
//         })
//     })
//     .catch(err=>{
//         console.log('error', err.message)
//     })
// })
// .catch(err=>{
//     console.log('error', err.message)
// })

// db.map.findByPk(3)
// .then(map=>{
//     console.log(map)
// })
// .catch(err=>{
//     console.log('error', err.message)
// })

// (property) "WeaponStats": {
//     WeaponId: {
//         StockId: number;
//         Attachments: undefined[];
//     };
//     TotalShotsFired: number;
//     TotalShotsLanded: number;
//     TotalHeadshots: number;
//     TotalKills: number;
//     TotalDamageDealt: number;
//     TotalPossessionTime: string;
// }[]

db.user.findOne({
    where: {id: 2},
    include: [db.weapon,db.map,db.strategy]
})
.then(foundUser=>{
    //console.log(Object.keys(foundUser.dataValues))
    let hMccWeapons=foundUser.weapons.filter(allWeap=>{return(allWeap.type!=='MCC')})
    hMccWeapons.forEach(mccWeap=>{
        console.log(`NAME: ${mccWeap.name}, ID: ${mccWeap.weaponId}`)
    })
    //console.log(hMccWeapons.length)
})
.catch(err=>{
    console.log(err.message)
})

//  <% let mccWeapons=foundUser.weapons.filter(allWeap=>{return(allWeap.type=='MCC')}) %> 
//                      <span class="span-tab"><%= mccWeapons.length %> items</span><br></br>

List of relations
Schema |       Name       | Type  |     Owner      
--------+------------------+-------+----------------
public | SequelizeMeta    | table | fhoiimhdqlruqi
public | mapStrategies    | table | fhoiimhdqlruqi
public | maps             | table | fhoiimhdqlruqi
public | strategies       | table | fhoiimhdqlruqi
public | users            | table | fhoiimhdqlruqi
public | weaponStrategies | table | fhoiimhdqlruqi
public | weapons          | table | fhoiimhdqlruqi
(7 rows)

SELECT users.gamertag,
maps.name 
FROM users LEFT JOIN "maps" ON ("maps"."userId"=users.id);
SELECT * FROM weapons;
SELECT * FROM "weaponStrategies";
SELECT * FROM strategies;

ALTER TABLE "weapons" RENAME COLUMN "weapId" TO "weaponId";