const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//setting up server at port 3000
app.listen(process.env.PORT || 3000, function() {

  console.log("server is running on port 3000")
})

//when someone loads the route port 3000
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

//when someone submits an entry (i.e. signs up)
app.post("/", function(req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/ccf5e6a6ce";

  const options = {
    method: "POST",
    auth: "corn:c90b7d0f2470b6a52494c28efc5f3252-us21"
  };

  const request = https.request(url, options, function(response) {
    var submissionStatus = response.statusCode;
    if (submissionStatus === 40) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});



// // api key
// c90b7d0f2470b6a52494c28efc5f3252 - us21
//
// //list id
// ccf5e6a6ce
