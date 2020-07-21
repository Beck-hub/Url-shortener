const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const NewUrl = require('./model/shortUrl'); // We can now use our model in this file

const app = express();
app.use(cors());
app.use(bodyParser.json()); // that we are dealing w/ json in our responses;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false})) // could be true or false
app.set("view engine", "ejs");
// we want to connect to our database: // urlShortener (whatever we want to call our database)

mongoose.connect('mongodb://localhost/urlShortener', { useNewUrlParser: true, useUnifiedTopology: true  } )
app.get("/", async (req,res) => {
    const findUrls = await NewUrl.find(); // returns everything
    //must use async & await or you will get not what you want here
    res.render('index', {findUrls: findUrls}) // we can pass on our model to index

})
app.post("/shortenedUrl", async (req,res) => {
    // we want to connect to our database & create a new short url
    // create a new model:
    try {
    await NewUrl.create({longUrl:req.body.longUrl}) // this is the name of the input in the ejs file
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
      const shortUrl = await NewUrl.findOne({shortUrl: req.params.shortUrl}) // find one based on the short key, if the value of the short key is equal to the parameter entered
      shortUrl.views++ // if the user clicks on this => increase the # clicks in the model
      shortUrl.date = new Date().toUTCString();
      shortUrl.save(); // update the model/save
      res.redirect(shortUrl.longUrl) // and redirect the user to the site (the longUrl url)
      console.log(shortUrl)
    } catch {
        res.json({error: "This is an error message"})


    }
 
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is working.")

})
