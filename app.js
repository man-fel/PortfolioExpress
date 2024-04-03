require("dotenv").config();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const https = require("https");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

app.set('view engine', 'ejs');

app.use(session({
    secret: "secret",
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.route("/")
    .get((req, res)=>{
        res.render("home");
})
app.route("/about")
    .get((req, res)=>{
        res.render("about");
})
app.route("/services")
    .get((req, res)=>{
        res.render("services");
})
app.route("/portfolio")
    .get((req, res)=>{
        res.render("portfolio");
})

app.route("/contact")
    .get((req, res) => {
        res.render("contact");
    })
    .post((req, res) => {
        const firstName = req.body.fname;
        const lastName = req.body.lname;
        const email = req.body.email;
        const contact = req.body.contact;

        const data = {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName,
                        PHONE: contact
                    }
                }
            ]
        };

        const jsonData = JSON.stringify(data);

        const url = "https://us21.api.mailchimp.com/3.0/lists/" + process.env.AUDIENCE_ID;

        const options = {
            method: "POST",
            auth: "felix2:" + process.env.API_KEY
        };

        const request = https.request(url, options, function(response) {
            let responseData = '';

            response.on("data", function(data) {
                responseData += data;
            });

            response.on("end", function() {
                console.log(JSON.parse(responseData));
            });
        });

        request.write(jsonData);
        request.end();
        res.redirect("/contact");
    });

app.listen(port, "0.0.0.0", function(){
    console.log("Server started on port 3000");
});
