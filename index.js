const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const week09 = require('./script/week09.js');

var app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')
app.get('/', (req, res) => { res.sendfile(`public/week09.html`); })
app.get('/getRate', (req, res) => { week09.getRate(req, res) })
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));