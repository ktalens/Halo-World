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
app.use('/mcc',require('./controllers/mcc.js'))

app.get('/', (req, res)=>{
    //res.render('home')
    //res.send('EXPRESS AUTH HOME ROUTE')
    let weaponsUrl = `https://www.haloapi.com/metadata/h5/metadata/weapons?`
    axios.get(weaponsUrl, {headers: {
        'Accept-Language': 'en',
        'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
    }} )
    .then(weaponsResponse=>{
        let mapsUrl= `https://www.haloapi.com/metadata/h5/metadata/maps?`
        axios.get(mapsUrl, {
            headers: {
                'Accept-Language': 'en',
                'Ocp-Apim-Subscription-Key': `${process.env.API_KEY}`
            }
        })
        .then(mapsResponse=>{
            //res.send(mapsResponse.data)
            res.render('home', {weaponsData: weaponsResponse.data, mapsData: mapsResponse.data})
        })
        //res.send(WeaponsResponse.data)
        //res.render('weapons',{weaponsData: WeaponsResponse.data})
        .catch(err=>{
            res.send(err)
        })
            
    })
    .catch(err=>{
        res.send(err)
    })
})

app.get('/profile', isLoggedIn, (req, res)=>{
    res.render('profile')
    //res.send('EXPRESS AUTH HOME ROUTE')
})













app.listen(process.env.PORT, ()=>{
    console.log(`Hello World, welcome to Halo World at port ${process.env.PORT}`)
})
