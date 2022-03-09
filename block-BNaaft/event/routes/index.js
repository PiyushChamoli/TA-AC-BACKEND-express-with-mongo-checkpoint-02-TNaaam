var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req,res) => {
  res.render('index')
})

router.get('/contact', (req,res) => {
  res.render('contactForm')
})

module.exports = router;
