const express = require('express')
const router = express.Router()
const db = require('../models')
const mccUrl = 'https://halo.api.stdlib.com/mcc@0.0.11/'
const isLoggedIn = require('../middleware/isLoggedIn.js')


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

router.get('/latest',isLoggedIn,(req,res)=>{
    let player= res.locals.currentUser.gamertag
    axios.get(`${mccUrl}games/latest/?gamertag=${player}`)
    .then(response=>{
        if(response.data.games.length>0){
            res.render('mcc/latest',{latest: response.data})
        } else if(response.data.games.length<1){
            res.redirect('stats')
        }
        
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
router.get('/strategy',isLoggedIn,(req,res)=>{
    res.render('mcc/strategy')
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

module.exports = router