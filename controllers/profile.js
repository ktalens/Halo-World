const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn.js')
const db = require('../models')
const halo5Url = `https://www.haloapi.com/stats/h5/servicerecords/custom?players=VeryCerebral`
const haloMCCUrl= `https://halo.api.stdlib.com/mcc@0.0.11/stats/?gamertag=`

const axios = require('axios')

const passport= require('../config/ppConfig.js')

router.get('/', isLoggedIn, (req, res)=>{
    let player= res.locals.currentUser.gamertag
    //HALO 5
    axios.get(halo5Url,{headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }})
    .then(h5response=>{
        let h5short= h5response.data.Results[0].Result.CustomStats
        axios.get(`${haloMCCUrl}${player}`)
        .then(mccResponse=>{
            let userId= res.locals.currentUser.id
            db.user.findOne({
                where: {id: userId},
                include: [db.weapon, db.map,db.strategy]
            })
            .then(userData=>{
                //res.send(userData)
                res.render('profile/profile',{
                    halo5: {
                        gamertag: h5response.data.Results[0].Id,
                        TotalKills: h5short.TotalKills,
                        TotalDeaths:h5short.TotalDeaths,
                        TotalAssists:h5short.TotalAssists,
                        TotalGamesCompleted: h5short.TotalGamesCompleted,
                        TotalGamesWon:h5short.TotalGamesWon,
                        TotalGamesLost: h5short.TotalGamesLost,
                        TotalGamesTied: h5short.TotalGamesTied,
                        TotalHeadshots: h5short.TotalHeadshots,
                        TotalShotsFired: h5short.TotalShotsFired,
                        TotalShotsLanded: h5short.TotalShotsLanded,
                        TotalMeleeKills: h5short.TotalMeleeKills,
                        TotalAssassinations: h5short.TotalAssassinations,
                        TotalGrenadeKills:h5short.TotalGrenadeKills,
                        TotalPowerWeaponKills: h5short.TotalPowerWeaponKills,
                        WeaponWithMostKills: h5short.WeaponWithMostKills,
                        WeaponStats: h5short.WeaponStats
                    },
                    haloMCC: mccResponse.data,
                    userData: userData 
                })
            })
            .catch(err=>{
                req.flash('error', err.message)
                res.redirect('/profile/profile')
            })
        })
        .catch(err=>{
            req.flash('error', err.message)
            res.redirect('/profile/profile')
        })
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/profile/profile')
    })
})

router.get('/account', isLoggedIn, (req, res)=>{
    res.render('profile/account')
})

module.exports = router