const express = require('express')
const router = express.Router()
const db = require('../models')
const halo5Url = 'https://www.haloapi.com/metadata/h5/metadata/'
const axios = require('axios')
const isLoggedIn = require('../middleware/isLoggedIn.js')
const methodOverride= require('method-override');

router.use(methodOverride('_method'))

router.use(express.urlencoded({extended: false}))



router.get('/test',(req,res)=>{
    let player= res.locals.currentUser.gamertag
    console.log(player)
    res.send(player)
})

//  GET WEAPONS INDEX
router.get('/weapons',(req,res)=>{  
    axios.get(`${halo5Url}weapons?`, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        let allWeaps = response.data
        let weaponFinder= req.query.id
        if(weaponFinder){
            const filteredWeaps=allWeaps.filter(selectedWeap=>{
                return selectedWeap.id===weaponFinder
            })
            res.render('h5/weapons',{weaponsData: filteredWeaps, weaponsList:allWeaps})
        } else {
            res.render('h5/weapons',{weaponsData: allWeaps, weaponsList: allWeaps})
        }
    })
    .catch(err=>{
        res.send(err)
    })
})

//POST SAVED WEAPONS
router.post('/weapons',isLoggedIn,(req,res)=>{
    let faved = req.body
    db.user.findOne({
        where: {id: faved.userId}
    })
    .then(foundUser=>{
        db.weapon.findOrCreate({
            where: {
                weaponId: parseInt(faved.weaponId),
                name: faved.name,
                type: faved.type,
                description: faved.description,
                smallIconImageUrl: faved.smallIconImageUrl,
                userId: faved.userId
            },
            defaults: {
                // MIGHT ADD A NOTES FEILD
            }
        })
        .then(([foundItem,createdItem])=>{
            if(foundItem){
                req.flash(`${foundItem.name} is already in your saved items`)
                res.redirect('/h5/weapons')
            } else if(createdItem){
                foundUser.addWeapon(weapon)
                req.flash(`${foundItem.name} was successfully added to your saved items`)
                res.redirect('/h5/weapons')
            }
        })
        .catch(err=>{
            req.flash('error', err.message)
            res.redirect('/h5/weapons')
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/h5/weapons')
    })
})

// GET SAVED WEAPONS 
router.get('/saved/weapons',isLoggedIn,(req,res)=>{
    db.user.findAll(
    {
        include: [db.weapon]
    })
    .then(savedWeapons=>{
        res.render('h5/saved/weapons', {savedItems: savedWeapons})
    })
    .catch(err=>{
        console.log(err)
      })
})

// DELETE SAVED WEAPONS 
router.delete('/saved/weapons/:idx',(req,res)=>{
    let userId= res.locals.currentUser.id
    db.weapon.destroy({
        where: {id: req.body.weapId,
        userId: req.body.userId}
    })
    .then(deletedItems=>{
        console.log('deleted: ',deletedItems)
        res.redirect('/h5/saved/weapons')
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})



// GET MAPS INDEX
router.get('/maps',(req,res)=>{
    axios.get(`${halo5Url}maps?`, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        let allMaps = response.data
        let mapsFinder =  req.query.id
        if(mapsFinder){
            const filteredMaps = allMaps.filter(selectedMap=>{
                return selectedMap.id === mapsFinder
            })
            res.render('h5/maps', {mapsData: filteredMaps, mapsList:allMaps})
        } else {
            res.render('h5/maps', {mapsData: allMaps, mapsList: allMaps})
        }
    })
    .catch(err=>{
        res.send(err)
    })
})

//POST SAVED MAPS
router.post('/maps',isLoggedIn,(req,res)=>{
    let faved = req.body
    db.user.findOne({
        where: {id: faved.userId}
    })
    .then(foundUser=>{
        db.map.findOrCreate({
            where: {
                mapId: faved.mapId,
                name: faved.name,
                type: faved.type,
                description: faved.description,
                imageUrl: faved.imageUrl,
                userId: faved.userId
            },
            defaults: {
                // MIGHT ADD A NOTES FEILD
            }
        })
        .then(([foundItem,createdItem])=>{
            if(foundItem){
                req.flash(`${foundItem.name} is already in your saved items`)
                res.redirect('/h5/maps')
            } else if(createdItem){
                foundUser.addmap(map)
                req.flash(`${foundItem.name} was successfully added to your saved items`)
                res.redirect('/h5/maps')
            }
        })
        .catch(err=>{
            req.flash('error', err.message)
            res.redirect('/h5/maps')
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/h5/maps')
    })
})



// GET SAVED mapS 
router.get('/saved/maps',isLoggedIn,(req,res)=>{
    db.user.findAll(
    {
        include: [db.map]
    })
    .then(savedmaps=>{
        res.render('h5/saved/maps', {savedItems: savedmaps})
    })
    .catch(err=>{
        console.log(err)
      })
})

// DELETE SAVED MAPS 
router.delete('/saved/maps/:idx',(req,res)=>{
    db.map.destroy({
        where: {id: req.body.mapId,
        userId: req.body.userId}
    })
    .then(deletedItems=>{
        console.log('deleted: ',deletedItems)
        res.redirect('/h5/saved/maps')
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})

// GET GAME MODES
router.get('/gameBaseVariants',isLoggedIn,(req,res)=>{
    axios.get(`${halo5Url}game-base-variants`, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        //res.send(response.data)
        res.render('h5/gbvariants',{gbvData: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})


// GET SAVED STRATEGIES
router.get('/saved/strategies/',isLoggedIn,(req,res)=>{
    //res.render('h5/saved/strategies/strategy')
    let userInfo= res.locals.currentUser.id
    db.user.findOne(
        {where: {id: userInfo}
    })
    .then(foundUser=>{
        foundUser.getStrategies({
            where: {gameId: 5}, //<-- FOR HALO 5 
            include: [db.weapon,db.map]
        })
        .then(foundStrategies=>{
            res.render('h5/saved/strategies/strategy', {entries: foundStrategies})
        })
        .catch(err=>{
            req.flash('error', err.message)
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})

// POST NEW ENTRY FOR STRATEGIES
router.post('/saved/strategies/new',(req,res)=>{
    let userInfo= res.locals.currentUser.id
    db.strategy.findOrCreate({
        where: {
            description: req.body.description,
            userId: userInfo
        },
        defaults: {gameId: 5}   //<-- FOR HALO 5
    })
    .then(([entry,created])=>{
        db.weapon.findOne({
            where: {
                userId: userInfo,
                id: req.body.weapChoice
            }
        })
        .then(foundWeapon=>{
            entry.addWeapons(foundWeapon)
            db.map.findOne({
                where: {
                    userId: userInfo,
                    id: req.body.mapChoice
                }
            })
            .then(foundMap=>{
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
router.get('/saved/strategies/new',isLoggedIn,(req,res)=>{
    let userInfo= res.locals.currentUser.id
    db.weapon.findAll({
        where: {userId: userInfo}
    })
    .then(foundWeapons=>{
        db.map.findAll({
            where: {userId: userInfo}
        })
        .then(foundMaps=>{
            res.render('h5/saved/strategies/newEntry',{
                savedWeaps: foundWeapons,
                savedMaps: foundMaps
            })
        })
        .catch(err=>{
            req.flash('error', err.message)
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})

// EDIT ENTRY FOR STRATEGIES
router.get('/saved/strategies/edit/:idx',isLoggedIn,(req,res)=>{
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
                res.render('h5/saved/strategies/edit',{
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
router.put('/saved/strategies/edit/:idx',isLoggedIn,(req,res)=>{
    //res.send(req.body)
    let userInfo= res.locals.currentUser.id
    let entryId= req.params.idx
    db.strategy.findByPk(entryId,{
        where: {userId: userInfo}
    })
    .then(strat=>{
        db.weapon.findByPk(req.body.weapChoice)
        .then(updatedWeap=>{
            strat.setWeapons([updatedWeap])
            .then(() => {
                db.map.findByPk(req.body.mapChoice)
                .then(updatedMap=>{
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
        res.redirect('/')
    })
    .catch(err=>{
        console.log('error7', err.message)
    })
})


// DELETE SAVED STRATEGY 
router.delete('/saved/strategies/:idx',(req,res)=>{
    let userId= res.locals.currentUser.id
    db.strategy.destroy({
        where: {id: req.body.stratId}
    })
    .then(deletedItems=>{
        console.log('deleted: ',deletedItems)
        res.redirect('/h5/saved/strategies')
    })
    .catch(err=>{
        req.flash('error', err.message)
    })
})

// GET PLAYER DATA
router.get('/stats',isLoggedIn,(req,res)=>{
    let player= res.locals.currentUser.gamertag
    let h5StatsUrl = `https://www.haloapi.com/stats/h5/players/${player}/matches`
    //let haloUrl = `https://www.haloapi.com/profile/h5/profiles/${player}/appearance`
    //let haloUrl = `https://www.haloapi.com/profile/h5/profiles/${player}/spartan`
    axios.get(h5StatsUrl, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        //res.send(response.data.Results)
        res.render('h5/stats',{matchData: response.data.Results})
    })
    .catch(err=>{
        res.send(err)
    })
})



module.exports = router