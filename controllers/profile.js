const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middleware/isLoggedIn.js')
const db = require('../models')
const halo5Url = `https://www.haloapi.com/stats/h5/servicerecords/custom?players=VeryCerebral`
const axios = require('axios')

const passport= require('../config/ppConfig.js')

router.get('/', isLoggedIn, (req, res)=>{
    //res.render('profile/profile')
    //HALO 5
    axios.get(halo5Url,{headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }
    })
    .then(response=>{
        let h5short= response.data.Results[0].Result.CustomStats
        res.render('profile/profile',{
            halo5: {
                gamertag: response.data.Results[0].Id,
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
            }
            // ,
            // haloMCC: {},
            // haloW2: {}
        })
        //res.send(response.data)
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/auth/signup')
    })
})
router.get('/account', isLoggedIn, (req, res)=>{
    res.render('profile/account')
})

module.exports = router