const express = require('express')
const router = express.Router()
const db = require('../models')
const haloW2Url = 'https://www.haloapi.com/metadata/hw2/metadata/'
const axios = require('axios')
const methodOverride= require('method-override')



//  GET WEAPONS INDEX
router.get('/gamedata/weapons',(req,res)=>{  
    axios.get(`${haloW2Url}weapons?`, {headers: {
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
            res.render('hw2/gamedata/weapons',{weaponsData: filteredWeaps, weaponsList:allWeaps})
        } else {
            res.render('hw2/gamedata/weapons',{weaponsData: allWeaps, weaponsList: allWeaps})
        }
    })
    .catch(err=>{
        res.send(err)
    })
})

//POST SAVED WEAPONS
router.post('/gamedata/weapons',(req,res)=>{
    let faved = req.body
    db.user.findOne({
        where: {id: faved.userId}
    })
    .then(foundUser=>{
        db.weapon.findOrCreate({
            where: {
                weapId: parseInt(faved.id),
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
                res.redirect('/hw2/gamedata/weapons')
            } else if(createdItem){
                foundUser.addWeapon(weapon)
                req.flash(`${foundItem.name} was successfully added to your saved items`)
                res.redirect('/hw2/gamedata/weapons')
            }
        })
        .catch(err=>{
            req.flash('error', err.message)
            res.redirect('/hw2/gamedata/weapons')
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/hw2/gamedata/weapons')
    })
})

// GET SAVED WEAPONS 
router.get('/saved/weapons',(req,res)=>{
    db.user.findAll(
    {
        include: [db.weapon]
    })
    .then(savedWeapons=>{
        res.render('hw2/saved/weapons', {savedItems: savedWeapons})
    })
    .catch(err=>{
        console.log(err)
      })
})

/



// GET MAPS INDEX
router.get('/gamedata/maps',(req,res)=>{
    axios.get(`${haloW2Url}maps?`, {headers: {
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
            res.render('hw2/gamedata/maps', {mapsData: filteredMaps, mapsList:allMaps})
        } else {
            res.render('hw2/gamedata/maps', {mapsData: allMaps, mapsList: allMaps})
        }
    })
    .catch(err=>{
        res.send(err)
    })
})

//POST SAVED MAPS
router.post('/gamedata/maps',(req,res)=>{
    let faved = req.body
    db.user.findOne({
        where: {id: faved.userId}
    })
    .then(foundUser=>{
        db.map.findOrCreate({
            where: {
                mapId: faved.id,
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
                res.redirect('/hw2/gamedata/maps')
            } else if(createdItem){
                foundUser.addmap(map)
                req.flash(`${foundItem.name} was successfully added to your saved items`)
                res.redirect('/hw2/gamedata/maps')
            }
        })
        .catch(err=>{
            req.flash('error', err.message)
            res.redirect('/hw2/gamedata/maps')
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/hw2/gamedata/maps')
    })
})

// GET SAVED mapS 
router.get('/saved/maps',(req,res)=>{
    db.user.findAll(
    {
        include: [db.map]
    })
    .then(savedmaps=>{
        res.render('hw2/saved/maps', {savedItems: savedmaps})
    })
    .catch(err=>{
        console.log(err)
      })
})

// GET SAVED STRATEGIES
router.get('/stategy',isLoggedIn,(req,res)=>{
    let userId= res.locals.currentUser.id
    db.user.findByPk(userId,
        {
            include: [db.strategy]
        })
        .then(entries=>{
            res.render('mcc/strategy', {savedItems: entries})
        })
        .catch(err=>{
            console.log(err)
          })
})

// GET PLAYER DATA
router.get('/stats',(req,res)=>{
    let player= res.locals.currentUser.gamertag
    let hw2StatsUrl = `https://www.haloapi.com/stats/hw2/players/${player}/matches`
    //let haloUrl = `https://www.haloapi.com/profile/hw2/profiles/${player}/appearance`
    //let haloUrl = `https://www.haloapi.com/profile/hw2/profiles/${player}/spartan`
    axios.get(hw2StatsUrl, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        //res.send(response.data.Results)
        res.render('hw2/stats',{matchData: response.data.Results})
    })
    .catch(err=>{
        res.send(err)
    })
})

module.exports = router