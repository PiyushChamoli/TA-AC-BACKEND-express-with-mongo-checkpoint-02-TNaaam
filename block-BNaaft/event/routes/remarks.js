var express = require('express')
var router = express.Router()
var Event = require('../models/Event')
var Remark = require('../models/Remark')


// remark like handler

router.get('/:id/like/inc', function (req, res, next) {
    let remarksId = req.params.id;
    Remark.findByIdAndUpdate(remarksId, { $inc: { likes: 1 } }, (err, remark) => {
      if (err) return next(err)
      res.redirect('/events/' + remark.eventId)
    })
})
  
// remark dislike handler

router.get('/:id/like/dec', function (req, res, next) {
    let remarksId = req.params.id;
    Remark.findByIdAndUpdate(remarksId, { $inc: { likes: -1 } }, (err, remark) => {
        if (err) return next(err)
        res.redirect('/events/' + remark.eventId)
      }
    )
})
  
// remark delete handler

router.get('/:id/delete', (req,res,next) => {
    var remarkId = req.params.id
    Remark.findByIdAndDelete(remarkId, (err,deletedRemark) => {
        if (err) return next(err)
        Event.findByIdAndUpdate(deletedRemark.eventId, {$pull: {remarks: remarkId}}, (err,info) => {
            if (err) return next(err)
            res.redirect('/events/' + deletedRemark.eventId)
        })
    })
})

// remark edit handler

router.get('/:id/edit', (req,res,next) => {
    var remarkId = req.params.id
    Remark.findById(remarkId, (err,remark) => {
        res.render('remarkEditForm', {remark})
        console.log(remark)
    })
})
router.post('/:id/edit', (req,res,next) => {
    var remarkId = req.params.id
    Remark.findByIdAndUpdate(remarkId, req.body, (err,remark) => {
        if (err) return next(err)
        res.redirect('/events/' + remark.eventId)
    })
})


module.exports = router