var express = require('express');
var router = express.Router();
let url = require('url');
let qs = require('querystring');
var Event = require('../models/Event')
var Remark = require('../models/Remark')

// Get All Events

router.get('/', (req,res,next) => {
  Event.find({}, (err,events) => {
    if (err) return next(err)
    
    // array for categories
    let categoryArr = new Set(events.map((event) => {
      return event.event_category
    }))
    console.log(categoryArr)

    // array for locations
    let locationArr = new Set(events.map((event) => {
      return event.location.trim()
    }))
    console.log(locationArr)

    res.render('eventList', {events, categoryArr, locationArr})
  })  
})

// Create Event

router.get('/new', (req,res,next) => {
  res.render('eventCreateForm')
})

router.post('/new', (req,res,next) => {
  let data = req.body
  console.log(data)
  data.event_category = data.category.split(' ')

  Event.create(data, (err,event) => {
    if(err) return next(err)
    res.redirect('/events')
  })
})

// Event Details

router.get('/:id', (req,res,next) => {
  let id = req.params.id
  Event.findById(id)
  .populate('remarks')
  .exec((err, event) => {
    if(err) return next(err)
    res.render('eventDetails', {event})
  })
})


// Edit Event

router.get('/:id/edit', (req,res,next) => {
  var id = req.params.id
  Event.findById(id, (err,event) => {
    if(err) return next(err)
    res.render('eventEditForm', {event})
  })
})

router.post('/:id/edit', (req,res,next) => {
  var id = req.params.id
  var data = req.body
  data.event_category = data.category.split(' ')

  Event.findByIdAndUpdate(id, data, (err,event) => {
    if (err) return next(err)
    res.redirect('/events/' + id )
  })
})

// delete event

router.get('/:id/delete', (req,res,next) => {
  var id = req.params.id
  Event.findByIdAndDelete(id, (err,deletedEvent) => {
    if(err) return next(err)
    Remark.deleteMany({eventId: deletedEvent.id}, (err,info) => {
      if(err) return next(err)
      res.redirect('/events')
    })
  })
})

// event like handler

router.get('/:id/like/inc', (req,res,next) => {
  let eventId = req.params.id
  Event.findByIdAndUpdate(eventId, {$inc: {likes: 1} }, (err,event) => {
    if (err) return next(err);
    res.redirect('/events/' + eventId);
  })
})

// event dislike handler

router.get('/:id/like/dec', (req, res, next) => {
  let eventId = req.params.id;
  Event.findByIdAndUpdate(eventId, { $inc: { likes: -1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + eventId);
  })
})

// create remark

router.post('/:id/remarks/new', (req,res,next) => {
  let eventId = req.params.id
  req.body.eventId = eventId
  Remark.create(req.body, (err,remark) => {
    if (err) return next(err)
    Event.findByIdAndUpdate(eventId, {$push: {remarks: remark.id }}, (err,info) => {
      if (err) return next(err)
      res.redirect('/events/' + eventId)
    })
  })
})

// sorting by category

router.get('/sort/tags', (req,res,next) => {
  console.log(req.query)
  let parsedUrl = url.parse(req.url)
  let queryObj = qs.parse(parsedUrl.query)
  console.log('parsedurl:',parsedUrl, 'queryobj:', queryObj)
  
  Event.find({ event_category:queryObj.name }, (err,events) => {
    if (err) return next(err)
    Event.find({}, (err,info) => {
      if (err) return next(err)
      
      // arr for categories

      let categoryArr = info.map((elm) => {
        return elm.event_category
      })

      // arr for locations

      let locationArr = info.map((elm) => {
        return elm.location.trim()
      })

      res.render('eventList', {events, categoryArr, locationArr})
    })
  })
})

//sorting by locations

router.get('/sort/location', (req, res, next) => {
  let parsedUrl = url.parse(req.url);
  let queryObj = qs.parse(parsedUrl.query);
  console.log(queryObj.name);

  Event.find({ location: queryObj.name }, (err, events) => {
    if (err) return next(err);
    Event.find({}, (err, dummy) => {
      if (err) return next(err);

      //arr for array of categories

      let categoryArr = dummy.map((ele) => {
        return ele.event_category;
      })

      // arrLocations for array of locations

      let locationArr = dummy.map((ele) => {
        return ele.location.trim();
      })

      res.render('eventList', { events, categoryArr, locationArr });
    })
  })
})

//sorting by date

router.get('/sort/date/:type', (req, res, next) => {
  let type = req.params.type;

  //for sorting in accending order
  if (type === 'acc') {
    Event.find({})
      .sort({ start_date: 1 })
      .exec((err, events) => {
        if (err) return next(err);

        Event.find({}, (err, info) => {
          if (err) return next(err);

          //arr for array of categories

          let categoryArr = info.map((ele) => {
            return ele.event_category;
          })

          // arrLocations for array of locations

          let locationArr = info.map((ele) => {
            return ele.location.trim();
          })

          res.render('eventList', { events, categoryArr, locationArr });
        });
      });
  } else if (type === 'dec') {
    //for sorting in secending order
    Event.find({})
      .sort({ start_date: -1 })
      .exec((err, events) => {
        if (err) return next(err);

        Event.find({}, (err, info) => {
          if (err) return next(err);

          //arr for array of categories

          let categoryArr = info.map((ele) => {
            return ele.event_category;
          })

          // arrLocations for array of locations

          let locationArr = info.map((ele) => {
            return ele.location.trim();
          })

          res.render('eventList', { events, categoryArr, locationArr });
        });
      });
  } else {
    next();
  }
})

module.exports = router;
