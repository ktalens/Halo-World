const express = require('express')
const router = express.Router()
const db = require('../models')
const mccUrl = 'https://halo.api.stdlib.com/mcc@0.0.11/'
let player= 'pinkpanther836'

const axios = require('axios')

router.get('/stats',(req,res)=>{
    axios.get(`${mccUrl}stats/?gamertag=${player}`)
    .then(response=>{
        //res.send(response.data.gamertag)
        res.render('mcc/stats',{stats: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/latest',(req,res)=>{
    axios.get(`${mccUrl}games/latest/?gamertag=${player}`)
    .then(response=>{
        res.render('mcc/latest',{latest: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/hist',(req,res)=>{
    let viewCount = 100
    axios.get(`${mccUrl}games/history/?gamertag=${player}&count=${viewCount}`)
    .then(response=>{
        //res.send(response.data)
        res.render('mcc/hist',{matches: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

module.exports = router