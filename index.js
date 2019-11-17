const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const week09 = require('./script/week09.js');
const STATIC_DIR = path.join(__dirname, 'public')
const VIEWS_DIR = path.join(__dirname, 'views');

express()
  .use(express.static(STATIC_DIR))
  .set('views', VIEWS_DIR)
  .set('view engine', 'ejs')
  .get('/', (req, res) => { res.sendfile(`${STATIC_DIR}/index.html`); })
  .get('/getRate', (req, res) => { week09.getRate(req, res) })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));