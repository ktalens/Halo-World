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

    // let userId= res.locals.currentUser.id
    console.log(req.body)
    //res.send(req.body)
    db.weapon.destroy({
        where: {weapId: req.body.weapId,
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
        where: {mapId: req.body.mapId,
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
router.get('/saved/strategy',isLoggedIn,(req,res)=>{
    res.render('h5/saved/strategy')
    // let userId= res.locals.currentUser.id
    // db.user.findByPk(userId,
    //     {
    //         include: [db.strategy]
    //     })
    //     .then(entries=>{
    //         res.render('h5/saved/strategy', {savedItems: entries})
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //       })
})



// GET PLAYER DATA
router.get('/stats',isLoggedIn,(req,res)=>{
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