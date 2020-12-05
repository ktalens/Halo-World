const express = require('express')
const router = express.Router()
const db = require('../models')
const mccUrl = 'https://halo.api.stdlib.com/mcc@0.0.11/'
const isLoggedIn = require('../middleware/isLoggedIn.js')
const methodOverride= require('method-override');

router.use(methodOverride('_method'))
//router.use(express.urlencoded({extended: false}))

const axios = require('axios')

router.get('/stats',isLoggedIn,(req,res)=>{
    let player= res.locals.currentUser.gamertag
    axios.get(`${mccUrl}stats/?gamertag=${player}`)
    .then(response=>{
        res.render('mcc/stats',{stats: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/hist',isLoggedIn,(req,res)=>{
    let viewCount = 100
    let player= res.locals.currentUser.gamertag
    axios.get(`${mccUrl}games/history/?gamertag=${player}&count=${viewCount}`)
    .then(response=>{
        res.render('mcc/hist',{matches: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

// GET SAVED STRATEGIES
router.get('/strategies',isLoggedIn,(req,res)=>{
    let userInfo= res.locals.currentUser.id
    db.user.findOne(
        {where: {id: userInfo}
    })
    .then(foundUser=>{
        foundUser.getStrategies({
            where: {gameId: 4}, //<-- FOR HALO MCC
            include: [db.weapon,db.map]
        })
        .then(foundStrategies=>{
            res.render('mcc/saved/strategy', {entries: foundStrategies})
            //res.send(foundStrategies)
        })
        .catch(err=>{
            req.flash('error', err.message)
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})

// PSOT NEW ENTRY FOR STRATEGIES
router.post('/strategies/new',(req,res)=>{
    let userInfo= res.locals.currentUser.id
    db.strategy.findOrCreate({
        where: {
            description: req.body.description,
            userId: userInfo
        },
        defaults: {gameId: 4}   //<-- FOR HALO 4
    })
    .then(([entry,created])=>{
        db.weapon.findOrCreate( {
            where: {
                userId: userInfo,
                name: req.body.weapChoiceName
            },
            defaults: {
                weaponId: 0000000004,
                type: 'MCC',
                description: 'Halo MCC; User-entered weapon',
                smallIconImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWyToWI2tG4YBvJifu9XGvgMXYq-sUR2qzg&usqp=CAU'
            }
        })
        .then(([foundWeapon])=>{
            entry.addWeapons(foundWeapon)
            db.map.findOrCreate({
                where: {
                    userId: userInfo,
                    name: req.body.mapChoiceName
                },
                defaults: {
                    mapId: 0000000004,
                    type: 'MCC',
                    imageUrl: 'https://www.shareicon.net/data/2016/07/26/801882_map_512x512.png',
                    description: 'Halo MCC; User-entered map'
                }
            })
            .then(([foundMap])=>{
                entry.addMaps(foundMap)
                res.redirect('../strategies/')
            })
            .catch(err=>{
                console.log('error', err.message)
            })
        })
        .catch(err=>{
            console.log('error', err.message)
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})


// CREATE NEW ENTRY FOR STRATEGIES
router.get('/strategies/new',isLoggedIn,(req,res)=>{
    res.render('mcc/saved/newEntry')
})

// EDIT ENTRY FOR STRATEGIES
router.get('/strategies/edit/:idx',isLoggedIn,(req,res)=>{
    let userInfo= res.locals.currentUser.id
    db.strategy.findOne({
        where: {id: req.params.idx,
                userId: userInfo}, 
        include: [db.weapon, db.map]
    })
    .then(entryValues=>{
        db.weapon.findAll({
            where: {userId: userInfo}
        })
        .then(foundWeaps=>{
            db.map.findAll({
                where: {userId: userInfo}
            })
            .then(foundMaps=>{
                res.render('mcc/saved/edit',{
                    savedWeaps: foundWeaps,
                    savedMaps: foundMaps,
                    prevValues: entryValues
                })
            })
            .catch(err=>{
                console.log('error', err.message)
            })
        })
        .catch(err=>{
            console.log('error', err.message)
        })
    })
    .catch(err=>{
        console.log('error', err.message)
    })
})

// PUT UPDATED ENTRY FOR STRATEGIES
router.put('/strategies/edit/:idx',isLoggedIn,(req,res)=>{
    //res.send(req.body)
    let userInfo= res.locals.currentUser.id
    let entryId= req.params.idx
    db.strategy.findByPk(entryId,{
        where: {userId: userInfo}
    })
    .then(strat=>{
        db.weapon.findOrCreate({
            where: {
                userId: userInfo,
                name: req.body.weapChoiceName
            },
            defaults: {
                weaponId: 0000000004,
                type: 'MCC',
                description: 'Halo MCC; User-entered weapon',
                smallIconImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWyToWI2tG4YBvJifu9XGvgMXYq-sUR2qzg&usqp=CAU'
            }
        })
        .then(([updatedWeap])=>{
            strat.setWeapons([updatedWeap])
            .then(() => {
                db.map.findOrCreate({
                    where: {
                        userId: userInfo,
                        name: req.body.mapChoiceName
                    },
                    defaults: {
                        mapId: 0000000004,
                        type: 'MCC',
                        imageUrl: 'https://www.shareicon.net/data/2016/07/26/801882_map_512x512.png',
                        description: 'Halo MCC; User-entered map'
                    }
                })
                .then(([updatedMap])=>{
                    strat.setMaps([updatedMap])
                    .then(()=>{
                        db.strategy.update({
                            description: req.body.description
                            },{
                            where: {id: entryId}
                            })
                            .then(rowsUpdates=>{
                                db.strategy.findByPk(entryId, {
                                    include: [db.weapon, db.map]
                                })
                                .then(updatedEntry=>{
                                    console.log(updatedEntry.dataValues,updatedEntry.weapons[0].dataValues)
                                    
                                })
                                .catch(err=>{
                                    console.log('error 1', err.message)
                                })
                            })
                            .catch(err=>{
                                console.log('error 2', err.message)
                            })
                    }).catch(err=>{
                        console.log('error3', err.message)
                    })
                }).catch(err=>{
                    console.log('error4', err.message)
                })    
            })
            .catch(err=>{
                console.log('error5', err.message)
            })
        })
        .catch(err=>{
            console.log('error6', err.message)
        })
        res.redirect('/mcc/strategies')
    })
    .catch(err=>{
        console.log('error7', err.message)
    })
})


// DELETE SAVED STRATEGY 
router.delete('/strategies/:idx',(req,res)=>{
    let userId= res.locals.currentUser.id
    db.strategy.destroy({
        where: {id: req.body.stratId}
    })
    .then(deletedItems=>{
        console.log('deleted: ',deletedItems)
        res.redirect('/mcc/strategies')
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})

module.exports = router