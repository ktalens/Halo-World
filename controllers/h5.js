const express = require('express')
const router = express.Router()
const db = require('../models')
const halo5Url = 'https://www.haloapi.com/metadata/h5/metadata/'
const axios = require('axios')

let player= 'VERYCEREBRAL'

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

// GET GAME MODES
router.get('/gameBaseVariants',(req,res)=>{
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

//GET MAP VARIANTS BY ID
router.get('/variants/:idx',(req,res)=>{
    axios.get(`${halo5Url}map-variants/${req.params.idx}`, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        res.send(response.data)
    }
    )
})

// GET PLAYER DATA
router.get('/stats',(req,res)=>{

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