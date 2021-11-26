const express = require('express')
const webpush = require('web-push')
const path = require('path');
const axios = require('axios');
const sheetUrl = '';
const publicVapidKey = '';
const privateVapidKey = '';

var cookieParser = require('cookie-parser')
const app = express()
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')



webpush.setVapidDetails('mailto:some@email.com', publicVapidKey, privateVapidKey)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(cookieParser())
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/', indexRouter)

app.post('/sendNotification',(req, res) => {
    console.log(req.body)
     webpush
     .sendNotification(JSON.parse(req.body.obj), JSON.stringify({ title: req.body.payload }))
     .catch(err => console.error(err));
    res.sendStatus(200)
})
app.post('/subscribe', async (req, res) => {
    var cookie = getcookie(req);
    console.log(cookie)
    let phone;
    let name;
    for(item in cookie){
        if(cookie[item].split('=')[0] == 'phone'){
            phone = cookie[item].split('=')[1]
        }
        if(cookie[item].split('=')[0] == 'username'){
            name = cookie[item].split('=')[1]
        }
    }
    const subscription = req.body;
    console.log(req.body)
    const data = {
        subscribe: 'true',
        subscribeObj: JSON.stringify(req.body),
        phone: phone,
        name: name
    }
    // console.log(data)
    await axios({
        method: 'post',
        url: sheetUrl,
        data: data
    });
    const payload = JSON.stringify({ title: "Welcome to parkingBlock!" });
    res.sendStatus(201);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up at port ${port}`)
})

function getcookie(req) {
    var cookie = req.headers.cookie;
    // user=someone; session=QyhYzXhkTZawIb5qSl3KKyPVN (this is my cookie i get)
    return cookie.split('; ');
}