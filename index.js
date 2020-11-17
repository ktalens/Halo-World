require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport= require('./config/ppConfig.js')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn.js')
const axios = require('axios')


app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))

//session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true 
}));


 //passport middleware
app.use(passport.initialize())
app.use(passport.session())

// PUT YOUR FLASH MIDDLEWARE AFTER THE SESSION MIDDLE WARE
app.use(flash())

//CUSTOM MIDDLEWARE
app.use((req, res, next)=>{
    // before every route, attach the glash messages and currecnt user to relovcals, this will five us access to these values in all our ejs pages
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next() // moveo onto nect piece of middleware
})

// use controllers
app.use('/auth', require('./controllers/auth.js'))
app.use('/h5',require('./controllers/h5.js'))
app.use('/hw2',require('./controllers/hw2.js'))
app.use('/mcc',require('./controllers/mcc.js'))
app.use('/profile',require('./controllers/profile.js'))

app.get('/', (req, res)=>{ 
    res.render('home',{gamerInfo:null})
    // .catch(err=>{
    //     res.send(err)
    // })
})

app.post('/',(req,res)=>{
    let player=req.body.gamertag
    let game=req.body.game
    let viewCount = 5
    let gameUrl 
    let headers
    if(game==='haloMCC'){
        gameUrl=`https://halo.api.stdlib.com/mcc@0.0.11/games/history/?gamertag=${player}&count=${viewCount}`
        headers=null
    } else if (game==='halo5'){
        gameUrl=`https://www.haloapi.com/stats/h5/players/${player}/matches?count=${viewCount}&include-times=true`
        headers={headers: {
                 'Accept-Language': 'en',
                 'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
                }} 
    }else if (game==='haloW2'){
        gameUrl=`https://www.haloapi.com/stats/hw2/players/${player}/matches?count=${viewCount}&include-times=true`
        headers={headers: {
            'Accept-Language': 'en',
            'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
           }} 
    }
    axios.get(gameUrl, headers )
    .then(response=>{
        if(game==='haloMCC'){
            res.render('home',{
                gamerInfo: {
                    haloGame: game,
                    gamertag: response.data.gamertag,
                    avgKills: response.data.summary.killsPerGame,
                    killDeathRatio: response.data.summary.killDeathRatio,
                    headshotsPerGame:response.data.summary.headshotsPerGame
                },
                lastGame: {
                    wonOrLost: response.data.games[0].won,
                    matchKills: response.data.games[0].kills,
                    matchDeaths: response.data.games[0].deaths,
                    matchAssists: response.data.games[0].assists,
                    timePlayed: response.data.games[0].playedAt
                }
            })
        } else if(game ==='halo5' || game==='haloW2'){
            res.render('home',{
                gamerInfo: {
                    haloGame: game,
                    gamertag: response.data.Results[0].Players[0].Player.Gamertag,
                    avgKills: null,
                    killDeathRatio: null,
                    headshotsPerGame:null
                },
                lastGame: {
                    wonOrLost: response.data.Results[0].Players[0].Result,
                    matchKills: response.data.Results[0].Players[0].TotalKills,
                    matchDeaths: response.data.Results[0].Players[0].TotalDeaths,
                    matchAssists: response.data.Results[0].Players[0].TotalAssists,
                    timePlayed: response.data.Results[0].MatchCompletedDate.ISO8601Date
                }
            })
            //res.send(response.data)
        }
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/')
    })
    
})














app.listen(process.env.PORT, ()=>{
    console.log(`Hello World, welcome to Halo World at port ${process.env.PORT}`)
})
