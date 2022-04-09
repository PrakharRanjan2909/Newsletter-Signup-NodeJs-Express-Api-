const express = require("express");
const https = require("https"); //only get request but actually we want to post also
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public_static_files"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  }; //this we are going to send to mailchimp

  const jsonData = JSON.stringify(data);
  //next step to make our request to mailchimp

  const url = "https://us14.api.mailchimp.com/3.0/lists/a8d539e528";
  const options = {
    method: "POST",
    auth: "prakhar:1f2fccced71db8e502166b9bf763f84f-us14", //according to mailchimp, we need authentication, so we put this; also authication contains any string followed bt:api key
  };

  const request = https.request(url, options, function (response) {
    //we need to save our request as constant and then send request to mail chimp with json data

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else res.sendFile(__dirname + "/failure.html");

    // response.on("data", function (response) {
    // //  console.log(JSON.parse(data));
    // });
  });

  request.write(jsonData);
  request.end();
  console.log(firstname, lastname, email);
});
app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server startd in port 3000");
});

//api key
//1f2fccced71db8e502166b9bf763f84f-us14

//list id/audience id
//a8d539e528
