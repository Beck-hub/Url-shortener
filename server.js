const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const ShortUrl = require('./model/shortUrl'); // We can now use our model in this file
app.use(cors())
app.use(bodyParser.json())

app.use(express.static('public'));
app.use(express.urlencoded({extended: false})) // could be true or false
app.set("view engine", "ejs");
// we want to connect to our database: // urlShortener (whatever we want to call our database)

mongoose.connect('mongodb://localhost/urlShortener', { useNewUrlParser: true, useUnifiedTopology: true  } )
app.get("/", async (req,res) => {
    const shortUrls = await ShortUrl.find(); // returns everything
    //console.log(shortUrls); //must use async & await or you will get not what you want here
    res.render('index', {shortUrls: shortUrls}) // we can pass on our model to index
    // the model looks like: 
   // [
// {
   //       clicks: 0,
     //     _id: 5f14549754e0506daa0506e2,
     //     full: 'https://courses.webdevsimplified.com',
      //    short: 'y_Yg4Bgda', 
      //    __v: 0
      // },
   // ]
})
app.post("/shortUrls", async (req,res) => {
    // we want to connect to our database & create a new short url
    // create a new model:
    try {
    await ShortUrl.create({full:req.body.fullUrl}) // this is the name of the input in the ejs file
    // it is an async action that happens in the background
    // we want to wait for this creation before moving on
    } catch {
        res.json({error: "This is an error message"})
    }
    res.redirect("/")
})
// this is the route that we have to create in order to be able to click
// on the newly generated short url that will lead us to the next site 
app.get("/:shortUrl", async (req,res )=> {
    try {
      const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl}) // find one based on the short key, if the value of the short key is equal to the parameter entered
      shortUrl.clicks++ // if the user clicks on this => increase the # clicks in the model
      shortUrl.save(); // update the model/save
      res.redirect(shortUrl.full) // and redirect the user to the site (the full url) 
    } catch {
        res.json({error: "This is an error message"})
        
        //if (err) res.json({err: "This is an error message"})
        //if (shortUrl==null) return res.sendStatus(404 );
    }

 
}) 
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is working.")
   
})