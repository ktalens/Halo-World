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

app.get('/', (req, res)=>{
    res.render('home')
    //res.send('EXPRESS AUTH HOME ROUTE')
})

app.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile')
    //res.send('EXPRESS AUTH HOME ROUTE')
})

app.get('/weapons',(req,res)=>{
    let haloUrl = `https://www.haloapi.com/metadata/h5/metadata/weapons?`
    
    axios.get(haloUrl, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        //res.send(response.data)
        res.render('weapons',{weaponsData: response.data})
    })
})

app.get('/maps',(req,res)=>{
    let haloUrl = `https://www.haloapi.com/metadata/h5/metadata/maps?`
    
    axios.get(haloUrl, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        //res.send(response.data)
        res.render('maps',{mapsData: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

app.get('/gameBaseVariants',(req,res)=>{
    let haloUrl = `https://www.haloapi.com/metadata/h5/metadata/game-base-variants`
    axios.get(haloUrl, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        //res.send(response.data)
        res.render('gbvariants',{gbvData: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

app.get('/variants/:idx',(req,res)=>{
    let haloUrl = `https://www.haloapi.com/metadata/h5/metadata/map-variants/${req.params.idx}`
    axios.get(haloUrl, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        res.send(response.data)
    }

    )
})

app.get('/profile',(req,res)=>{
    let player= 'VERYCEREBRAL'
    //'PinkPanther08'
    let haloUrl = `https://www.haloapi.com/stats/h5/players/${player}/matches`
    //let haloUrl = `https://www.haloapi.com/profile/h5/profiles/${player}/appearance`
    //let haloUrl = `https://www.haloapi.com/profile/h5/profiles/${player}/spartan`
    axios.get(haloUrl, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(response=>{
        //res.send(response.data.Results)
        res.render('profile',{matchData: response.data.Results})
    })
    .catch(err=>{
        res.send(err)
    })
})


app.get('/pinkpanther/stats',(req,res)=>{
    let player= 'pinkpanther836'
    //let player = 'pinkpanther8_1'
    let haloUrl = `https://halo.api.stdlib.com/mcc@0.0.11/stats/?gamertag=${player}`
    axios.get(haloUrl)
    .then(response=>{
        //res.send(response.data.gamertag)
        res.render('pinkpanther/stats',{stats: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

app.get('/pinkpanther/latest',(req,res)=>{
    let player= 'pinkpanther836'
    let haloUrl = `https://halo.api.stdlib.com/mcc@0.0.11/games/latest/?gamertag=${player}`
    axios.get(haloUrl)
    .then(response=>{
        res.render('pinkpanther/latest',{latest: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})

app.get('/pinkpanther/hist',(req,res)=>{
    let player= 'pinkpanther836'
    let count = 100
    let haloUrl = `https://halo.api.stdlib.com/mcc@0.0.11/games/history/?gamertag=${player}&count=${count}`
    axios.get(haloUrl)
    .then(response=>{
        //res.send(response.data)
        res.render('pinkpanther/hist',{matches: response.data})
    })
    .catch(err=>{
        res.send(err)
    })
})




app.listen(process.env.PORT, ()=>{
    console.log(`Hello World, welcome to Halo World at port ${process.env.PORT}`)
})
